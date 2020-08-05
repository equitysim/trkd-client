export default class Query {
  constructor(queries) {
    for (let [key, value] of Object.entries(queries)) {
      if (Array.isArray(value) && value.every((v) => typeof v === 'string')) {
        this[key] = {
          Include: true,
          StringValue: value.map((v) => {
            const negated = value.charAt(0) === '!'
            if (negated) value = value.substring(1)
            return { Value: v, Negated: negated }
          }),
        }
      }

      if (typeof value === 'object') {
        this[key] = value
        continue
      }

      if (typeof value === 'string') {
        const negated = value.charAt(0) === '!'
        if (negated) value = value.substring(1)
        this[key] = { Include: true, StringValue: [{ Value: value, Negated: negated }] }
        continue
      }

      if (typeof value === 'boolean') {
        this[key] = { Include: value }
      }
    }
    return this
  }

  static get header() {
    return {
      MaxCount: 4000,
      Pivot: 0,
      Timeout: 500,
      Spellcheck: 'Off',
    }
  }

  static get searchAll() {
    return {
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
  }

  static get equityQuote() {
    return {
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
  }
  static get fundQuote() {
    return { ...Query.equityQuote, AssetCategory: 'ETF' }
  }

  static get bondInstrument() {
    return {
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
  }

  static get derivativeQuote() {
    return {
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
  }
}
