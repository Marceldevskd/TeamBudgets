import express from "express";
import { CreateTransactionRequest, CreateTransactionResponse } from "../../routes/transaction/types";
import TransactionValidator from "./schema"
import { createTransactionController } from "../../controllers/transaction";

const transactionRouter = express.Router();


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