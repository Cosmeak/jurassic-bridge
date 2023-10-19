import { ServerDatabaseHost } from "./database.js"
import { SftpDetails, FeatureLimits } from "./server.js"

export interface Raw {
  object: "server" | "system_permissions" | "stats" | "server_database" | "server_schedule" | "schedule_task" | "api_key" | "user",
  attributes: RawAttributes
}

export type RawAttributes = ServerRaw | PermissionRaw | ServerDatabaseRaw | ApiKeyRaw | UserRaw

export type ErrorRaw = {
  code: string
  status: string
  detail: string
}

export type PermissionRaw = {
  websocket: {
    description: string
    keys: {
      connect: string
    }
  }
  control: {
    description: string
    keys: {
      console: string
      start: string
      stop: string
      restart: string
    }
  }
  user: {
    description: string
    keys: {
      create: string
      read: string
      update: string
      delete: string
    }
  }
  file: {
    description: string
    keys: {
      create: string
      read: string
      update: string
      delete: string
      archive: string
      sftp: string
    }
  }
  backup: {
    description: string
    keys: {
      create: string
      read: string
      update: string
      delete: string
      download: string
    }
  }
  allocation: {
    description: string
    keys: {
      read: string
      create: string
      update: string
      delete: string
    }
  }
  startup: {
    description: string
    keys: {
      read: string
      update: string
    }
  }
  database: {
    description: string
    keys: {
      create: string
      read: string
      update: string
      delete: string
      view_password: string
    }
  }
  schedule: {
    description: string
    keys: {
      create: string
      read: string
      update: string
      delete: string
    }
  }
  settings: {
    description: string
    keys: {
      rename: string
      reinstall: string
    }
  }
}

export type ServerRaw = {
  server_owner: boolean
  identifier: string
  uuid: string
  name: string
  node: string
  sftp_details: SftpDetails
  description: string
  limits: {
    memory: number
    swap: number
    disk: number
    io: number
    cpu: number
  }
  feature_limits: FeatureLimits
  is_suspended: boolean
  is_installing: boolean
  relationships: {
    allocations: {
      object: string
      data: {
        id: number
        ip: string
        ip_alias?: string
        port: number
        notes?: string
        is_default: boolean
      }
    }
  }
}

export type ServerDatabaseRaw = {
  identifier: string
  host: ServerDatabaseHost
  name: string
  username: string
  connections_from: string
  max_connections: number
  relationships?: {
    password: {
      object: string
      attributes: {
        password: string
      }
    }
  }
}

export interface UserRaw {
  identifier: string
  description: string
  allowed_ips: string[]
  last_used_at: string
  created_at: string
}

export interface ApiKeyRaw {
  identifier: string
  description: string
  allowed_ips: string[]
  last_used_at: string
  created_at: string
}
