import quoteFields from './field-maps/quote-fields'
import recordTypes from './field-maps/record-types'
import dividendFrequencies from './field-maps/dividend-frequencies'
/**
 * Used to construct TRKD models from the RetrieveItem3 response
 *
 * @param {[object]} fieldsArr
 */
export const formatQuoteResponse = (trkdResponse) => {
  const result = []
  let items
  try {
    items = trkdResponse['RetrieveItem_Response_3']['ItemResponse'][0]['Item']
  } catch (err) {
    console.error(err)
    return result
  }

  for (const item of items) {
    const fieldsArr = item['Fields'] && item['Fields']['Field']
    if (!Array.isArray(fieldsArr)) continue
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

        if (mapResult.type === String && typeof data === 'string') {
          data = data.trim()
        }

        if (mapResult.name === 'dividendFrequency') {
          data = dividendFrequencies[data] || 4
        }

        if (mapResult.name === 'recordType') {
          data = recordTypes[data]
        }

        mapped[mapResult.name] = data
      }
    }
    mapped.id = item['RequestKey']['Name']
    result.push(mapped)
  }
  return result
}
