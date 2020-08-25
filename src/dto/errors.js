export class TRKDError extends Error {
  constructor(res) {
    super(res['Fault']['Reason']['Text']['Value'])
    this.name = this.constructor.name
    this.code = res['Fault']['Code']['Value']
    this.subcode = res['Fault']['Code']['Subcode']['Value']
    this.reference = res['Fault']['Detail']['ClientErrorReference']['ErrorReference']['Value']
    this.serverReference = res['Fault']['Detail']['ClientErrorReference']['ServerReference']['Value']
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends Error {
  constructor(message, property) {
    super(message)
    this.name = this.constructor.name
    this.property = property
  }
}