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

const formatSearchItems = (trkdBody) => {
  const result = []
  const items = trkdBody['Result']['Hit']
  for (const item of items) {
    result.push(formatSearchItem(item))
  }
  return result
}

export const formatSearchAllResponse = (trkdResponse, header) => ({
  docs: formatSearchItems(trkdResponse['GetSearchall_Response_1']),
  ...formatSearchHeader(trkdResponse['GetSearchall_Response_1'], header),
})

export const formatSearchDerivativeQuote = (trkdResponse, header) => ({
  docs: formatSearchItems(trkdResponse['GetDerivativeQuote_Response_1']),
  ...formatSearchHeader(trkdResponse['GetDerivativeQuote_Response_1'], header)
})

export const formatSearchEquityQuoteResponse = (trkdResponse, header) => ({
  docs: formatSearchItems(trkdResponse['GetEquityQuote_Response_1']),
  ... formatSearchHeader(trkdResponse['GetEquityQuote_Response_1'], header)
})

export const formatSearchFundQuoteResponse = (trkdResponse, header) => ({
  docs: formatSearchItems(trkdResponse['GetFundQuote_Response_1']),
  ...formatSearchHeader(trkdResponse['GetEquityQuote_Response_1'], header)
})

export const formatSearchBondInstrumentsResponse = (trkdResponse, header) => ({
  docs: formatSearchItems(trkdResponse['GetGovCorpInst_Response_1']),
  ...formatSearchHeader(trkdResponse['GetGovCorpInst_Response_1'], header)
})

export const formatSearchHeader = (trkdBody, header) => {
  const limit = header['MaxCount']
  const responseHeader = trkdBody['ResultHeader']
  return {
    page: Math.floor(responseHeader['FirstHit'] / limit) + 1,
    pages: Math.ceil(responseHeader['TotalHits'] / limit),
    limit,
    total: responseHeader['TotalHits'],
  }
}
