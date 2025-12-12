import express from "express";
import router from "./routes/router"

const app = express();
const port: number = 9001;

app.use(express.json());

app.use("/api", router);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

app.get("/", (req, res) => {
    res.send("Hello World!");
});