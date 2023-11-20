import { JurassicBridge } from "../JurassicBridge.js";
import { Server } from "./Server.js";
import { ServerScheduleTask, ServerScheduleTaskOptionsRaw } from "./ServerScheduleTask.js";

export interface ServerScheduleOptionsRaw {
  id: number
  name: string
  cron: Cron
  is_active: boolean
  is_processing: boolean
  last_run_at?: string
  next_run_at: string
  created_at: string
  updated_at: string
}

export type Cron = {
  minute: string;
  hour: string;
  day_of_week: string;
  day_of_month: string;
}

export class ServerSchedule {
  // System
  private bridge: JurassicBridge

  // Attributes
  public identifier: number
  public name: string
  public cron: Cron
  public isActive: boolean
  public isProcessing: boolean
  public lastRunAt?: Date
  public nextRunAt: Date
  public createdAt: Date
  public updatedAt: Date

  // Relationships
  public Server: Server
  private _tasks: ServerScheduleTask[] = [];

  constructor(bridge: JurassicBridge, server: Server, data: ServerScheduleOptionsRaw) {
    this.bridge = bridge;
    this.Server = server;

    this.identifier = data.id
    this.name = data.name
    this.cron = {
      minute: data.cron.minute,
      hour: data.cron.hour,
      day_of_week: data.cron.day_of_week,
      day_of_month: data.cron.day_of_month,
    }
    this.isActive = data.is_active
    this.isProcessing = data.is_processing
    this.lastRunAt = data.last_run_at ? new Date(data.last_run_at) : undefined
    this.nextRunAt = new Date(data.next_run_at)
    this.createdAt = new Date(data.created_at)
    this.updatedAt = new Date(data.updated_at)
  }

  //----------------------------------
  // Getters & Setters
  // ---------------------------------
  public get tasks() {
    if (!this._tasks) {
      this.bridge.get(`/servers/${this.Server.identifier}/schedules/${this.identifier}/tasks`).then((response) => {
        this._tasks = response.data.map((task: ServerScheduleTaskOptionsRaw) => new ServerScheduleTask(this.bridge, task))
      })
    }
    return this._tasks
  }

  //----------------------------------
  // Functions
  // ---------------------------------
  public static async create(bridge: JurassicBridge, server: Server, data: ServerScheduleOptionsRaw): Promise<ServerSchedule> {
    const response = await bridge.post(`/servers/${server.identifier}/schedules`, data)
    return new ServerSchedule(bridge, server, response.data as ServerScheduleOptionsRaw)
  }
}
