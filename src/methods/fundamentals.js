import { ValidationError } from '../dto/errors'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const filename = path.parse(__filename).name

const methods = {
  /**
   *
   * @param {string} companyId
   * @param {?string} companyIdType
   * @returns {Promise}
   */
  async getSnapshotReports(companyId, companyIdType = 'RIC') {
    const idTypes = ['RIC', 'RepoNo']

    if (typeof companyId !== 'string') throw new TypeError('companyId must be a string')
    if (typeof companyIdType !== 'string' || !idTypes.includes(companyIdType)) throw new ValidationError(`companyIdType must be one of the following ${idTypes.toString()}`, companyIdType)

    const path = '/api/Fundamentals/Fundamentals.svc/REST/Fundamentals_1/GetSnapshotReports_1';
    const payload = {
      'GetSnapshotReports_Request_1': {
        'companyId': companyId,
        'companyIdType': companyIdType
      }
    };

    const res = await this._request(filename, methods.getSnapshotReports, path, payload)
    // format
    return res
  }
}

export default methods