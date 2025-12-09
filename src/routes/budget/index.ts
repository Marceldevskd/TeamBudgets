import express from "express";

import pool from "../../database";

const budgetRouter = express.Router();

budgetRouter.get("/", (req, res) => {
    return res.send("Budget Home");
});

export default budgetRouter;