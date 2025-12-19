import express from "express";
import { CreateTransactionRequest, CreateTransactionResponse } from "../../routes/transaction/types";
import TransactionValidator from "./schema"
import { createTransactionController } from "../../controllers/transaction";

const transactionRouter = express.Router();

/**
 * @swagger
 * /transaction:
 *   post:
 *     summary: Create a new transaction
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - person_name
 *               - amount
 *               - description
 *             properties:
 *               person_name:
 *                 type: string
 *                 example: "Charlie"
 *               amount:
 *                 type: number
 *                 minimum: 0.01
 *                 example: 250
 *               description:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 255
 *                 example: "Team lunch"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2024-02-15"
 *                 description: Optional. Uses current date if not provided.
 *     responses:
 *       201:
 *         description: Transaction created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "3fc3d669-82f0-4e45-8f4b-01f1b2a9b6da"
 *                 person_name:
 *                   type: string
 *                   example: "Charlie"
 *                 amount:
 *                   type: number
 *                   example: 250
 *                 date:
 *                   type: string
 *                   format: date
 *                   example: "2024-02-15"
 *                 description:
 *                   type: string
 *                   example: "Team lunch"
 *                 team_name:
 *                   type: string
 *                   example: "Marketing"
 *                 team_id:
 *                   type: string
 *                   example: "5f8d0d55b54764421b7156c3"
 *                 budget_name:
 *                   type: string
 *                   example: "Marketing Q1"
 *                 remaining_budget:
 *                   type: number
 *                   example: 149750
 *       400:
 *         description: Invalid request parameters
 *       500:
 *         description: Internal server error
 */
transactionRouter.post("/", async (req: CreateTransactionRequest, res: CreateTransactionResponse) => {
    try {
        await TransactionValidator.createTransaction().validateAsync(req.body); // TODO: fix
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
    return createTransactionController(req, res);
});

export default transactionRouter;