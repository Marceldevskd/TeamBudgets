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
    } catch (error: any) {
        // Joi validation error
        if (error.isJoi && error.details) {
            return res.status(400).send({ 
                error: `Invalid request parameters: ${error.details[0].message}` 
            });
        }

        // Unknown internal error
        console.error(error);
        return res.status(500).send({ error: "Internal server error" });
    }
    return getBudgetsController(req, res);
});

budgetRouter.post("/", async (req: CreateBudgetsRequest, res: CreateBudgetsResponse) => {
    try {
        await BudgetValidator.createBudget().validateAsync(req.body);
    } catch (error: any) {
        // Joi validation error
        if (error.isJoi && error.details) {
            return res.status(400).send({ 
                error: `Invalid request parameters: ${error.details[0].message}` 
            });
        }

        // Unknown internal error
        console.error(error);
        return res.status(500).send({ error: "Internal server error" });
    }
    return
});

budgetRouter.put("/", async (req: ChangeBudgetsRequest, res: ChangeBudgetsResponse) => {
    try {
        await BudgetValidator.changeBudget().validateAsync(req.body);
    }catch (error: any) {
        // Joi validation error
        if (error.isJoi && error.details) {
            return res.status(400).send({ 
                error: `Invalid request parameters: ${error.details[0].message}` 
            });
        }

        // Unknown internal error
        console.error(error);
        return res.status(500).send({ error: "Internal server error" });
    }
    return
});

export default budgetRouter;