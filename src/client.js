import fetch from 'node-fetch'
import { TRKDError } from './dto/errors'
import * as methodGroups from './methods'
import { formatFunc, hashCode } from './utils'

const TOKEN_EXP_BUFFER_MS = 120000

export default class TRKDClient {
  /**
   * Initialize Client with credentials and optional parameters
   *
   * @param {object} options
   * @param {string} options.application - TR applicationId
   * @param {string} options.username - TR username
   * @param {string} options.password - TR password
   * @param {?object<redisConnection>} options.redisConnection - redis|ioredis
   * @param {?boolean} options.log - log requests defaults to true
   */
  static init(options) {
    TRKDClient._redisConn = options.redisConnection

    TRKDClient._serviceAccount.application = options.application
    TRKDClient._serviceAccount.username = options.username
    TRKDClient._serviceAccount.password = options.password
    TRKDClient._log = options.log === undefined ? true : options.log
    TRKDClient._isInitialized = true
  }

  /**
   * Redis cache expiration seconds per method
   *
   * @property {object} fundamentals
   * @property {object} quotes
   * @property {object} search
   * @property {object} streetEvents
   * @property {object} timeSeries
   */
  static get expiration() {
    return TRKDClient._expiration
  }
  static set expiration(value) {
    TRKDClient._expiration = { ...TRKDClient._expiration, ...value }
  }

  /**
   * @returns {TRKDClient}
   */
  constructor(props = { format: true }) {
    this.host = 'https://api.rkd.refinitiv.com'
    this._request = this._request.bind(this)
    this.log = TRKDClient.log
    this.format = props.format

    for (const [name, methods] of Object.entries(methodGroups)) {
      this[name] = methods
      for (const [key, method] of Object.entries(methods)) {
        this[name][key] = method.bind(this)
      }
    }
  }

  static get _isAuthTokenValid() {
    const { tokenExpiry } = TRKDClient._serviceAccount
    if (!tokenExpiry) return false
    // consider the token invalid if it's within 2 mins of expiring
    return new Date().getTime() < tokenExpiry.getTime() - TOKEN_EXP_BUFFER_MS
  }

  /**
   * Set client credentials
   *
   * @param {string} token
   * @param {date} expiry
   */
  static updateCredentials(token, expiry) {
    if (typeof token !== 'string') {
      throw new TypeError('TRKDClient#updateCredentials: expected token to be a String!')
    }

    if (!(expiry instanceof Date)) {
      throw new TypeError('TRKDClient#updateCredentials: expected expiry to be a Date!')
    }

    TRKDClient._serviceAccount.token = token
    TRKDClient._serviceAccount.tokenExpiry = expiry
  }

  /**
   * Sends HTTP request to TR with auto authorization
   *
   * @param {string} group
   * @param {function} method
   * @param {string} path
   * @param {object} body
   * @returns {Promise}
   * @private
   */
  async _request(group, method, path, body) {
    if (!TRKDClient._isInitialized) throw new Error('TRKDClient has not been initialized!')

    const headers = {
      'Content-Type': 'application/json',
      'X-Trkd-Auth-Token': TRKDClient._isAuthTokenValid ? TRKDClient._serviceAccount.token : null,
      'X-Trkd-Auth-ApplicationID': TRKDClient._serviceAccount.application,
    }

    const methodName = formatFunc(method)
    const key = `trkd:${methodName}:${hashCode(JSON.stringify(body))}`
    if (TRKDClient._redisConn) {
      const cache = await TRKDClient._redisConn.get(key)
      if (cache) return JSON.parse(cache)
    }

    const execCall = async () => {
      if (TRKDClient._log) console.log(`[trkd-client#request] ${path}`)
      const res = await fetch(`${this.host}${path}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      })
      const isJson = res.headers.get('content-type').includes('application/json')
      if (isJson) {
        const json = await res.json()
        if (json['Fault']) throw new TRKDError(json)
        if (TRKDClient._redisConn && typeof TRKDClient.expiration[group][methodName] === 'number') {
          TRKDClient._redisConn.set(key, JSON.stringify(json), 'EX', TRKDClient.expiration[group][methodName])
        }

        return json
      }

      if (res.ok) return res.text()
      console.error('[TRKDClient] Error:', res.status, res.statusText)
      return { error: res.statusText }
    }

    const preAuth = async () => {
      await this.tokenManagement.createServiceToken(TRKDClient)
      headers['X-Trkd-Auth-Token'] = TRKDClient._serviceAccount.token
      return execCall()
    }

    const isTokenSet = headers['X-Trkd-Auth-Token']
    if (isTokenSet) return execCall()

    if (!TRKDClient._redisConn) return preAuth()

    if (TRKDClient._redisConn) {
      const cache = await TRKDClient._redisConn.get(`trkd:${TRKDClient._serviceAccount.username}`)
      if (!cache) return preAuth()

      const parsed = JSON.parse(cache)
      const expiration = new Date(parsed['Expiration'])
      if (new Date().getTime() > expiration.getTime() - TOKEN_EXP_BUFFER_MS) return preAuth()

      TRKDClient.updateCredentials(parsed['Token'], expiration)
      headers['X-Trkd-Auth-Token'] = TRKDClient._serviceAccount.token
      return execCall()
    }
  }
}

TRKDClient._serviceAccount = {
  application: null,
  username: null,
  password: null,
  token: null,
  tokenExpiry: null,
}

TRKDClient._expiration = Object.entries(methodGroups).reduce((acc, [group, methods]) => {
  acc[group] = Object.keys(methods).reduce((acc, key) => ({ ...acc, [key]: null }), {})
  return acc
}, {})
