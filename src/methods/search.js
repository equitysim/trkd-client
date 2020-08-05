import { fileURLToPath } from 'url'
import path from 'path'
import Query from '../models/query'

const __filename = fileURLToPath(import.meta.url)
const filename = path.parse(__filename).name

const methods = {
  /**
   * @param {object} queries
   * @param {object} filters
   * @param {object} header
   * @returns {Promise}
   */
  async all(queries = Query.searchAll, filters = {}, header = Query.header) {
    const path = '/api/Search/Search.svc/REST/Searchall_1/GetSearchall_1'

    const query = new Query(queries)
    const filter = new Query(filters)

    const payload = {
      GetSearchall_Request_1: {
        QueryHeader: header,
        Query: [query],
        Filter: [filter],
      },
    }
    const res = await this._request(filename, methods.all.name.replace('bound ', ), path, payload)
    return res
  },
  /**
   * @param {object} queries
   * @param {object} filters
   * @param {object} header
   * @returns {Promise}
   */
  async derivativeQuote(queries = Query.optionQuote, filters = {}, header = defalutHeader) {
    const path = `/api/Search/Search.svc/REST/DerivativeQuote_1/GetDerivativeQuote_1`

    const query = new Query(queries)
    const filter = new Query(filters)
    const payload = {
      GetDerivativeQuote_Request_1: {
        UnentitledAccess: true,
        UseEnglishOnly: true,
        QueryHeader: header,
        Query: [query],
        Filter: [filter],
      },
    }
    const res = await this._request(filename, methods.derivativeQuote, path, payload)
    return res
  },
  /**
   * @param {object} queries
   * @param {object} filters
   * @param {object} header
   */
  async equityQuote(queries = Query.equityQuote, filters = {}, header = Query.header) {
    const path = `/api/Search/Search.svc/REST/EquityQuote_1/GetEquityQuote_1`

    const query = new Query(queries)
    const filter = new Query(filters)
    const payload = {
      GetEquityQuote_Request_1: {
        UnentitledAccess: true,
        UseEnglishOnly: true,
        QueryHeader: header,
        Query: [query],
        Filter: [filter],
      },
    }
    const res = await this._request(filename, methods.equityQuote, path, payload)
    return res
  },
  /**
   * @param {object} queries
   * @param {object} filters
   * @param {object} header
   */
  async fundQuote(queries = Query.fundQuote, filters = {}, header = Query.header) {
    const path = `/api/Search/Search.svc/REST/FundQuote_1/GetFundQuote_1`

    const query = new Query(queries)
    const filter = new Query(filters)
    const payload = {
      GetFundQuote_Request_1: {
        UnentitledAccess: true,
        UseEnglishOnly: true,
        QueryHeader: header,
        Query: [query],
        Filter: [filter],
      },
    }

    const res = await this._request(filename, methods.fundQuote, path, payload)
    return res
  },
  /**
   * @param {object} queries
   * @param {object} filters
   * @param {object} header
   */
  async governmentAndCorporateBondInstruments(queries = Query.bondInstrument, filters = {}, header = Query.header) {
    const path = '/api/Search/Search.svc/REST/GovCorpInst_1/GetGovCorpInst_1'

    const query = new Query(queries)
    const filter = new Query(filters)

    const payload = {
      GetGovCorpInst_Request_1: {
        QueryHeader: header,
        Filter: [filter],
        Query: [query],
      },
    }

    const res = await this._request(filename, methods.governmentAndCorporateBondInstruments, path, payload)
    return res
  },
}

export default methods