import { formatItem } from './search'
import eventHeadlines from './field-maps/event-headlines'

export const formatEventHeadlines = (trkdResponse) => {
  const data = trkdResponse['GetEventHeadlines_Response_1']['EventHeadlines']['Headline']
  const header = trkdResponse['GetEventHeadlines_Response_1']['PaginationResult']

  const docs = data.map(headline => {
    const base = formatItem(headline, eventHeadlines)
    const org = headline['Organization'];
    return { ...base, issuer: org['Name'], securityIds: org['Symbols']['Symbol'].map(({ Value }) => Value )}
  })

  return {
    page: header['PageNumber'],
    pages: Math.ceil(header['TotalRecores'] / header['RecordsPerPage']),
    limit: header['RecordsPerPage'],
    total: header['TotalRecords'],
    docs
  }
}