import pool from "../../database";

import { GetBudgetsRequest, GetBudgetsResponse } from "../../routes/budget/types";

export async function getBudgetsService(req: GetBudgetsRequest, res: GetBudgetsResponse) {
    const { active_only, team_id, team_name, person_name } = req.query;

    const conditions: string[] = [];
    const values: any[] = [];

    if (active_only !== undefined) {
        values.push(active_only === true);
        conditions.push(`active = $${values.length}`);
    }

    if (team_id) {
        values.push(team_id);
        conditions.push(`team_id = $${values.length}`);
    }

    if (team_name) {
        values.push(team_name);
        conditions.push(`team_name ILIKE '%' || $${values.length} || '%'`);
    }

    if (person_name) {
        values.push(person_name);
        conditions.push(`person_name ILIKE '%' || $${values.length} || '%'`);
    }

    // final SQL
    const sql = `
        SELECT *
        FROM budgets
        ${conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : ""}
    `;

    const result = await pool.query(sql, values);
    res.status(200).json(result.rows);
}