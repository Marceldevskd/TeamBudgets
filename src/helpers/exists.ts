import pool from "../database";

export const team_id_exists = async (team_id: string): Promise<boolean> => {
    const result = await pool.query("SELECT id FROM teams WHERE id = $1", [team_id]);
    if (result.rowCount === 0 || !result) {
        return false;
    }
    return true;
}

export const team_name_exists = async (team_name: string): Promise<boolean> => {
    const result = await pool.query("SELECT id FROM teams WHERE name = $1", [team_name]);
    if (result.rowCount === 0 || !result) {
        return false;
    }
    return true;
}

export const person_name_exists = async (person_name: string): Promise<boolean> => {
    const result = await pool.query("SELECT id FROM people WHERE name = $1", [person_name]);
    if (result.rowCount === 0 || !result) {
        return false;
    }
    return true;
}

export const checkIfExists = async (table: string, column: string, value: string): Promise<boolean> => {
    const query = `SELECT id FROM ${table} WHERE ${column} = $1`;
    const result = await pool.query(query, [value]);
    if (result.rowCount === 0 || !result) {
        return false;
    }
    return true;
}