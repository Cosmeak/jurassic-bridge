import { JurassicBridge } from "../JurassicBridge.js"
import { ServerDatabaseRaw } from "../../types/raw.js"
import { ServerDatabaseHost, ServerDatabaseNew } from "../../types/database.js"

export class ServerDatabase {
  // System
  private bridge: JurassicBridge

  // Attributes
  public identifier: string
  public host: ServerDatabaseHost
  public name: string
  public username: string
  public connectionsFrom: string
  public maxConnections: number
  public password: string | undefined

  constructor(bridge: JurassicBridge, data: ServerDatabaseRaw) {
    this.bridge = bridge
    this.identifier = data.identifier
    this.host = data.host
    this.name = data.name
    this.username = data.username
    this.connectionsFrom = data.connections_from
    this.maxConnections = data.max_connections
  }

  //----------------------------------
  // Functions
  // ---------------------------------
  /**
   * Create a new database for a server
   */
  public static async create(bridge: JurassicBridge, serverIdentifier: string, data: ServerDatabaseNew): Promise<ServerDatabase> {
    const response = await bridge.post(`/servers/${serverIdentifier}/databases`, data)
    return new ServerDatabase(bridge, response.data as ServerDatabaseRaw)
  }

  /**
  * Generate a new password for the database instance
  */
  public rotatePassword(serverIdentifier: string): void {
    this.bridge.post(`/servers/${serverIdentifier}/databases/${this.identifier}/rotate-password`, {})
      .then((response) => {
        const data = response.data as ServerDatabaseRaw
        this.password = data.relationships?.password.attributes.password
      })
  }

  /**
  * Delete the database instance
  */
  public delete(serverIdentifier: string): void {
    this.bridge.delete(`/servers/${serverIdentifier}/databases/${this.identifier}`)
  }
}
