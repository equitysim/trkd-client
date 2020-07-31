export class TRKDError extends Error {
  constructor(res) {
    const message = res['Fault']['Reason']['Text']['Value']
    super(message)
    this.name = res['Fault']['Code']['Value']
    this.reference = res['Fault']['Detail']['ClientErrorReference']['ErrorReference']['Value']
    this.serverReference = res['Fault']['Detail']['ClientErrorReference']['ServerReference']['Value']
  }
}

export class ValidationError extends Error {
  constructor(message, property) {
    super(message)
    this.name = 'Validation Error'
    this.property = property
  }
}