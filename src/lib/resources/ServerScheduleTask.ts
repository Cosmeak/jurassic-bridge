import { JurassicBridge } from "../JurassicBridge.js"

export interface ServerScheduleTaskOptionsRaw {
  id: string
  sequence_id: number
  action: string
  payload: string
  time_offset: number
  is_queued: boolean
  create_at: string
  updated_at: string
}

export class ServerScheduleTask {
  // System
  private bridge: JurassicBridge

  // Attributes
  public identifier: string
  public sequenceId: number
  public action: string
  public payload: string
  public timeOffset: number
  public isQueued: boolean
  public createdAt: Date
  public updatedAt: Date

  constructor(bridge: JurassicBridge, data: ServerScheduleTaskOptionsRaw) {
    this.bridge = bridge

    this.identifier = data.id
    this.sequenceId = data.sequence_id
    this.action = data.action
    this.payload = data.payload
    this.timeOffset = data.time_offset
    this.isQueued = data.is_queued
    this.createdAt = new Date(data.create_at)
    this.updatedAt = new Date(data.updated_at)
  }

  //----------------------------------
  // Getters & Setters
  // ---------------------------------


  //----------------------------------
  // Functions
  // ---------------------------------

}
