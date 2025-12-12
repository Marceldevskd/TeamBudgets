import { Request, Response } from "express";

export interface CreateTransactionRequest extends Request {
    body: {
        person_name: string;
        amount: number;
        description: string;
        date?: string;
    };
}

export interface CreateTransactionResponse extends Response {
    json: (body: {
        id: string;
        person_name: string;
        amount: number;
        date: string;
        description: string;
        team_name: string;
        team_id: string;
        budget_name: string;
        remaining_budget: number;
    }) => Response;
}
