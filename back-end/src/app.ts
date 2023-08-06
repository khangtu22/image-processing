import express from "express";
import { Application } from "express";
import morgan from "morgan";
import * as dotenv from "dotenv";
import routes from "./routes/routes";
import cors from 'cors';
dotenv.config();
const PORT = process.env.PORT || 3000;

const app: Application = express();
app.use(cors());
export function add(a: number, b: number) {
  return a + b;
}

app.use(morgan("dev"));

app.listen(PORT, () => {
  routes(app);
});
