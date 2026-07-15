import express from "express";
import cors from "cors";
import routes from "./routes/analytics.routes";
import { spawn } from "node:child_process";

spawn("yarn", ["vite"], {
    stdio: "inherit",
    shell: true
});

const app=express();

app.use(cors());
app.use(express.json());

app.use("/analytics",routes);


export default app;
