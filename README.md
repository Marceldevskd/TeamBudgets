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
  - seeds automatically when starting

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


