import express, { Application } from "express"
import morgan from "morgan"
import * as dotenv from "dotenv"
import routes from "./routes/routes"
import cors from "cors"

dotenv.config()

const PORT = process.env.PORT || 3000

const app: Application = express()

app.use(cors())

app.use(morgan("dev"))

app.listen(PORT, () => {
  routes(app)
})

export default app
