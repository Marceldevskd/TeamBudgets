-- 08-12-2025 17:00
-- PURPOSE: Seed initial data for TeamBudgets application

-- Seed Teams
INSERT INTO teams (id, name) VALUES
  (1, 'Engineering'),
  (2, 'Marketing'),
  (3, 'Finance')
ON CONFLICT (id) DO NOTHING;

-- Seed People
INSERT INTO people (name, team) VALUES
  ('Alice', 1),
  ('Bob', 1),
  ('Charlie', 2),
  ('Diana', 2),
  ('Eve', 3)
ON CONFLICT (id) DO NOTHING;

-- Seed Budgets
INSERT INTO budgets (team, amount, start_date, end_date) VALUES
  (1, 100000.00, '2024-01-01', '2024-12-31'),
  (2, 50000.00, '2024-06-01', '2024-08-31'),
  (3, 75000.00, '2025-01-01', '2025-12-31')
ON CONFLICT (id) DO NOTHING;