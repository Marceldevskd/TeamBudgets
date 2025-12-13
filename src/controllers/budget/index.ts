import { GetBudgetsRequest, GetBudgetsResponse, CreateBudgetsRequest, CreateBudgetsResponse, ChangeBudgetsRequest, ChangeBudgetsResponse } from "../../routes/budget/types";
import { getBudgetsService } from "../../services/budget";
import { checkIfExists } from "../../helpers/exists";

export const getBudgetsController = async (req: GetBudgetsRequest, res: GetBudgetsResponse) => {
    try {
        if (req.query.team_id !== undefined) {
            if (!await checkIfExists("teams", "id", req.query.team_id as string)) {
               return res.status(400).send({error: "Team ID does not exist"});
            }
        }
        if (req.query.team_name !== undefined) {
            if (!await checkIfExists("teams", "name", req.query.team_name as string)) {
                return res.status(400).send({error: "Team name does not exist"}); 
            }
        }
        if (req.query.person_name !== undefined) {
            if (!await checkIfExists("people", "name", req.query.person_name as string)) {
                return res.status(400).send({error: "Person name does not exist"}); 
            }
        }
        
        return getBudgetsService(req, res);
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: "Internal Server Error" });
    }
};

export const createBudgetController = async (req: CreateBudgetsRequest, res: CreateBudgetsResponse) => {
    try {
        // Your logic to create a budget goes here
        return;
    } catch (error) {
        return res.status(500).send({ error: "Internal Server Error" });
    }
};

export const changeBudgetController = async (req: ChangeBudgetsRequest, res: ChangeBudgetsResponse) => {
    try {
        // Your logic to change a budget goes here
        return;
    } catch (error) {
        return res.status(500).send({ error: "Internal Server Error" });
    }
};