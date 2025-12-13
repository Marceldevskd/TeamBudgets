import { Request, Response } from "express";

export interface GetBudgetsRequest extends Request {
    query: {
        active_only?: boolean;
        team_id?: string;
        team_name?: string;
        person_name?: string;
    };
}

export type GetBudgetsResponse = Response<
    {
        body: Array<{
            id: string;
            team_id: string;
            team_name: string;
            amount: number;
            start_date: string;
            end_date: string;
        }>;
    } | { error: string }
> 

export type CreateBudgetsRequest = Request<
    unknown,                    // Params
    unknown,                    // ResBody
    unknown,                    // ReqBody
    unknown                     // Query params
>;

export type CreateBudgetsResponse = Response<unknown | { error: string }>;
export type ChangeBudgetsRequest = Request<
    unknown,                    // Params
    unknown,                    // ResBody
    unknown,                    // ReqBody
    unknown                     // Query params
>;
export type ChangeBudgetsResponse = Response<unknown | { error: string }>;