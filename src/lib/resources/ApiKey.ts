import { JurassicBridge } from "../JurassicBridge.js"
import { ApiKeyRaw } from "../../types/raw.js"
import { ApiKeyNew } from "../../types/account.js"

export class ApiKey {
  // System
  private bridge: JurassicBridge

  // Attributes
  public identifier: string
  public description: string
  public allowedIps: string[]
  public lastUsedAt: Date
  public createdAt: Date

  constructor(bridge: JurassicBridge, data: ApiKeyRaw) {
    this.bridge = bridge
    this.identifier = data.identifier
    this.description = data.description
    this.allowedIps = data.allowed_ips
    this.lastUsedAt = new Date(data.last_used_at)
    this.createdAt = new Date(data.created_at)
  }

  //----------------------------------
  // Functions
  // ---------------------------------
  public static async create(bridge: JurassicBridge, data: ApiKeyNew): Promise<ApiKey> {
    const response = await bridge.post(`/account/api-keys`, data)
    const apiKey = new ApiKey(bridge, response.data as ApiKeyRaw)
    return apiKey
  }

  public async delete() {
    await this.bridge.delete(`/account/api-keys/${this.identifier}`)
  }
}
