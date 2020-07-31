import { formatQuoteResponse } from '../formatting'

export default {
  /**
   * @param {string|[string]} ric
   * @param {?[string]} fields
   */
  async retrieveItem(ric, fields = null) {
    const hasFields = Array.isArray(fields) && fields.length > 0

    const path = '/api/Quotes/Quotes.svc/REST/Quotes_1/RetrieveItem_3'
    const rics = Array.isArray(ric) ? ric : [ric]
    const payload = {
      RetrieveItem_Request_3: {
        ItemRequest: [
          {
            Fields: hasFields ? fields.join(':') : '',
            RequestKey: rics.map((itemRic) => ({
              Name: typeof itemRic === 'string' ? itemRic : '',
              NameType: 'RIC',
            })),
            Scope: hasFields ? 'List' : 'All',
          },
        ],
        TrimResponse: false,
        IncludeChildItemQoS: false,
      },
    }

    const res = await this._request(path, payload)
    if (!this.format) return res
    return formatQuoteResponse(res)
  },
}