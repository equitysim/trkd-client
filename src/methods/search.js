import { searchAllQueries, constructQuery, equityQuoteQueries, bondInstrumentQueries, defaultHeader } from '../utils/defaults'

export default {
  /**
   * @param {object} queries
   * @param {object} filters
   * @param {object} header
   */
  async all(queries = searchAllQueries, filters = {}, header = defaultHeader) {
    const path = '/api/Search/Search.svc/REST/Searchall_1/GetSearchall_1'

    const query = constructQuery(queries)
    const filter = constructQuery(filters)

    const payload = {
      GetSearchall_Request_1: {
        QueryHeader: header,
        Query: [query],
        Filter: [filter],
      },
    }
    const res = await this._request(path, payload)
    return res
  },
  async derivativeQuote(queries = optionQuoteQueries, filters = {}, header = defalutHeader) {
    const path = `/api/Search/Search.svc/REST/DerivativeQuote_1/GetDerivativeQuote_1`

    const query = constructQuery(queries)
    const filter = constructQuery(filters)
    const payload = {
      GetDerivativeQuote_Request_1: {
        UnentitledAccess: true,
        UseEnglishOnly: true,
        QueryHeader: header,
        Query: [query],
        Filter: [filter],
      },
    }
    const res = await this._request(path, payload)
    return res
  },
    /**
   * @param {object} queries
   * @param {object} filters
   * @param {object} header
   */
  async equityQuote(queries = equityQuoteQueries, filters = {}, header = defaultHeader) {
    const path = `/api/Search/Search.svc/REST/EquityQuote_1/GetEquityQuote_1`

    const query = constructQuery(queries)
    const filter = constructQuery(filters)
    const payload = {
      GetEquityQuote_Request_1: {
        UnentitledAccess: true,
        UseEnglishOnly: true,
        QueryHeader: header,
        Query: [query],
        Filter: [filter],
      },
    }
    const res = await this._request(path, payload)
    return res
  },
    /**
   * @param {object} queries
   * @param {object} filters
   * @param {object} header
   */
  async fundQuote(queries = fundQuoteQueries, filters = {}, header = defaultHeader) {
    const path = `/api/Search/Search.svc/REST/FundQuote_1/GetFundQuote_1`

    const query = constructQuery(queries)
    const filter = constructQuery(filters)
    const payload = {
      GetFundQuote_Request_1: {
        UnentitledAccess: true,
        UseEnglishOnly: true,
        QueryHeader: header,
        Query: [query],
        Filter: [filter],
      },
    }

    const res = await this._request(path, payload)
    return res
  },
    /**
   * @param {object} queries
   * @param {object} filters
   * @param {object} header
   */
  async governmentAndCorporateBondInstruments(queries = bondInstrumentQueries, filters = {}, header = defaultHeader) {
    const path = '/api/Search/Search.svc/REST/GovCorpInst_1/GetGovCorpInst_1'

    const query = constructQuery(queries)
    const filter = constructQuery(filters)

    const payload = {
      GetGovCorpInst_Request_1: {
        QueryHeader: header,
        Filter: [filter],
        Query: [query],
      },
    }

    const res = await this._request(path, payload)
    return res
  }
}
