import express from "express";

const adminRouter = express.Router();

adminRouter.get("/", (req, res) => {
    return res.send("Admin Home");
});

export default adminRouter;