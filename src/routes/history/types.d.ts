import { Request, Response } from "express";

export interface GetHistoryRequest extends Request {
    query: {
        budget_id?: string;
        budget_name?: string;
    };
}

export type GetHistoryResponse = Response<
    {
        body: {
            id: string;
            team_id : string;
            team_name : string;
            budget_name : string;
            amount : number;
            history: Array<{
                id: string;
                person_name: string;
                amount: number;
                date: string;
                description: string;
                remaining_budget: number;
            }>;
        }[];
    } | { error: string }
>;


