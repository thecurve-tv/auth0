import axios, { AxiosResponse } from 'axios'
import { Account, PreUserRegistrationApi, PreUserRegistrationEvent } from './types'

/**
* Handler that will be called during the execution of a PreUserRegistration flow.
*
* @param {PreUserRegistrationEvent} event - Details about the context and user that is attempting to register.
* @param {PreUserRegistrationApi} api - Interface whose methods can be used to change the behavior of the signup.
*/
export async function onExecutePreUserRegistration(event: PreUserRegistrationEvent, api: PreUserRegistrationApi): Promise<void> {
  if (!event.user.email) {
    await rejectRegistration(
      `Expected event.user.email to be truthy, got ${event.user.email}`,
      'Failed to determine if you are using an email that is taken.',
      api,
    )
  }
  let foundAccount: boolean
  try {
    const res: AxiosResponse<Account> = await axios({
      method: 'POST',
      url: `${event.secrets.SERVER_URI}/accounts/byEmail`,
      data: {
        email: event.user.email,
      },
    })
    foundAccount = res.data?.email === event.user.email
  } catch (err) {
    foundAccount = false
  }
  if (foundAccount) {
    await rejectRegistration(
      `There already exists an account with the email ${event.user.email}`,
      'You are not allowed to signup because your email is already taken.',
      api,
    )
  }
}

async function rejectRegistration(reason: string, userMessage: string, api: PreUserRegistrationApi): Promise<never> {
  await api.access.deny(reason, userMessage)
  throw new Error(reason)
}
