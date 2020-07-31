import { ValidationError } from '../dto/errors'
import { formatTimeSeriesResponse, formatExchangeDataResponse, formatTimezoneResponse } from '../formatting'
import { INTERDAY_INTERVAL } from '../utils/config'

export default {
  /**
   *
   * @param {string} ric
   * @param {Date} startTime
   * @param {Date} endTime
   * @param {string} interval - INTRADAY_INTERVAL
   */
  async getIntraday(ric, startTime, endTime, interval) {
    const intervals = Object.values(INTRADAY_INTERVAL)

    if (typeof ric !== 'string') throw new ValidationError('ric must be a string', ric)
    if (!(startTime instanceof Date) || startTime > new Date()) throw new ValidationError('startTime must be less than now', startTime)
    if (!(endTime instanceof Date) || endTime > new Date()) throw new ValidationError('endTime must be less than now', startTime)
    if (!intervals.includes(interval)) throw new ValidationError(`interval must be one of the following: ${intervals.toString()}`, interval)

    const path = `/api/TimeSeries/TimeSeries.svc/REST/TimeSeries_1/GetIntradayTimeSeries_5`
    const payload = {
      GetIntradayTimeSeries_Request_4: {
        Field: ['OPEN', 'HIGH', 'LOW', 'CLOSE', 'CLOSEYIELD', 'VOLUME', 'BID', 'ASK'],
        MetaField: ['NAME', 'QOS', 'CCY', 'NAME_LL'],
        TrimResponse: true,
        Symbol: ric,
        StartTime: startTime,
        EndTime: endTime,
        Interval: interval,
      },
    }
    const res = await this._request(path, payload)
    if (!this.format) return res

    return formatTimeSeriesResponse(res['GetIntradayTimeSeries_Response_5'])
  },
  async getInterday(ric, startTime, endTime, interval) {
    const intervals = Object.values(INTERDAY_INTERVAL)

    if (typeof ric !== 'string') throw new TypeError('ric must be a string')
    if (!(startTime instanceof Date) || startTime > new Date()) throw new ValidationError('startTime must be less than now', startTime)
    if (!(endTime instanceof Date) || endTime > new Date()) throw new ValidationError('endTime must be less than now', startTime)
    if (!intervals.includes(interval)) throw new ValidationError(`interval must be one of the following: ${intervals.toString()}`, interval)

    const path = `/api/TimeSeries/TimeSeries.svc/REST/TimeSeries_1/GetInterdayTimeSeries_5`
    const payload = {
      GetInterdayTimeSeries_Request_5: {
        Field: ['OPEN', 'HIGH', 'LOW', 'CLOSE', 'CLOSEYIELD', 'VOLUME', 'BID', 'ASK'],
        MetaField: ['NAME', 'QOS', 'CCY', 'NAME_LL'],
        TrimResponse: true,
        Symbol: ric,
        StartTime: startTime,
        EndTime: endTime,
        Interval: interval,
      },
    }
    const res = await this._request(path, payload)
    if (!this.format) return res

    return formatTimeSeriesResponse(res['GetInterdayTimeSeries_Response_5'])
  },
  async getExchangeData(exchangeCode) {
    if (typeof exchangeCode !== 'string') throw new TypeError('exchangeCode must be a string')

    const path = '/api/TimeSeries/TimeSeries.svc/REST/TimeSeries_1/GetExchangeData_1'
    const payload = {
      GetExchangeData_Request_1: {
        exchange: exchangeCode.toUpperCase(),
      },
    }

    const res = await this._request(path, payload)
    if (!this.format) return res

    return formatExchangeDataResponse(res)
  },
  async getTimezone() {
    const path = '/api/TimeSeries/TimeSeries.svc/REST/TimeSeries_1/GetTimezoneList_1'
    const payload = {
      GetTimezoneList_Request_1: {},
    }

    const res = await this._request(path, payload)
    if (!this.format) return res

    return formatTimezoneResponse(res)
  },
}
