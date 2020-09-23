import ratioFieldsMap from './field-maps/ratio-fields'
import forecastFieldsMap from './field-maps/forecase-fields'
import { getSafe, validDate, valueByType } from '../utils'

export const formatSnapshotReportResponse = (trkdResponse) => {
  try {
    const data = trkdResponse['GetSnapshotReports_Response_1']['FundamentalReports']['ReportSnapshot']

    const companyInfo = data['CoIDs']['CoID']
    const officerList = data['officers']['officer']

    const {
      Issues: { Issue: issues },
      CoGeneralInfo: generalInfo,
      TextInfo: { Text: textInfo },
      contactInfo,
      webLinks,
      peerInfo: { IndustryInfo: industryInfo, Indexconstituet: indexConstituent },
      Ratios: { Group: ratiosGroup },
      ForecastData: { Ratio: forecastRatio, EarningsBasis: earningsBasis, ConsensusType: consensusType },
    } = data

    const ratioData = ratiosGroup.reduce((acc, { Ratio }) => [...acc, ...Ratio], [])
    // map all ratio fields to proper names and values
    const {
      marketCap,
      bookValuePerShare,
      cashPerShare,
      priceToBook,
      revenue,
      earnings,
      netIncome,
      revenuePerShare,
      earningsPerShare,
      cashFlowPerShare,
      dividendYieldPerShare,
      grossMargin,
      priceToEarningsRatio,
      returnOnAverageEquity,
      priceToRevenue,
    } = ratioData.reduce((acc, field) => {
      const key = ratioFieldsMap[field['FieldName']]
      if (key) acc[key] = field['Value']
      return acc
    }, {})

    // map all forecast fields to proper names and values
    const {
      consensusRecommendation,
      targetPrice,
      projectedLongTermGrowth,
      projectedPriceToEarningsRatio,
      projectedAnnualSales,
      projectedQuarterlySales,
      projectedAnnualEarningsPerShare,
      projectedQuarterlyEarningPerShare,
      projectedProfit,
      projectedDividendYieldPerShare,
    } = forecastRatio.reduce((acc, field) => {
      const key = forecastFieldsMap[field['FieldName']]
      if (key) acc[key] = field['Value'][0]['Value']
      return acc
    }, {})

    const snapshot = {
      id: valueByType(companyInfo, 'RepNo'),
      displayName: valueByType(companyInfo, 'CompanyName'),
      securityIds: issues.reduce((acc, { IssueID }) => {
        const value = valueByType(IssueID, 'RIC')
        if (value) return [...acc, value]
        return acc
      }, []),
      tickers: issues.reduce((acc, { IssueID }) => {
        const value = valueByType(IssueID, 'Ticker')
        if (value) return [...acc, value]
        return acc
      }, []),
      employees: {
        updatedAt: getSafe(() => generalInfo['Employees']['LastUpdated']),
        value: getSafe(() => generalInfo['Employees']['Value']),
      },
      sharesOutstanding: {
        updatedAt: getSafe(() => generalInfo['SharesOut']['Date']),
        value: getSafe(() => generalInfo['SharesOut']['Value']),
      },
      shareholders: {
        updatedAt: getSafe(() => generalInfo['CommonShareholders']['Date']),
        value: getSafe(() => generalInfo['CommonShareholders']['Value']),
      },
      businessSummary: valueByType(textInfo, 'Business Summary'),
      financialSummary: valueByType(textInfo, 'Financial Summary'),
      address: {
        street: contactInfo['streetAddress'].reduce((acc, { Value }) => (Value ? [...acc, Value] : acc), []).join(' '),
        city: contactInfo['city'],
        state: contactInfo['state-region'],
        country: getSafe(() => contactInfo['country']['Value']),
        countryCode: getSafe(() => contactInfo['country']['code']),
      },
      website: getSafe(() => webLinks['webSite'].find((site) => site['mainCategory'] === 'Home Page')['Value']),
      sector: industryInfo['Industry'].reduce((acc, { code, Value, type }) => (type === 'MGSECTOR' ? { code, name: Value } : acc), {}),
      industry: industryInfo['Industry'].reduce(
        (acc, { code, Value, type }) => (['MGINDUSTRY', 'NAICS'].includes(type) ? [...acc, { code, name: Value }] : acc),
        []
      ),
      indexConstituent,
      officers: officerList.map((officer) => {
        const {
          firstName,
          lastName,
          since,
          age,
          title: { Value: title, abbr1: titleAbbreviation, startYear },
        } = officer

        const titleStartYear = validDate(new Date(startYear)) ? new Date(startYear) : null
        const companyStartDate = validDate(new Date(since)) ? new Date(since) : null

        return {
          firstName,
          lastName,
          companyStartDate: new Date(companyStartDate),
          age,
          title,
          titleAbbreviation,
          titleStartYear: new Date(titleStartYear),
        }
      }),
      marketCap,
      quarter: {
        bookValuePerShare,
        priceToBook,
        cashPerShare,
      },
      annual: {
        revenue,
        earnings,
        netIncome,
        earningsPerShare,
        revenuePerShare,
        cashFlowPerShare,
        dividendYieldPerShare,
        grossMargin,
        returnOnAverageEquity,
        priceToRevenue,
        priceToEarningsRatio,
      },
      forecast: {
        consensusType,
        consensusRecommendation,
        earningsBasis,
        targetPrice,
        projectedLongTermGrowth,
        projectedPriceToEarningsRatio,
        projectedAnnualSales,
        projectedQuarterlySales,
        projectedAnnualEarningsPerShare,
        projectedQuarterlyEarningPerShare,
        projectedProfit,
        projectedDividendYieldPerShare,
      },
    }

    return snapshot
  } catch (err) {
    return null
  }
}
