import joi from "joi";

class BudgetValidator {
    public getBudgets() {
        return joi.object({
            active_only: joi.boolean().optional(),
            team_id: joi.number().optional(),
            team_name: joi.string().optional(),
            person_name: joi.string().optional()
        });    
    };

    public createBudget() {
        return joi.object({
            team_name: joi.string().required(),
            amount: joi.number().required(),
            start_date: joi.date().required(),
            end_date: joi.date().required(),
        });    
    }

    public changeBudget() {
        return joi.object({
            budget_id: joi.string().uuid().required(),
            team_name: joi.string().optional(),
            amount: joi.number().optional(),
            start_date: joi.date().optional(),
            end_date: joi.date().optional()
        });    
    }
}

export default new BudgetValidator();