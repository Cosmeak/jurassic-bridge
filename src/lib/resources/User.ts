import { ApiKeyRaw, UserRaw } from "../../types/raw.js"
import { JurassicBridge } from "../JurassicBridge.js"
import { ApiKey } from "./ApiKey.js"

export class User {
  // System
  private bridge: JurassicBridge

  // Attributes
  public identifier: string
  public description: string
  public allowedIps: string[]
  public lastUsedAt: Date
  public createdAt: Date

  // Relationships
  private _apiKeys: ApiKey[] = []

  constructor(bridge: JurassicBridge, data: UserRaw) {
    this.bridge = bridge
    this.identifier = data.identifier
    this.description = data.description
    this.allowedIps = data.allowed_ips
    this.lastUsedAt = new Date(data.last_used_at)
    this.createdAt = new Date(data.created_at)
  }

  //----------------------------------
  // Getters & Setters
  // ---------------------------------
  public get apiKeys() {
    if (!this._apiKeys) {
      this.bridge.get(`/account/api-keys`)
        .then((response) => {
          const apiKeys: ApiKey[] = []
          for (const key of response.data as ApiKeyRaw[]) {
            const apiKey = new ApiKey(this.bridge, key)
            apiKeys.push(apiKey)
          }
          this._apiKeys = apiKeys
        })
    }
    return this._apiKeys
  }

  //----------------------------------
  // Functions
  // ---------------------------------
  // public async getTwoFactorAuthentication(): Promise<string> {
  //   const response = await this.bridge.get(`/account/two-factor`)
  //   return response.data.image_url_data
  // }

  public enableTwoFactorAuthentication(code: string) {
    this.bridge.post(`/account/two-factor`, { code: code })
  }

  public disableTwoFactorAuthentication(password: string) {
    this.bridge.delete(`/account/two-factor`, { password: password })
  }

  public updateEmail(email: string, password: string) {
    this.bridge.put(`/account/email`, { email: email, password: password })
  }

  public updatePassword(currentPassword: string, password: string, confirmationPassword: string) {
    this.bridge.put(`/account/password`, { currentPassword: currentPassword, password: password, confirmationPassword: confirmationPassword })
  }
}
