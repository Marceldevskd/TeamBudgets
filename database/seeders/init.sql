
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
INSERT INTO budgets (name, team, amount, start_date, end_date) VALUES
  ('2024 budget Engineering', 1, 100000.00, '2024-01-01', '2024-12-31'),
  ('2024 summer budget Engineering', 1, 50000.00, '2024-06-01', '2024-08-31'),
  ('2023-2025 budget Marketing', 2, 75000.00, '2023-01-01', '2025-12-31'),
  ('2025 budget Engineering', 1, 120000.00, '2025-01-01', '2025-12-31')
ON CONFLICT (id) DO NOTHING;