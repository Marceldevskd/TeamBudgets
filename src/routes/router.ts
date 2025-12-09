import express from "express";

import adminRouter from "./admin";
import budgetRouter from "./budget";
import transactionRouter from "./transaction";

const router = express.Router();

router.use("/admin", adminRouter);
router.use("/budget", budgetRouter);
router.use("/transaction", transactionRouter);

export default router;