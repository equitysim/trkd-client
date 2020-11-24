import { formatQuoteResponse } from '../formatting'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const filename = path.parse(__filename).name

const methods = {
  /**
   * @param {string|[string]} ric
   * @param {?[string]} fields
   */
  async retrieveItem(ric, fields = null) {
    const hasFields = Array.isArray(fields) && fields.length > 0

    const path = '/api/Quotes/Quotes.svc/REST/Quotes_1/RetrieveItem_3'
    const rics = (Array.isArray(ric) ? ric : [ric]).filter(Boolean)
    if (rics.length === 0) return [];
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

    const res = await this._request(filename, methods.retrieveItem, path, payload)
    if (!this.format) return res
    return formatQuoteResponse(res)
  },
}

export default methods
