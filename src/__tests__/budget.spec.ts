import axios, { AxiosResponse } from 'axios';
import { describe, it, expect, beforeAll } from 'vitest';

import { teams, people, budgets } from '../__tests__/seeded-data';

const baseUrl = 'http://localhost:9001/api/budget';
let res: AxiosResponse<any, any>;

describe('Testing GET budget api without params', () => {
    beforeAll(async () => {
        res = await axios.get(`${baseUrl}`);
    });

    it('should respond with status code 200', () => {
        expect(res.status).toEqual(200);
    });

    it('should return an array of budgets', () => {
        expect(Array.isArray(res.data)).toBe(true);
    });

    it('should have the correct properties in each budget object', () => {
        res.data.forEach((budget: any) => {
            expect(budget).toHaveProperty('id');
            expect(budget).toHaveProperty('team_id');
            expect(budget).toHaveProperty('team_name');
            expect(budget).toHaveProperty('amount');
            expect(budget).toHaveProperty('start_date');
            expect(budget).toHaveProperty('end_date');
        });
    });
});

describe('Testing GET budget api with active_only param', () => {
    beforeAll(async () => {
        res = await axios.get(`${baseUrl}?active_only=true`);
    });

    it('should respond with status code 200', () => {
        expect(res.status).toEqual(200);
    });

    it('should return an array of budgets', () => {
        expect(Array.isArray(res.data)).toBe(true);
    });

    it('should return only active budgets', () => {
        res.data.forEach((budget: any) => {
            expect(budget.active).toBe(true);
            expect(new Date(budget.start_date) <= new Date()).toBe(true);
            expect(new Date(budget.end_date) >= new Date()).toBe(true);
        });
    });

    it('should have the correct properties in each budget object', () => {
        res.data.forEach((budget: any) => {
            expect(budget).toHaveProperty('id');
            expect(budget).toHaveProperty('team_id');
            expect(budget).toHaveProperty('team_name');
            expect(budget).toHaveProperty('amount');
            expect(budget).toHaveProperty('start_date');
            expect(budget).toHaveProperty('end_date');
        });
    });
});

describe('Testing getbudget api with team_name param', () => {
    const testTeam = teams[0]; // Engineering
    beforeAll(async () => {
        res = await axios.get(
            `${baseUrl}?team_name=${encodeURIComponent(testTeam.name)}`
        );
    });

    it('should respond with status code 200', () => {
        expect(res.status).toEqual(200);
    });

    it('should return an array of budgets', () => {
        expect(Array.isArray(res.data)).toBe(true);
    });

    it(`should return budgets only for team_name=${testTeam.name}`, () => {
        res.data.forEach((budget: any) => {
            expect(budget.team_name).toBe(testTeam.name);
        });
    });

    it('should have the correct properties in each budget object', () => {
        res.data.forEach((budget: any) => {
            expect(budget).toHaveProperty('id');
            expect(budget).toHaveProperty('team_id');
            expect(budget).toHaveProperty('team_name');
            expect(budget).toHaveProperty('amount');
            expect(budget).toHaveProperty('start_date');
            expect(budget).toHaveProperty('end_date');
        });
    });
});

describe('Testing getbudget api with person_name param', () => {
    const testPerson = people[2]; // Charlie from Marketing team (id:2)
    beforeAll(async () => {
        res = await axios.get(
            `${baseUrl}?person_name=${encodeURIComponent(testPerson.name)}`
        );
    });
    it('should respond with status code 200', () => {
        expect(res.status).toEqual(200);
    });
    it('should return an array of budgets', () => {
        expect(Array.isArray(res.data)).toBe(true);
    });
    it(`should return budgets only for person_name=${testPerson.name}`, () => {
        expect(res.data.length).toBe(1);
        const data = res.data[0];
        expect(data.team_id).toBe(testPerson.team);
    });
});

describe('Testing getbudget api with team_id param', () => {
    const testTeam = teams[1]; // Marketing team (id:2)
    beforeAll(async () => {
        res = await axios.get(
            `${baseUrl}?team_id=${encodeURIComponent(testTeam.id)}`
        );
    });
    it('should respond with status code 200', () => {
        expect(res.status).toEqual(200);
    });
    it('should return an array of budgets', () => {
        expect(Array.isArray(res.data)).toBe(true);
    });
    it(`should return budgets only for team_id=${testTeam.id}`, () => {
        res.data.forEach((budget: any) => {
            expect(budget.team_id).toBe(testTeam.id);
        });
    });
});

describe('Testing getbudget api with multiple params', () => {
    const testTeam = teams[0]; // Engineering
    const active = true;
    beforeAll(async () => {
        res = await axios.get(
            `${baseUrl}?team_name=${encodeURIComponent(testTeam.name)}&active_only=${active ? 'true' : 'false'}`
        );
    });
    it('should respond with status code 200', () => {
        expect(res.status).toEqual(200);
    });
    it('should return an array of budgets', () => {
        expect(Array.isArray(res.data)).toBe(true);
    });
    it(`should return budgets only for team_name=${testTeam.name} and active_only=${active}`, () => {
        res.data.forEach((budget: any) => {
            expect(budget.team_name).toBe(testTeam.name);
            expect(new Date(budget.start_date) <= new Date()).toBe(true);
            expect(new Date(budget.end_date) >= new Date()).toBe(true);
        });
    });
});

describe('Testing getbudget api with no matching results', () => {
    beforeAll(async () => {
        res = await axios.get(
            `${baseUrl}?team_name=NonExistentTeam`
        );
    });
    it('should respond with status code 200', () => {
        expect(res.status).toEqual(200);
    });
    it('should return an empty array', () => {
        expect(Array.isArray(res.data)).toBe(true);
        expect(res.data.length).toBe(0);
    });
});