import axios, { AxiosResponse } from 'axios';
import { describe, it, expect, beforeAll } from 'vitest';

import { teams, people, budgets } from '../__tests__/seeded-data';

const baseUrl = 'http://localhost:9001/api/transaction';
let res: AxiosResponse<any, any>;

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
        amount: 2000,
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
        amount: 60000, // Exceeds the allocated budget of 50000
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
        amount: 1000,
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

