export interface SftpDetails {
  ip: string
  port: number
}

export interface Resources {
  memory: Resource,
  cpu: Resource,
  disk: Resource,
  io: Resource,
  swap: Resource,
}

export interface Resource {
  limit: number
  usage: number | undefined
}

export interface FeatureLimits {
  databases: number
  allocations: number
  backups: number
}
