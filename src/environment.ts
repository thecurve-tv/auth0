import dotenv from 'dotenv'

dotenv.config({ path: process.env.DOTENV_PATH || undefined })

export const environment = {
  PROD: !!process.env.PROD,
  PORT: process.env.PORT,
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
  AUTH0_API_AUDIENCE: process.env.AUTH0_API_AUDIENCE,
  AUTH0_API_DOMAIN: process.env.AUTH0_API_DOMAIN,
  CLIENT_DOMAIN: undefined,
  DEV_ACCOUNT_ID: process.env.DEV_ACCOUNT_ID,
  MONGODB_CONNECT_URI: process.env.MONGODB_CONNECT_URI,
}
