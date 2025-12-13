import express from "express";
import { GetHistoryRequest, GetHistoryResponse } from "../../routes/history/types";
import HistoryValidator from "./schema"
import { getHistoryController } from "../../controllers/history";

const historyRouter = express.Router();

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