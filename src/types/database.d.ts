export type ServerDatabaseHost = {
  address: string
  port: number
}

export interface ServerDatabaseNew {
  database: string,
  remote: string,
}
