import pool from "../../database";

import { CreateTransactionRequest, CreateTransactionResponse } from "../../routes/transaction/types";

export async function createTransactionService(req: CreateTransactionRequest, res: CreateTransactionResponse) {
    const { person_name, amount, description} = req.body;
    let { date } = req.body;

    if (date === undefined) {
        const currentDate = new Date().toISOString().split('T')[0];
        date = currentDate;
    }

    const result = await pool.query(
        `SELECT budgets.*, teams.name AS team_name FROM budgets
        JOIN teams ON budgets.team = teams.id
        WHERE team = (SELECT team FROM people WHERE name = $1)
        AND start_date <= $2
        AND end_date >= $2
        ORDER BY end_date ASC`,
        [person_name, date]
    );

    if (result.rowCount === 0) {
        return res.status(403).send({ error: "No active budget for the person's team on the given date" });
    }

    for (const budget of result.rows) {
        if (budget.amount >= amount) {
            await pool.query(
                `INSERT INTO transactions (person, amount, description, date, budget)
                VALUES ((SELECT id FROM people WHERE name = $1), $2, $3, $4, $5)`,
                [person_name, amount, description, date, budget.id]
            );
            const idResult = await pool.query(
                `SELECT id FROM transactions
                WHERE person = (SELECT id FROM people WHERE name = $1) AND amount = $2 AND description = $3 AND date = $4 AND budget = $5
                ORDER BY id DESC
                LIMIT 1`,
                [person_name, amount, description, date, budget.id]
            );
            const id = idResult.rows[0].id;

            await pool.query(
                `UPDATE budgets
                SET amount = amount - $1
                WHERE id = $2`,
                [amount, budget.id]
            );

            return res.status(201).json({
                id,
                person_name,
                amount,
                description,
                date,
                team_id: budget.team,
                team_name: budget.team_name,
                budget_name: budget.name,
                remaining_budget: budget.amount - amount
            });
        } 
    }
    res.status(403).send({ error: "Transaction amount exceeds remaining budget" });
}