import { Server } from './resources/Server.js'
import { JurassicBridge } from './JurassicBridge.js'
import { trimUrl } from './utils.js'

export default class Client {
  // System
  public bridge: JurassicBridge

  // Relationships
  private _servers: Server[] = []

  constructor(host: string, key: string) {
    this.bridge = new JurassicBridge(`${trimUrl(host)}/api/client`, key)
  }

  //----------------------------------
  // Getters & Setters
  // ---------------------------------
  public get servers() {
    return Server.getAllServers(this.bridge)
  }

  public get permissions() {
    return (async () => {
      const response = await this.bridge.get(`/permissions`)
      return response.data
    })
  }
}
