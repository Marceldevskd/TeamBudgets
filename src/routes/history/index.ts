import express from "express";
import { GetHistoryRequest, GetHistoryResponse } from "../../routes/history/types";
import HistoryValidator from "./schema";
import { getHistoryController } from "../../controllers/history";

const historyRouter = express.Router();

/**
 * @swagger
 * /history:
 *   get:
 *     summary: Retrieve budget transaction history
 *     parameters:
 *       - in: query
 *         name: budget_id
 *         schema:
 *           type: integer
 *         description: Filter history by budget id (at least one of budget_id or budget_name is required)
 *       - in: query
 *         name: budget_name
 *         schema:
 *           type: string
 *         description: Filter history by budget name (at least one of budget_id or budget_name is required)
 *     responses:
 *       200:
 *         description: Budget history
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 body:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "83b3a5dc-6b50-4195-83b2-2ad2e845d269"
 *                       team_id:
 *                         type: string
 *                         example: "5f8d0d55b54764421b7156c3"
 *                       team_name:
 *                         type: string
 *                         example: "Marketing"
 *                       budget_name:
 *                         type: string
 *                         example: "Marketing Q1"
 *                       amount:
 *                         type: number
 *                         example: 150000
 *                       history:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               example: "3fc3d669-82f0-4e45-8f4b-01f1b2a9b6da"
 *                             person_name:
 *                               type: string
 *                               example: "John Doe"
 *                             amount:
 *                               type: number
 *                               example: 250
 *                             date:
 *                               type: string
 *                               format: date
 *                               example: "2024-02-15"
 *                             description:
 *                               type: string
 *                               example: "Team lunch"
 *                             remaining_budget:
 *                               type: number
 *                               example: 149750
 *       400:
 *         description: Invalid request parameters
 *       500:
 *         description: Internal server error
 */
historyRouter.get("/", async (req: GetHistoryRequest, res: GetHistoryResponse) => {
    try {
        await HistoryValidator.getHistory().validateAsync(req.query);
    }
    catch (error: any) {
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
    return getHistoryController(req, res);
});

export default historyRouter;