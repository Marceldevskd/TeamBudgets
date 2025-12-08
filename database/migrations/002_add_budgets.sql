

CREATE TABLE IF NOT EXISTS budgets (
    id SERIAL PRIMARY KEY,
    team SERIAL REFERENCES teams(id),
    amount DECIMAL(15, 2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL
);