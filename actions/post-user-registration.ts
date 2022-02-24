import axios, { AxiosResponse } from 'axios'
import { Account, PostUserRegistrationEvent } from './types'

/**
* Handler that will be called during the execution of a PostUserRegistration flow.
*
* @param {Event} event - Details about the context and user that has registered.
*/
export async function onExecutePostUserRegistration(event: PostUserRegistrationEvent) {
  if (!event.user.email) {
    throw new Error(`Expected event.user.email to be truthy, got ${event.user.email}`)
  }
  // create a new account
  const accountDoc: Account = {
    auth0Id: event.user.user_id,
    email: event.user.email,
  }
  console.debug('accountDoc =', accountDoc)
  const url = `${event.secrets.SERVER_URI}/accounts`
  console.debug('posting to', url)
  const res: AxiosResponse<Account> = await axios({
    method: 'POST',
    url,
    headers: {
      Authorization: event.secrets.AUTH_HEADER,
    },
    data: accountDoc,
  })
  console.debug('Response:', res.status, res.data)
  if (res.status == 201) {
    const account = res.data
    console.info(`Successfully created account with _id ${account._id} and email ${account.email}`)
  } else {
    console.info('There is an existing account with that email, no new account was created')
  }
}
