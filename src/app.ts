import cookieParser from 'cookie-parser'
import express from 'express'
import mongoose from 'mongoose'
import logger from 'morgan'
import path from 'path'
import { environment, security } from './environment'
import { router as accountRouter } from './routes/accounts'

export const app = express()

app.use(logger(environment.PROD ? 'tiny' : 'dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(express.static(path.join(__dirname, 'public')))
app.use(security.enableCors())

app.use('/accounts', accountRouter)

app.use('*', (_req, res) => {
  res.sendStatus(404)
})
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

mongoose.set('runValidators', true)
mongoose
  .connect(<string>environment.MONGODB_CONNECT_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err))
