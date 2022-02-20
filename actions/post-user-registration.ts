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
  const res: AxiosResponse<Account> = await axios({
    method: 'POST',
    url: `${event.secrets.SERVER_URI}/accounts`,
    data: accountDoc,
  })
  if (res.status == 201) {
    const account = res.data
    console.log(`Successfully created account with _id ${account._id} and email ${account.email}`)
  } else {
    console.warn('There is an existing account with that email, no new account was created')
  }
}
