import { Server } from 'http'
import { app, onClose, onListening } from '../../src/app'
import bootstrapApp from '../../src/bootstrapper'
import { awaitState } from '../../src/mongodb'

export function launchServer(): Promise<Server> {
  return new Promise(resolve => {
    const server = bootstrapApp(
      app,
      async () => {
        await onListening()
        resolve(server)
      },
      onClose,
    )
  })
}

export async function shutdownServer(server: Server): Promise<void> {
  server.close()
  await awaitState(0)
}
