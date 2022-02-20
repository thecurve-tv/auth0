import cookieParser from 'cookie-parser'
import express from 'express'
import logger from 'morgan'
import path from 'path'
import { environment } from './environment'
import { connectMongoDB, disconnectMongoDB } from './mongodb'
import accountRouter from './routes/accounts'
import { security } from './util/security'
import { errorResponse } from './util/session'

export const app = express()

app.use(logger(environment.PROD ? 'tiny' : 'dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(express.static(path.join(__dirname, 'public')))
app.use(security.enableCors(environment.AUTH0_DOMAIN as string))

app.use('/accounts', accountRouter)

app.use('*', (_req, res) => {
  res.sendStatus(404)
})
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err, (<Error>err).stack)
  errorResponse(500, 'Something broke!', res, err)
})


export async function onListening(): Promise<void> {
  await connectMongoDB()
}

export async function onClose(): Promise<void> {
  await disconnectMongoDB()
}
