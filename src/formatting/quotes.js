import quoteFields from './field-maps/quote-fields'

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
