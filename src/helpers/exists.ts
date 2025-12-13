import pool from "../database";

export const checkIfExists = async (table: string, column: string, value: string): Promise<boolean> => {
    const query = `SELECT id FROM ${table} WHERE ${column} = $1`;
    const result = await pool.query(query, [value]);
    if (result.rowCount === 0 || !result) {
        return false;
    }
    return true;
}