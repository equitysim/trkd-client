# TRKD Client
REST Client for Thomson Reuters Knowledge Direct (TRKD) API

# Installation
**Requires module support**
```
$ npm install @equitysim/trkd-client --save
```

# Usage
``` nodejs
import TRKDClient from '@equitysim/trkd-client'

TRKDClient.init({
  application: TRKD_APP,
  username: TRKD_USER,
  password: TRKD_PASS
})

const trkdClient = new TRKDClient()
trkdClient.quotes.retrieveItem('AAPL.O').then(quote => {
  console.log(quote)
})
```

# Catalog

## Fundamentals
```
trkdClient.fundamentals.getSnapshotReports(companyId, companyIdType = 'RIC')
```

## Quotes
```
trkdClient.quotes.retrieveItem(ric, fields = null)
```

## Search
```
trkdClient.search.all(queries = searchAllQueries, filters = {}, header = defaultHeader)

trkdClient.search.equityQuote(queries = equityQuoteQueries, filters = {}, header = defaultHeader)

trkdClient.search.fundQuote(queries = fundQuoteQueries, filters = {}, header = defaultHeader)

trkdClient.search.governmentAndCorporateBondInstruments(queries = bondInstrumentQueries, filters = {}, header = defaultHeader)
```

## Street Events
```
trkdClient.streetEvents.getEventHeadlines(eventType, startDate, endDate)

trkdClient.streetEvents.getEvent(eventId)
```

## Time Series
```
trkdClient.timeseries.getIntraday(ric, startTime, endTime, interval)

trkdClient.timeseries.getInterday(ric, startTime, endTime, interval)

trkdClient.timeseries.getExchangeData(ric)

trkdClient.timeseries.getTimezone()
```


### Search Queries and Filters
Values may be booleans, strings, or objects. Booleans and strings are constructed into appropriate query objects, whereas objects are passed in as is.

Examples:
```
{
  AssetCategory: true
}

becomes:

{
  AssetCategory: {
    Include: true
  }
}
```
---
```
{
  ExchangeCode: 'NSQ'
}

becomes:

{
  ExchangeCode: {
    Include: true,
    StringValue: [{
      Value: 'NSQ'
    }]
  }
}
```
---
```
{
  ExchangeCode: '!NSQ'
}

becomes:

{
  ExchangeCode: {
    Include: true,
    StringValue: [{
      Value: 'NSQ',
      Negated: true
    }]
  }
}
```
---
```
{
  MaturityDate: {
    Include: true,
    DateValue: [{
      Expression: 'GreaterThan',
      Value: new Date()
    }]
  }
}

has no change
```

# Init Options
| Name | Default | type | Notes |
|------|---------|------|---------|
| application | null | string | trkd provided
| username | null | string | trkd provided
| password | null | string | trkd provided
| format | true | boolean | format responses into proper json

# Caching and Limiting

TR has rate limits on every route. It is recommended to use a rate limiter like [bottleneck](https://www.npmjs.com/package/bottleneck) and to cache responses in [redis](https://redis.io/).

# Contributing
Contributions are very welcome and encouraged! Currently the client is very focused on EquitySim use case, but we are more than happy to expand on it.

To get started be sure you have node v10+ (12 LTS is recommended)
```
$ git clone https://github.com/equitysim/trkd-client.git
$ cd ./trkd-client
$ npm install
```

Submit Pull Requests or any Issues on Github.

Cheers!
