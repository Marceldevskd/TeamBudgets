import joi from "joi";

class HistoryValidator {
    public getHistory() {
        return joi.object({
            budget_id: joi.number().optional(),
            budget_name: joi.string().optional()
        }).or('budget_id', 'budget_name'); // At least one must be provided
    };
}

export default new HistoryValidator();