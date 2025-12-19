# TeamBudgets - Lightbase Assessment

## Description

TeamBudgets enables teams at Lightbase to manage shared budgets for software, hardware, and conferences. Key features include:

- **Shared budgets** accessible to all team members
- **Time-limited validity** (e.g., annual or seasonal budgets)
- **Budget visibility** for viewing available funds and remaining balances
- **Automatic transactions** that intelligently apply to the optimal available budget

Team members can execute transactions by specifying an amount, and the system automatically allocates funds efficiently across active budgets.

## Running

- PostgreSQL database:
  - Seeds automatically when starting with no data

```sh
docker compose up
```

- Express.js with ts backend:

```sh
npm i
npm run dev
```

- Run Vitest tests:

```sh
npx vitest
```

## Technology choices

### Backend

#### TypeScript

I wanted the freedom to use types for the backend, did not end up using very much of TypeScript though.

#### Express.js

I am familiar with Express.js and wanted to use a JS/TS solution for the backend I decided to use Express.

### Database

#### PostgreSQL

I decided to use a relational database for this project because it involves relational data. Given the scale of the project, I did not consider alternative database solutions further.

## Current limitations / future possibilities

- No way for putting in extra budgets.
- People can only be assigned to one team.
- A budget can only be assigned to one team.
- No individual person per employee (can be fixed when people can be in multiple teams by making a team for every employee).
- No option to choose for a certain budget when buying something, now only searching for the most optimal budget.
- No option to split purchase over multiple budgets (can be worked around by using multiple transactions).
