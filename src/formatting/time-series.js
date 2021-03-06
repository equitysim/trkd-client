import timeseriesFields from './field-maps/timeseries-fields'

export const formatTimeSeriesResponse = (trkdResponse) => {
  const result = []
  let previousClose = 0
  const length = trkdResponse['R'] && trkdResponse['R'].length || 0
  for (let i = 0; i < length; i++) {
    const values = trkdResponse['R'][i]
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
    fields.netChange = i == 0 ? 0 : fields.close - previousClose
    fields.percentChange = i == 0 ? 0 : fields.close / previousClose - 1
    previousClose = fields.close
    result.push(fields)
  }
  return result
}

export const formatExchangeDataResponse = (trkdResponse) => {
  const data = trkdResponse['GetExchangeData_Response_1']['ExchangeDataResponse']
  const result = {
    name: data['ExchangeName'],
    timezone: data['Timezone'],
    tradingDays: data['TradingWeek']['TradingDay'].map((day) => {
      const values = day['Session'][0]
      return {
        startDay: values['StartDay'],
        startTime: values['StartTime'],
        endDay: values['EndDay'],
        endTime: values['EndTime'],
      }
    }),
  }
  return result
}

export const formatTimezoneResponse = (trkdResponse) => {
  const data = trkdResponse['GetTimezoneList_Response_1']['TimezoneList']['Timezone']

  const today = new Date()
  function formatOffset(offset) {
    const hours = Math.floor(offset / 60)
    let strHours = hours.toString()
    if (hours === 0) {
      strHours = '+00'
    } else if (hours > 0) {
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

  return data.map((zone) => {
    const isSummer = zone['HasSummerTime'] && new Date(zone['SummerStart']) < today && new Date(zone['SummerEnd']) > today
    const offset = formatOffset(isSummer ? zone['SummerOffset'] : zone['GMTOffset'])
    return {
      id: zone['ShortName'],
      name: zone['LongName'],
      offset: offset,
    }
  })
}
