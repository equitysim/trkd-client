export default {
  async getEventHeadlines(eventType, startDate, endDate) {
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

    const res = await this._request(path, payload);
    if (!this.format) return res

    // TODO: format
    return res
  },
  async getEvent(eventId) {
    const path = '/api/StreetEvents/StreetEvents.svc/REST/StreetEvents_2/GetEvent_1';
    const payload = {
      'GetEvent_Request_1': {
        'EventId': eventId,
        'UTCIndicatorInResponse': false
      }
    };

    const res = await this._request(path, payload);
    if (!this.format) return res

    // TODO: format
    return res
  }
}