import { JurassicBridge } from "../JurassicBridge.js"
import { ServerDatabase } from "./ServerDatabase.js"
import { SftpDetails, Resources, FeatureLimits } from "../../types/server.js"
import { ServerDatabaseRaw, ServerRaw } from "../../types/raw.js"
import { ServerDatabaseNew } from "../../types/database.js"

export class Server {
  // System
  private bridge: JurassicBridge

  // Attributes
  public identifier: string
  public isServerOwner: boolean
  public uuid: string
  public description: string
  public node: string
  public isSuspended: boolean
  public isInstalling: boolean
  public resources: Resources
  public sftpDetails: SftpDetails
  public featureLimits: FeatureLimits
  public state?: string
  private _name?: string

  // Relationships
  private _databases: ServerDatabase[] = []

  constructor(bridge: JurassicBridge, data: ServerRaw) {
    this.bridge = bridge
    this.isServerOwner = data.server_owner
    this.identifier = data.identifier
    this.uuid = data.uuid
    this.description = data.description
    this.node = data.node
    this.isSuspended = data.is_suspended
    this.isInstalling = data.is_installing
    this.sftpDetails = data.sftp_details
    this.featureLimits = data.feature_limits
    this.resources = {
      memory: {
        limit: data.limits.memory,
        usage: undefined
      },
      cpu: {
        limit: data.limits.cpu,
        usage: undefined
      },
      disk: {
        limit: data.limits.disk,
        usage: undefined
      },
      io: {
        limit: data.limits.io,
        usage: undefined
      },
      swap: {
        limit: data.limits.swap,
        usage: undefined
      }
    }
    this.state = undefined
    this._name = data.name

    //TODO: Make allocations relationship
  }

  //----------------------------------
  // Getters & Setters
  // ---------------------------------
  public get name(): string | undefined {
    return this._name
  }

  public set name(name: string) {
    this.bridge.post(`/servers/${this.identifier}/settings/rename`, { name: name })
      .then(() => this._name = name)
  }

  public get isRunning(): boolean {
    return this.state === 'running'
  }

  public get isOffline(): boolean {
    return this.state === 'offline'
  }

  public get isStarting(): boolean {
    return this.state === 'starting'
  }

  public get isStopping(): boolean {
    return this.state === 'stopping'
  }

  public get isRestarting(): boolean {
    return this.state === 'restarting'
  }

  public get isCrashed(): boolean {
    return this.state === 'crashed'
  }

  public get databases() {
    if (!this._databases) {
      this.bridge.get(`/servers/${this.identifier}/databases`)
        .then((response) => {
          this._databases = (response.data as ServerDatabaseRaw[]).map((database) => new ServerDatabase(this.bridge, database))
        })
    }

    return this._databases
  }

  //----------------------------------
  // Functions
  // ---------------------------------
  /**
  * Send a power signal to the server to restart, stop, start, or kill it
  */
  public power(signal: 'start' | 'stop' | 'restart' | 'kill'): void {
    this.bridge.post(`/servers/${this.identifier}/state`, { signal: signal })
      .then(() => this.state = signal)
  }

  /**
  * Send a start signal to the server
  */
  public start(): void {
    this.power('start')
  }

  /**
  * Send a stop signal to the server
  */
  public stop(): void {
    this.power('stop')
  }

  /**
  * Send a restart signal to the server
  */
  public restart(): void {
    this.power('restart')
  }

  /**
  * Send a kill signal to the server
  */
  public kill(): void {
    this.power('kill')
  }

  /**
  * Send a command to the server
  */
  public sendCommand(command: string): void {
    this.bridge.post(`/servers/${this.identifier}/command`, { command: command })
  }

  /**
  * Reinstall the server with default settings
  */
  public reinstall(): void {
    this.bridge.post(`/servers/${this.identifier}/settings/reinstall`, {})
      .then(() => this.isInstalling = true)
      .then(() => this.state = 'installing')
  }

  //----------------------------------
  // Repository
  // ---------------------------------
  /**
   * Get all server from a page of servers
   */
  public static async getServers(bridge: JurassicBridge, page: number = 1): Promise<Server[]> {
    const response = await bridge.get(`/?page=${page}`)
    const servers: Server[] = []
    for (const server of response.data as ServerRaw[]) {
      servers.push(new Server(bridge, server))
    }
    return servers
  }

  /**
  * Get all servers (paginated) from the panel (not just the first page) and return them as an array of Server objects (see Server.ts)
  * Can take a while to complete if you have a lot of servers (1-2 seconds per page)
  */
  public static async getAllServers(bridge: JurassicBridge): Promise<Server[]> {
    let page: number = 1
    const servers: Server[] = []
    let response = await bridge.get(`/?page=${page}`)
    for (const server of response.data as ServerRaw[]) {
      servers.push(new Server(bridge, server))
    }

    while (response.pagination && page++ < response.pagination.totalPages) {
      response = await bridge.get(`/?page=${page}`)
      for (const server of response.data as ServerRaw[]) {
        servers.push(new Server(bridge, server))
      }
    }

    return servers
  }

  /**
   * Create a new database for this server
   */
  public async createDatabase(data: ServerDatabaseNew) {
    const database = await ServerDatabase.create(this.bridge, this.identifier, data)
    this._databases.push(database)
    return database
  }
}
