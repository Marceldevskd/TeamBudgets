import express from "express";

import { GetBudgetsRequest, GetBudgetsResponse, CreateBudgetsRequest, CreateBudgetsResponse, ChangeBudgetsRequest, ChangeBudgetsResponse } from "../../routes/budget/types";
import BudgetValidator from "./schema"


import { getBudgetsController } from "../../controllers/budget";
import { createBudgetController } from "../../controllers/budget";
import { changeBudgetController } from "../../controllers/budget";


const budgetRouter = express.Router();

budgetRouter.get("/", async (req: GetBudgetsRequest, res: GetBudgetsResponse) => {
    try {
        await BudgetValidator.getBudgets().validateAsync(req.query);
    } catch (error:any) {
        return res.status(400).send({ error: `Invalid request parameters: ${error.details[0].message}` });
    }
    return getBudgetsController(req, res);
});

budgetRouter.post("/", async (req: CreateBudgetsRequest, res: CreateBudgetsResponse) => {
    try {
        await BudgetValidator.createBudget().validateAsync(req.body);
    } catch (error:any) {
        return res.status(400).send({ error: `Invalid request parameters: ${error.details[0].message}` });
    }
    return
});

budgetRouter.put("/", async (req: ChangeBudgetsRequest, res: ChangeBudgetsResponse) => {
    try {
        await BudgetValidator.changeBudget().validateAsync(req.body);
    } catch (error:any) {
        return res.status(400).send({ error: `Invalid request parameters: ${error.details[0].message}` });
    }
    return
});

export default budgetRouter;