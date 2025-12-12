import joi, { date } from "joi";

class TransactionValidator {
    public getTransactions() {
        return joi.object({
            team_id: joi.number().optional(),
            person_name: joi.string().optional(),
            start_date: joi.date().optional(),
            end_date: joi.date().optional()
        });
    };

    public createTransaction() {
        return joi.object({
            person_name: joi.string().required(),
            amount: joi.number().required().min(0.01),
            description: joi.string().min(3).max(255).required(),
            date: joi.date().optional() // may use current date if not provided, is needed for testing
        });
    };
};

export default new TransactionValidator();