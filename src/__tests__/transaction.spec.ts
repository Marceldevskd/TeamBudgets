import axios, { AxiosResponse } from 'axios';
import { describe, it, expect, beforeAll } from 'vitest';

import { teams, people, budgets } from '../__tests__/seeded-data';

const baseUrl = 'http://localhost:9001/api/transaction';
let res: AxiosResponse<any, any>;


// IMPORTANT: Tests could interfere with each other due to shared state (budgets being consumed by transactions).

describe('Testing GET transaction api without params', () => {
    beforeAll(async () => {
        res = await axios.get(`${baseUrl}`);
    });
    it('should respond with status code 200', () => {
        expect(res.status).toEqual(200);
    });
    it('should return an array of transactions', () => {
        expect(Array.isArray(res.data)).toBe(true);
    });
    // it should have the correct properties in each transaction object
});

describe('Testing POST transaction api', () => {
    const newTransaction = {
        person_name: people[0].name,
        amount: 1500,
        date: '2024-06-15',
        description: 'Client payment'
    };
    beforeAll(async () => {
        res = await axios.post(`${baseUrl}`, newTransaction);
    });

    it('should respond with status code 201', () => {
        expect(res.status).toEqual(201);
    });

    it('should return the created transaction with correct properties', () => {
        const transaction = res.data;
        expect(transaction).toHaveProperty('id');
        expect(transaction).toHaveProperty('person_name', newTransaction.person_name);
        expect(transaction).toHaveProperty('amount', newTransaction.amount);
        expect(transaction).toHaveProperty('date', newTransaction.date);
        expect(transaction).toHaveProperty('description', newTransaction.description);
        expect(transaction).toHaveProperty('team_name');
        expect(transaction).toHaveProperty('team_id', people[0].team);
        expect(transaction).toHaveProperty('remaining_budget');
    });
});

describe("testing POST transaction api with no allocated budgets", () => {
    const newTransaction = {
        person_name: people[4].name, // Eve from Finance team
        amount: 2_000,
        date: '2024-07-10',
        description: 'Office supplies'
    };
    beforeAll(async () => {
        res = await axios.post(`${baseUrl}`, newTransaction);
    });

    it('should respond with status code 403', () => {
        expect(res.status).toEqual(403);
    });

    it('should return an error message indicating no open budget', () => {
        expect(res.data).toHaveProperty('error', 'No allocated budgets for the team');
    });
});

describe('testing POST transaction api exceeding budget', () => {
    const newTransaction = {
        person_name: people[2].name, // Charlie from Marketing team (id:2)
        amount: 600_000, // Exceeds the allocated budget of 75000
        date: '2024-07-15',
        description: 'Marketing campaign'
    };
    beforeAll(async () => {
        res = await axios.post(`${baseUrl}`, newTransaction);
    });

    it('should respond with status code 403', () => {
        expect(res.status).toEqual(403);
    });

    it('should return an error message indicating budget exceeded', () => {
        expect(res.data).toHaveProperty('error', 'Transaction amount exceeds remaining budget');
    });
});

describe('testing POST transaction api with non-existent person', () => {
    const newTransaction = {
        person_name: 'NonExistentPerson',
        amount: 1_000,
        date: '2024-07-20',
        description: 'Test transaction'
    };
    beforeAll(async () => {
        res = await axios.post(`${baseUrl}`, newTransaction);
    });

    it('should respond with status code 400', () => {
        expect(res.status).toEqual(400);
    });

    it('should return an error message indicating person does not exist', () => {
        expect(res.data).toHaveProperty('error', 'Person does not exist');
    });
});

describe('testing POST transaction api with missing date', () => {
    const newTransaction = {
        person_name: people[1].name, // Bob from Engineering team
        amount: 500,
        description: 'Team lunch'
    };
    // expects a date in before 31-12-2026 to be passed
    beforeAll(async () => {
        res = await axios.post(`${baseUrl}`, newTransaction);
    });

    it('should respond with status code 201', () => {
        expect(res.status).toEqual(201);
    });

    it('should return the created transaction with current date', () => {
        const transaction = res.data;
        expect(transaction).toHaveProperty('id');
        expect(transaction).toHaveProperty('person_name', newTransaction.person_name);
        expect(transaction).toHaveProperty('amount', newTransaction.amount);
        expect(transaction).toHaveProperty('description', newTransaction.description);
        expect(transaction).toHaveProperty('team_name');
        expect(transaction).toHaveProperty('team_id', people[1].team);
        expect(transaction).toHaveProperty('budget_name', budgets[0].name); // '2025 budget Engineering'
        expect(transaction).toHaveProperty('remaining_budget');
    });
});

describe('testing POST transaction api with multiple available budgets', () => {
    const newTransaction = {
        person_name: people[0].name, // Alice from Engineering team
        amount: 30_000,
        date: '2024-07-25',
        description: 'New equipment'
    };
    beforeAll(async () => {
        res = await axios.post(`${baseUrl}`, newTransaction);
    });
    it('should respond with status code 201', () => {
        expect(res.status).toEqual(201);
    });
    it('should allocate from the budget with the earliest end_date', () => {
        const transaction = res.data;
        expect(transaction).toHaveProperty('id');
        expect(transaction).toHaveProperty('person_name', newTransaction.person_name);
        expect(transaction).toHaveProperty('amount', newTransaction.amount);
        expect(transaction).toHaveProperty('date', newTransaction.date);
        expect(transaction).toHaveProperty('description', newTransaction.description);
        expect(transaction).toHaveProperty('team_name');
        expect(transaction).toHaveProperty('team_id', people[0].team);
        expect(transaction).toHaveProperty('budget_name', budgets[1].name); // '2024 summer budget Engineering' ends earlier
        expect(transaction).toHaveProperty('remaining_budget');
    });
});

describe('Testing POST transaction api with 1 available budget', () => {
    const newTransaction = {
        person_name: people[1].name, // Bob from Engineering team
        amount: 5_000,
        date: '2024-09-01',
        description: 'Software licenses'
    };
    beforeAll(async () => {
        res = await axios.post(`${baseUrl}`, newTransaction);
    });
    it('should respond with status code 201', () => {
        expect(res.status).toEqual(201);
    });
    it('should allocate from the only available budget', () => {
        const transaction = res.data;
        expect(transaction).toHaveProperty('id');
        expect(transaction).toHaveProperty('person_name', newTransaction.person_name);
        expect(transaction).toHaveProperty('amount', newTransaction.amount);
        expect(transaction).toHaveProperty('date', newTransaction.date);
        expect(transaction).toHaveProperty('description', newTransaction.description);
        expect(transaction).toHaveProperty('team_name');
        expect(transaction).toHaveProperty('team_id', people[1].team);
        expect(transaction).toHaveProperty('budget_name', budgets[0].name); // '2024 budget Engineering' is the only available budget
        expect(transaction).toHaveProperty('remaining_budget');
    });
});