import express from "express";
import router from "./router"

const app = express();
const port: number = 9001;

app.use(router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.get("/", (req, res) => {
    res.send("Hello World!");
});