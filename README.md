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

The trkdClient object shape is modeled after the TRKD catalog with method names matching those within TRKD.

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
trkdClient.search.all(queries = Query.all, filters = {}, header = Query.header)

trkdClient.search.derivativeQuote(queries = Query.derivativeQuote, filters = {}, header = Query.header)

trkdClient.search.equityQuote(queries = Query.equityQuote, filters = {}, header = Query.header)

trkdClient.search.fundQuote(queries = Query.fundQuote, filters = {}, header = Query.header)

trkdClient.search.governmentAndCorporateBondInstruments(queries = Query.bondInstrument, filters = {}, header = Query.header)
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
---
# Init Options
| Name | Default | type | Notes |
|------|---------|------|---------|
| application | null | string | trkd provided
| username | null | string | trkd provided
| password | null | string | trkd provided
| redisConnection | null | object | redis or ioredis connection
| log | true | boolean | log requests by path to console

# Formatting
The SOAP responses from TR are formatted to proper JSON by default, however you can override this behaviour per instance with
```
const tkrClient = new TRKDClient({format: false})
```

# Caching and Limiting

A [redis](https://redis.io) connection may be passed in the init options. Currently a [redis](https://www.npmjs.com/package/redis) or [ioredis](https://www.npmjs.com/package/ioredis) may be used.
To be used you must set the expiration times (in seconds) per method or group as well.
```
TRKDClient.expiration.quotes.retrieveItem = 5
TRKDClient.expiration.timeSeries = {
  getIntraday: 60, // one minute
  getInterday: 60 * 60 * 24, // one day
  getExchangeData: 60 * 60 * 24 * 7, // one week
  getTimezone: 60 * 60 * 24 * 30, // one month
}
```

TR has rate limits on every route. It is recommended to use a rate limiter like [bottleneck](https://www.npmjs.com/package/bottleneck).

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
