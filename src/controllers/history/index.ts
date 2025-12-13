import { GetHistoryRequest, GetHistoryResponse } from "../../routes/history/types";
import { getHistoryService } from "../../services/history";
import { checkIfExists } from "../../helpers/exists";
import { error } from "console";

export const getHistoryController = async (req: GetHistoryRequest, res: GetHistoryResponse) => {
    try {
        const query = req.query;

        if (query.budget_id !== undefined) {
            const exists = await checkIfExists("budgets", "id", query.budget_id as string);
            if (!exists) {
                return res.status(400).send({error: "Budget ID does not exist"}); 
            }
            return getHistoryService(req, res);
        } else if (query.budget_name !== undefined) {
            const exists = await checkIfExists("budgets", "name", query.budget_name as string);
            if (!exists) {
                return res.status(400).send({error: "Budget name does not exist"}); 
            }
            return getHistoryService(req, res);
        }
        return res.status(400).send({error: "Missing budget_id or budget_name in query parameters"});
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: "Internal Server Error" });
    }
};
