import { fileURLToPath } from 'url'
import path from 'path'
import { formatFile } from '../utils'
import { formatEventHeadlines } from '../formatting/street-events'

const __filename = fileURLToPath(import.meta.url)
const filename = formatFile(path.parse(__filename).name)

const methods = {
  async getEventHeadlines(eventType, startDate, endDate = new Date().toISOString()) {
    const path = '/api/StreetEvents/StreetEvents.svc/REST/StreetEvents_2/GetEventHeadlines_1';
    const payload = {
      'GetEventHeadlines_Request_1': {
        'DateTimeRange': {
          'From': startDate,
          'To': endDate
        },
        'EventTypes': {
          'EventType': [
            eventType
          ]
        },
        'Pagination': {
          'PageNumber': 1,
          'RecordsPerPage': 2000
        },
        'UTCIndicatorInResponse': false
      }
    };

    const res = await this._request(filename, methods.getEventHeadlines, path, payload);
    if (!this.format) return res

    return formatEventHeadlines(res)
  },
  async getEvent(eventId) {
    const path = '/api/StreetEvents/StreetEvents.svc/REST/StreetEvents_2/GetEvent_1';
    const payload = {
      'GetEvent_Request_1': {
        'EventId': eventId,
        'UTCIndicatorInResponse': false
      }
    };

    const res = await this._request(filename, methods.getEventHeadlines, path, payload);
    if (!this.format) return res

    // TODO: format
    return res
  }
}

export default methods