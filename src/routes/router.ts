import express from "express";

import historyRouter from "./history";
import budgetRouter from "./budget";
import transactionRouter from "./transaction";

const router = express.Router();

router.use("/history", historyRouter);
router.use("/budget", budgetRouter);
router.use("/transaction", transactionRouter);

export default router;