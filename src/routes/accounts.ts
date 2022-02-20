import { Router } from 'express'
import { body } from 'express-validator'
import { Account, IAccount } from '../models/account'
import { IDraftDocument } from '../models/_defaults'

const router = Router()
export default router

router.post(
  '/',
  body('auth0Id').isString().isLength({ min: 1 }),
  body('email').isEmail(),
  (req, res, next) => {
    const f = async () => {
      const existingAccount = await Account.findOne({ email: req.body.email })
      if (existingAccount) {
        return res.sendStatus(200)
      }
      const accountDoc: IDraftDocument<IAccount> = {
        auth0Id: req.body.auth0Id,
        email: req.body.email,
      }
      const docs = await Account.create([ accountDoc ], { validateBeforeSave: true })
      res.status(201).send(docs[0])
    }
    f().catch(next)
  },
)

router.post(
  '/byEmail',
  body('email').isEmail(),
  (req, res, next) => {
    const f = async () => {
      const account = await Account.findOne({ email: req.body.email })
      if (account) {
        res.send(account)
      } else {
        res.sendStatus(404)
      }
    }
    f().catch(next)
  },
)
