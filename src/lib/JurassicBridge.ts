import fetch, { Response } from 'node-fetch'
import { trimUrl } from './utils.js'
import { RawAttributes, Raw } from '../types/raw.js';

export type NetworkData = string | number | undefined | null;

export interface Attribute {
  object: string,
  attributes: RawAttributes
  meta?: {
    pagination: PaginationRaw
  }
}

export interface AttributeList {
  object: "list",
  data: Array<Raw>
  meta?: {
    pagination: PaginationRaw
  }
}

export type Attributes = Attribute | AttributeList;

export enum Method {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export interface JurassicBridgeResponse {
  status: number
  data: Array<RawAttributes> | RawAttributes
  pagination?: Pagination
}

export class JurassicBridge {
  private readonly _host: string
  private readonly _key: string

  constructor(host: string, key: string) {
    this._host = trimUrl(host)
    this._key = key
  }

  /**
   * Make a request
   */
  public async request(method: Method, url: string, headers: object = {}, body: object = {}): Promise<JurassicBridgeResponse> {
    const response: Response = await fetch(`${this._host}/${url}`, {
      method,
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this._key,
        ...headers
      },
      redirect: 'follow'
    })

    if (!response.ok) {
      throw new Error(response.statusText)
    }
    const resData = await response.json() as Attributes
    const data = 'data' in resData ? resData.data.map((item: Raw) => item.attributes) : resData.attributes

    return {
      status: response.status,
      data: data,
      pagination: resData.meta?.pagination ? new Pagination(resData.meta.pagination) : undefined
    }
  }

  /**
   * Make a get request
   */
  public get(url: string, headers: object = {}): Promise<JurassicBridgeResponse> {
    return this.request(Method.GET, url, headers)
  }

  /**
   * Make a post request
   */
  public post(url: string, body: object, headers: object = {}): Promise<JurassicBridgeResponse> {
    return this.request(Method.POST, url, headers, body)
  }

  /**
   * Make a put request
   */
  public put(url: string, body: object, headers: object = {}): Promise<JurassicBridgeResponse> {
    return this.request(Method.PUT, url, headers, body)
  }

  /**
   * Make a delete request
   */
  public delete(url: string, headers: object = {}): Promise<JurassicBridgeResponse> {
    return this.request(Method.DELETE, url, headers)
  }
}

interface PaginationRaw {
  total: number
  count: number
  per_page: number
  current_page: number
  total_pages: number
  links: string[]
}

export class Pagination {
  public total: number
  public count: number
  public pageSize: number
  public currentPage: number
  public totalPages: number
  public links: string[]

  constructor(data: PaginationRaw) {
    this.total = data.total
    this.count = data.count
    this.pageSize = data.per_page
    this.currentPage = data.current_page
    this.totalPages = data.total_pages
    this.links = data.links
  }

  public nextPage() {
    return this.currentPage++
  }
}
