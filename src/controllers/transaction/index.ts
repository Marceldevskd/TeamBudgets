import { CreateTransactionRequest, CreateTransactionResponse } from "../../routes/transaction/types";
import { checkIfExists } from "../../helpers/exists";
import { createTransactionService } from "../../services/transaction";


export const createTransactionController = async (req: CreateTransactionRequest, res: CreateTransactionResponse) => {
    try {
        const body = req.body;
        console.log("Request body:", body);
        if (body.person_name === undefined) {
            console.log("person_name is missing in the request body");
            throw new Error("person_name is required"); // This should be caught by validation, but just in case
        } else if (!await checkIfExists("people", "name", body.person_name as string)) {
            return res.status(400).send({ error: "person_name does not exist" });
        }
        
        return createTransactionService(req, res);
    } catch (error) {
        console.error("Error in createTransactionController:", error);
        return res.status(500).send({ error: "Internal Server Error" });
    }   
};
