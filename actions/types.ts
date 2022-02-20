export interface Account {
  _id?: string
  auth0Id: string
  email: string
}

export interface Connection {
  id: string
  metadata?: Record<string, unknown>
  name: string
  strategy: string
}

export interface Event {
  secrets: Record<string, unknown>
}

export interface Request {
  geoip: {
    cityName?: string
    continentCode?: string
    countryCode?: string
    countryCode3?: string
    countryName?: string
    latitude?: number
    longitude?: number
    timeZone?: string
  }
  hostname?: string
  ip: string
  language?: string
  method: string
  user_agent?: string
}

export interface Tenant {
  id: string
}

export interface Transaction {
  acr_values: string[]
  locale: string
  protocol?: string
  requested_scopes: string[]
  ui_locales: string[]
}

export interface User {
  app_metadata?: Record<string, unknown>
  email?: string
  family_name?: string
  given_name?: string
  name?: string
  nickname?: string
  phone_number?: string
  picture?: string
  user_metadata?: Record<string, unknown>
  username?: string
}

export interface PostUserRegistrationEventUser extends User {
  created_at: string
  email_verified: boolean
  last_password_reset?: string
  multifactor: string[]
  phone_verified?: boolean
  updated_at: string
  user_id: string
}

export interface PostUserRegistrationEvent extends Event {
  connection: Connection
  request?: Request
  tenant: Tenant
  transaction?: Transaction
  user: PostUserRegistrationEventUser
}

/**
 * https://auth0.com/docs/customize/actions/flows-and-triggers/pre-user-registration-flow/event-object
 */
export interface PreUserRegistrationEvent extends Event {
  client?: {
    client_id: string
    metadata: Record<string, unknown>
    name: string
  }
  connection: Connection
  request: Request
  tenant: Tenant
  transaction?: Transaction
  user: User
}

/**
 * https://auth0.com/docs/customize/actions/flows-and-triggers/pre-user-registration-flow/api-object
 */
export interface PreUserRegistrationApi {
  access: {
    deny(reason: string, userMessage: string): PreUserRegistrationApi
  }
  user: {
    setUserMetadata(name: string, value: unknown | null): PreUserRegistrationApi
    setAppMetadata(name: string, value: unknown | null): PreUserRegistrationApi
  }
}
