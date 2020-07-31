import fetch from 'node-fetch'
import { TRKDError } from './src/dto/errors'
import fundamentalMethods from './src/methods/fundamentals'
import quoteMethods from './src/methods/quotes'
import searchMethods from './src/methods/search'
import streetEventMethods from './src/methods/street-events'
import timeSeriesMethods from './src/methods/time-series'
import tokenManagementMethods from './src/methods/token-management'

const TOKEN_EXP_BUFFER_MS = 120000

export default class TRKDClient {
  /**
   * Initialize Client with credentials and optional parameters
   *
   * @param {object} options
   * @param {string} options.application - TR applicationId
   * @param {string} options.username - TR username
   * @param {string} options.password - TR password
   * @param {bool} options.format - Format responses - default: true
   */
  static init(options) {
    if (options.format === undefined) TRKDClient.format = true
    else TRKDClient.format = options.format

    TRKDClient._serviceAccount.application = options.application
    TRKDClient._serviceAccount.username = options.username
    TRKDClient._serviceAccount.password = options.password
  }

  constructor() {
    this.host = 'https://api.trkd.thomsonreuters.com'
    this._request = this._request.bind(this)
    this.format = TRKDClient.format
    this.log = TRKDClient.log

    // manually inputted here for autocompletion
    this.fundamentals = fundamentalMethods
    this.quotes = quoteMethods
    this.search = searchMethods
    this.streetEvents = streetEventMethods
    this.timeSeries = timeSeriesMethods
    this._tokenManagement = tokenManagementMethods

    const methodGroups = {
      fundamentals: fundamentalMethods,
      quotes: quoteMethods,
      search: searchMethods,
      streetEvents: streetEventMethods,
      timeSeries: timeSeriesMethods,
      _tokenManagement: tokenManagementMethods,
    }

    for (const [name, methods] of Object.entries(methodGroups)) {
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
   * @param {string} path
   * @param {object} body
   * @returns {Promise}
   * @private
   */
  async _request(path, body) {
    const headers = {
      'Content-Type': 'application/json',
      'X-Trkd-Auth-Token': TRKDClient._isAuthTokenValid ? TRKDClient._serviceAccount.token : null,
      'X-Trkd-Auth-ApplicationID': TRKDClient._serviceAccount.application,
    }

    const execCall = async () => {
      const res = await fetch(`${this.host}${path}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      })
      const isJson = res.headers.get('content-type').includes('application/json')
      if (isJson) {
        const json = await res.json()
        if (json['Fault']) throw new TRKDError(json)
        return json
      }

      return res.text()
    }

    const preAuth = async () => {
      await this._tokenManagement.createServiceToken(TRKDClient)
      headers['X-Trkd-Auth-Token'] = TRKDClient._serviceAccount.token
      return execCall()
    }

    const isTokenSet = headers['X-Trkd-Auth-Token']
    if (isTokenSet) return execCall()

    return preAuth()
  }
}

TRKDClient._serviceAccount = {
  application: null,
  username: null,
  password: null,
  token: null,
  tokenExpiry: null,
}