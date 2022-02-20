import axios from 'axios'
import http from 'http'
import { app, onClose, onListening } from '../src/app'
import bootstrapApp from '../src/bootstrapper'
import { Account } from '../src/models/account'
import { environment } from './environment'
import mongo from './fixtures/mongo-test-data.json'

let server: http.Server

beforeAll(() => new Promise<void>(resolve => {
  server = bootstrapApp(
    app,
    async () => {
      await onListening()
      resolve()
    },
    async () => {
      //pass
    },
  )
}))
afterAll(() => new Promise<void>((resolve, reject) => {
  server.close(err => {
    if (err) return reject(err)
    onClose().then(resolve)
  })
}))

describe('/accounts', () => {

  test('POST /', async () => {
    jest.spyOn(Account, 'create').mockImplementationOnce(args => {
      console.log(args)
    })
    await axios({
      method: 'POST',
      url: `${environment.TEST_SERVER_DOMAIN}/accounts`,
      data: {
        auth0Id: mongo.accounts[0].auth0Id,
        email: mongo.accounts[0].email,
      },
    })
  })
})
