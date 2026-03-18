import { middleware } from '#middlewares/middlewares.js'
import cors from 'cors'
import express, { Application } from 'express'
import helmet from 'helmet'
import path from 'path'

const app: Application = express()

// Middleware setup
app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(express.static(path.join(process.cwd(), '../', 'public')))
app.get('/', middleware)

export default app
