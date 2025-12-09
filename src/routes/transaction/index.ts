import express from "express";

const transactionRouter = express.Router();

transactionRouter.get("/", (req, res) => {
    return res.send("Transaction Home");
});

export default transactionRouter;