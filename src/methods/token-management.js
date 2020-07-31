import fetch from 'node-fetch'

export default {
  async createServiceToken(TRKDClient) {
    const path = this.host + '/api/TokenManagement/TokenManagement.svc/REST/Anonymous/TokenManagement_1/CreateServiceToken_1'
    const body = JSON.stringify({
      CreateServiceToken_Request_1: {
        ApplicationID: TRKDClient._serviceAccount.application,
        Username: TRKDClient._serviceAccount.username,
        Password: TRKDClient._serviceAccount.password,
      },
    })

    const headers = {
      'Content-Type': 'application/json',
    }

    const res = await fetch(path, { method: 'POST', headers, body })
    if (!res.ok) throw new Error(res.statusText)
    const json = await res.json()
    const responseObj = json['CreateServiceToken_Response_1']
    TRKDClient.updateCredentials(responseObj['Token'], new Date(responseObj['Expiration']))
    return responseObj
  },
}