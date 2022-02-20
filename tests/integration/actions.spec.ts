import { Server } from 'http'
import { onExecutePostUserRegistration } from '../../actions/post-user-registration'
import { onExecutePreUserRegistration } from '../../actions/pre-user-registration'
import { PostUserRegistrationEvent, PreUserRegistrationApi, PreUserRegistrationEvent } from '../../actions/types'
import { Account, IAccount } from '../../src/models/account'
import { IDraftDocument } from '../../src/models/_defaults'
import { environment } from '../environment'
import mongo from '../fixtures/mongo-test-data.json'
import { launchServer, shutdownServer } from '../support/setup-teardown'

let server: Server

beforeAll(async () => server = await launchServer())
afterAll(async () => await shutdownServer(server))

describe('PreUserRegistration', () => {
  it('works', async () => {
    await callPreUserRegistrationAction('does-not-exist@email.com')
  })

  it('fails for existing email', async () => {
    await expect(() => callPreUserRegistrationAction(mongo.accounts[0].email))
      .rejects
      .toThrow(`There already exists an account with the email ${mongo.accounts[0].email}`)
  })

  function callPreUserRegistrationAction(email: string) {
    return onExecutePreUserRegistration(
      <unknown>{
        secrets: { SERVER_URI: environment.TEST_SERVER_DOMAIN },
        user: { email },
      } as PreUserRegistrationEvent,
      <unknown>{
        access: {
          deny(_reason: string, _userMessage: string) {
            return <unknown>undefined as PreUserRegistrationApi
          },
        },
      } as PreUserRegistrationApi,
    )
  }
})

describe('PostUserRegistration', () => {
  beforeEach(() => {
    jest.spyOn(Account, 'create').mockImplementation(async docs => {
      for (const doc of docs as IDraftDocument<IAccount>[]) {
        await Account.validate(doc)
      }
      return docs
    })
  })
  afterEach(() => jest.restoreAllMocks())

  it('works', async () => {
    await onExecutePostUserRegistration(
      <unknown>{
        secrets: { SERVER_URI: environment.TEST_SERVER_DOMAIN },
        user: {
          user_id: mongo.accounts[0].auth0Id,
          email: mongo.accounts[0].email,
        },
      } as PostUserRegistrationEvent,
    )
  })
})
