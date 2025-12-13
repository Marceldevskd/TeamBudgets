import pool from "../../database";

import { GetBudgetsRequest, GetBudgetsResponse } from "../../routes/budget/types";

export async function getBudgetsService(req: GetBudgetsRequest, res: GetBudgetsResponse) {
    const { active_only, team_id, team_name, person_name } = req.query;

    const conditions: string[] = [];
    const values: any[] = [];

    if (active_only !== undefined) {
        conditions.push(`start_date <= CURRENT_DATE AND end_date >= CURRENT_DATE`);
    }

    if (team_id) {
        values.push(team_id);
        conditions.push(`budgets.team = $${values.length}`);
    } else if (team_name) {
        values.push((await pool.query("SELECT id FROM teams WHERE name = $1", [team_name])).rows[0].id);
        conditions.push(`budgets.team = $${values.length}`);
    } else if (person_name) {
        values.push((await pool.query("SELECT team FROM people WHERE name = $1", [person_name])).rows[0].team);
        conditions.push(`budgets.team = $${values.length}`);
    }

    // final SQL
    const sql = `
        SELECT budgets.id as id, budgets.team as team_id, teams.name as team_name, budgets.amount as amount, budgets.start_date as start_date, budgets.end_date as end_date, (start_date <= CURRENT_DATE AND end_date >= CURRENT_DATE) as active
        FROM budgets
        JOIN teams ON budgets.team = teams.id
        ${conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : ""}
    `;
    console.log(sql, values);

    const result: any = await pool.query(sql, values);

    return res.status(200).json(result.rows);
}