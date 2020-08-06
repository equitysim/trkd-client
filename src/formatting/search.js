import searchFields from './field-maps/search-fields'

const formatSearchItem = (item) => {
  const mapped = {}
  for (const [key, value] of Object.entries(item)) {
    const mapResult = searchFields[key]
    if (mapResult) {
      let data = value
      if (mapResult.type === Date) {
        data = new Date(data)
      }

      if (mapResult.type === String) {
        data = data.trim()
      }

      mapped[mapResult.name] = data
    }
  }
  return mapped
}

const formatSearchItems = (responseName, trkdResponse) => {
  const result = []
  const items = trkdResponse[responseName]['Result']['Hit']
  for (const item of items) {
    result.push(formatSearchItem(item))
  }
  return result
}

export const formatSearchAllResponse = (trkdResponse) => formatSearchItems('GetSearchall_Response_1', trkdResponse)

export const formatSearchEquityQuoteResponse = (trkdResponse) => formatSearchItems('GetEquityQuote_Response_1', trkdResponse)

export const formatSearchFundQuoteResponse = (trkdResponse) => formatSearchItems('GetFundQuote_Response_1', trkdResponse)

export const formatSearchBondInstrumentsResponse = (trkdResponse) => formatSearchItems('GetGovCorpInst_Response_1', trkdResponse)
