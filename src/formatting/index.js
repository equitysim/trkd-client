import timeseriesFields from './timeseries-fields'
import quoteFields from './quote-fields'

/**
 * Used to construct TRKD models from the RetrieveItem3 response
 *
 * @param {[object]} fieldsArr
 */
export const formatQuoteResponse = (trkdResponse) => {
  const result = []
  const items = trkdResponse['RetrieveItem_Response_3']['ItemResponse'][0]['Item']
  for (const item of items) {
    const fieldsArr = item['Fields']['Field']
    if (!Array.isArray(fieldsArr)) return null
    const mapped = {}
    for (const field of fieldsArr) {
      const name = field['Name']
      const mapResult = quoteFields[name]
      if (mapResult) {
        const dataKey = field['DataType']
        let data = field[dataKey]

        if (mapResult.type === Date) {
          data = new Date(data)
        }

        if (mapResult.type === String) {
          data = data.trim()
        }

        mapped[mapResult.name] = data
      }
    }
    if (mapped) {
      mapped.id = item['RequestKey']['Name']
      result.push(mapped)
    }
  }
  return result
}

export const formatTimeSeriesResponse = (trkdResponse) => {
  const result = []
  for (const values of trkdResponse['R']) {
    const fields = {}
    for (const [key, value] of Object.entries(values)) {
      const field = timeseriesFields[key]
      if (field) {
        let data = value
        if (field.type === Date) {
          data = new Date(value)
        }
        fields[field.name] = data
      }
    }
    result.push(fields)
  }
  return result
}

export const formatExchangeDataResponse = (trkdResponse) => {
  const data = trkdResponse['GetExchangeData_Response_1']['ExchangeDataResponse']
  const result = {
    name: data['ExchangeName'],
    timezone: data['Timezone'],
    tradingDays: data['TradingWeek']['TradingDay'].map(day => {
      const values = day['Session'][0]
      return {
        startDay: values['StartDay'],
        startTime: values['StartTime'],
        endDay: values['EndDay'],
        endTime: values['EndTime']
      }
    })
  }
  return result
}

export const formatTimezoneResponse = (trkdResponse) => {
  const data = trkdResponse['GetTimezoneList_Response_1']['TimezoneList']['Timezone']

  const today = new Date();
  function formatOffset(offset) {
    const hours = Math.floor(offset / 60)
    let strHours = hours.toString()
    if (hours > 0) {
      if (strHours.length === 1) strHours = '0' + strHours
      strHours = '+' + strHours
    } else {
      if (strHours.length === 2) strHours = strHours.replace('-', '-0')
    }

    const minutes = offset % 60
    let strMinutes = minutes.toString()
    if (strMinutes.length === 1) strMinutes = '0' + strMinutes

    return `${strHours}:${strMinutes}`
  }

  return data.map(zone => {
    const isSummer = zone['HasSummerTime'] && zone['SummerStart'] < today && zone['SummerEnd'] > today
    const offset = formatOffset(isSummer ? zone['SummerOffset'] : zone['GMTOffset'])
    return {
      id: zone['ShortName'],
      name: zone['LongName'],
      offset: offset
    }
  })
}