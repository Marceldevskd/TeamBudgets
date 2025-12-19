import express from "express";

import { GetBudgetsRequest, GetBudgetsResponse, CreateBudgetsRequest, CreateBudgetsResponse, ChangeBudgetsRequest, ChangeBudgetsResponse } from "../../routes/budget/types";
import BudgetValidator from "./schema";


import { getBudgetsController } from "../../controllers/budget";


/**
 * @swagger
 * /budget:
 *   get:
 *     summary: Retrieve a list of budgets
 *     parameters:
 *       - in: query
 *         name: active_only
 *         schema:
 *           type: boolean
 *         description: Filter active budgets only
 *       - in: query
 *         name: team_id
 *         schema:
 *           type: integer
 *         description: Filter budgets by team id
 *       - in: query
 *         name: team_name
 *         schema:
 *           type: string
 *         description: Filter budgets by team name
 *       - in: query
 *         name: person_name
 *         schema:
 *           type: string
 *         description: Filter budgets by person name
 *     responses:
 *       200:
 *         description: A list of budgets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "83b3a5dc-6b50-4195-83b2-2ad2e845d269"
 *                   team_id:
 *                     type: string
 *                     example: "5f8d0d55b54764421b7156c3"
 *                   team_name:
 *                     type: string
 *                     example: "Marketing"
 *                   amount:
 *                     type: number
 *                     example: 150000
 *                   start_date:
 *                     type: string
 *                     format: date
 *                     example: "2024-01-01"
 *                   end_date:
 *                     type: string
 *                     format: date
 *                     example: "2024-12-31"
 *       400:
 *         description: Invalid request parameters
 *       500:
 *         description: Internal server error
 */

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

// budgetRouter.post("/", async (req: CreateBudgetsRequest, res: CreateBudgetsResponse) => {
//     try {
//         await BudgetValidator.createBudget().validateAsync(req.body);
//     } catch (error: any) {
//         // Joi validation error
//         if (error.isJoi && error.details) {
//             return res.status(400).send({ 
//                 error: `Invalid request parameters: ${error.details[0].message}` 
//             });
//         }

//         // Unknown internal error
//         console.error(error);
//         return res.status(500).send({ error: "Internal server error" });
//     }
//     return
// });

// budgetRouter.put("/", async (req: ChangeBudgetsRequest, res: ChangeBudgetsResponse) => {
//     try {
//         await BudgetValidator.changeBudget().validateAsync(req.body);
//     }catch (error: any) {
//         // Joi validation error
//         if (error.isJoi && error.details) {
//             return res.status(400).send({ 
//                 error: `Invalid request parameters: ${error.details[0].message}` 
//             });
//         }

//         // Unknown internal error
//         console.error(error);
//         return res.status(500).send({ error: "Internal server error" });
//     }
//     return
// });

export default budgetRouter;