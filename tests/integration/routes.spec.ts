import axios from 'axios'
import { Server } from 'http'
import { Account, IAccount } from '../../src/models/account'
import { IDraftDocument } from '../../src/models/_defaults'
import { environment } from '../environment'
import mongo from '../fixtures/mongo-test-data.json'
import { launchServer, shutdownServer } from '../support/setup-teardown'

let server: Server

beforeAll(async () => server = await launchServer())
afterAll(async () => await shutdownServer(server))

describe('POST /accounts', () => {
  beforeEach(() => {
    jest.spyOn(Account, 'create').mockImplementation(async docs => {
      for (const doc of docs as IDraftDocument<IAccount>[]) {
        await Account.validate(doc)
      }
      return docs
    })
  })
  afterEach(() => jest.restoreAllMocks())

  it('works for new accounts', async () => {
    const inputDoc = {
      auth0Id: 'new-auth0-id',
      email: 'valid@email.com',
    }
    const { data: docs, status } = await axios.post(`${environment.TEST_SERVER_DOMAIN}/accounts`, inputDoc, {
      headers: { Authorization: environment.AUTHORIZATION_HEADER },
    })
    expect(status).toEqual(201)
    expect(docs).toMatchObject(inputDoc)
  })

  it('works for existing accounts', async () => {
    const { status } = await axios.post(
      `${environment.TEST_SERVER_DOMAIN}/accounts`,
      {
        auth0Id: mongo.accounts[0].auth0Id,
        email: mongo.accounts[0].email,
      },
      {
        headers: { Authorization: environment.AUTHORIZATION_HEADER },
      },
    )
    expect(status).toEqual(200)
  })

  it('fails for invalid email', async () => {
    await expect(() => axios.post(
      `${environment.TEST_SERVER_DOMAIN}/accounts`,
      {
        auth0Id: mongo.accounts[0].auth0Id,
        email: 'invalidEmail',
      },
      {
        headers: { Authorization: environment.AUTHORIZATION_HEADER },
      },
    ))
      .rejects
      .toThrow()
  })
})

describe('POST /accounts/byEmail', () => {
  it('works', async () => {
    const { data } = await axios.post(
      `${environment.TEST_SERVER_DOMAIN}/accounts/byEmail`,
      {
        email: mongo.accounts[0].email,
      },
      {
        headers: { Authorization: environment.AUTHORIZATION_HEADER },
      },
    )
    expect(data).toMatchObject({
      auth0Id: mongo.accounts[0].auth0Id,
      email: mongo.accounts[0].email,
    })
  })

  it('fails for non-existent accounts', async () => {
    await expect(() => axios.post(
      `${environment.TEST_SERVER_DOMAIN}/accounts`,
      {
        email: 'does-not-exist@email.com',
      },
      {
        headers: { Authorization: environment.AUTHORIZATION_HEADER },
      },
    ))
      .rejects
      .toThrow()
  })
})
