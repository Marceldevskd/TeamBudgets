import joi from "joi";

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
            amount: joi.number().required(),
            description: joi.string().required(),
        });
    };
};