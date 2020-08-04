/**
 * Constructs a TRKD formatted payload query
 *
 * @param {object} queries
 * @returns {object}
 */
export const constructQuery = (queries) => {
  const query = {}
  for (let [key, value] of Object.entries(queries)) {
    if (typeof value === 'object') {
      query[key] = value
      continue
    }

    if (typeof value === 'string') {
      const negated = value.charAt(0) === '!'
      if (negated) value = value.substring(1)
      query[key] = { Include: true, StringValue: [{ Value: value, Negated: negated }] }
      continue
    }

    if (typeof value === 'boolean') {
      query[key] = { Include: value }
    }
  }
  return query
}

export const defaultHeader = {
  MaxCount: 4000,
  Pivot: 0,
  Timeout: 500,
  Spellcheck: 'Off',
}

export const searchAllQueries = {
  BusinessEntity: 'QUOTE',
  Currency: true,
  DerivedCategory: true,
  ExchangeCode: true,
  IssuerCommonName: true,
  IssuerCountry: true,
  SectorDescription: true,
  CallPutOption: true,
  CommonName: true,
  ExpiryDate: true,
  StrikePrice: true,
  TickerSymbol: true,
  UnderlyingIssuerName: true,
  UnderlyingQuoteRIC: true,
}

export const equityQuoteQueries = {
  ExchangeCode: true,
  TickerSymbol: true,
  RIC: true,
  Currency: true,
  AssetType: 'EQUITY',
  AssetCategory: '!ETF',
  DerivedCategory: true,
  IssuerCommonName: true,
  IssuerCountry: true,
}

export const fundQuoteQueries = { ...equityQuoteQueries, AssetCategory: 'ETF' }

export const bondInstrumentQueries = {
  BusinessEntity: true,
  CommonName: true,
  AssetCategory: true,
  AssetType: true,
  CouponClass: true,
  CouponClassDescription: true,
  CouponCurrency: true,
  CouponFrequency: true,
  CouponRate: true,
  CouponType: true,
  CouponTypeDescription: true,
  Currency: true,
  CountryName: true,
  ISIN: true,
  IssueDate: true,
  IssuerCountry: true,
  IssuerName: true,
  LongName: true,
  MaturityDate: true,
  RIC: true,
  Ticker: true,
  ParentIndustrySector: true,
}

export const derivativeQuoteQueries = {
  CommonName: true,
  DerivedCategory: true,
  AssetCategory: 'EIO',
  CallPutOption: true,
  Currency: true,
  ExchangeCode: 'OPQ',
  ExpiryDate: true,
  IsChain: false,
  RIC: true,
  StrikePrice: true,
  TickerSymbol: true,
  UnderlyingIssuerName: true,
  UnderlyingQuoteRIC: true,
}
