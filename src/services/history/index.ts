import pool from "../../database";

export async function getHistoryService(req: any, res: any) {
    const { budget_id, budget_name } = req.query;

    let result: any;
    if (budget_id !== undefined) {
        result = await pool.query(`
            SELECT 
                budgets.id as id,
                budgets.team as team_id,
                teams.name as team_name,
                budgets.name as budget_name,
                budgets.amount as amount
            FROM budgets
            JOIN teams ON budgets.team = teams.id
            WHERE budgets.id = $1
        `, [budget_id]);
    } else if (budget_name !== undefined) {
        result = await pool.query(`
            SELECT 
                budgets.id as id,
                budgets.team as team_id,
                teams.name as team_name,
                budgets.name as budget_name,
                budgets.amount as amount
            FROM budgets
            JOIN teams ON budgets.team = teams.id
            WHERE budgets.name = $1
        `, [budget_name]);
    }

    if (!result || result.rows.length === 0) {
        throw new Error("Database query failed or no budgets found");
    }

    const transactions = await pool.query(`
        SELECT 
            transactions.id as id,
            people.name as person_name,
            transactions.amount as amount,
            transactions.date as date,
            transactions.description as description,
            (budgets.amount - COALESCE(SUM(transactions.amount) OVER (ORDER BY transactions.date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW), 0)) as remaining_budget
        FROM transactions
        JOIN people ON transactions.person = people.id
        JOIN budgets ON transactions.budget = budgets.id
        WHERE budgets.id = $1
        ORDER BY transactions.date DESC
    `, [result.rows[0].id]);

    result.rows[0].history = transactions.rows;
    
    return res.status(200).json(result.rows[0]);
}