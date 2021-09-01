// BOOTSTRAP CODE STARTS BELOW THIS LINE
import { environment } from './environment'

const _user = environment.AUTH0_TEST_USER
const _context = { webtask: { secrets: environment } }
const _cb = (_err?: any, _res?: any) => {}
setTimeout(() => module.exports(_user, _context, _cb))

// HOOK CODE STARTS BELOW THIS LINE
import axios from 'axios'

/**
@param {object} user - The user being created
@param {string} user.id - user id
@param {string} user.tenant - Auth0 tenant name
@param {string} user.username - user name
@param {string} user.email - email
@param {boolean} user.emailVerified - is e-mail verified?
@param {string} user.phoneNumber - phone number
@param {boolean} user.phoneNumberVerified - is phone number verified?
@param {object} user.user_metadata - user metadata
@param {object} user.app_metadata - application metadata
@param {object} context - Auth0 connection and other context info
@param {string} context.requestLanguage - language of the client agent
@param {object} context.connection - information about the Auth0 connection
@param {object} context.connection.id - connection id
@param {object} context.connection.name - connection name
@param {object} context.connection.tenant - connection tenant
@param {object} context.webtask - webtask context
@param {function} cb - function (error, response)
*/
module.exports = function (user: typeof _user, context: typeof _context, cb: typeof _cb) {
  // create a new account
  type Account = { _id?: string; auth0Id: string; email: string }
  const accountDoc: Account = {
    auth0Id: user.id,
    email: user.email,
  }
  return axios
    .post<Account>(`${context.webtask.secrets.SERVER_URI}/accounts`, accountDoc)
    .then(res => {
      if (res.status == 201) {
        const account = res.data
        console.log(`Successfully created account ${account._id} with email ${account.email}`)
      } else {
        console.log('There is an existing account with that email, no new account was created')
      }
      cb(null, res.data)
    })
    .catch(cb)
}
