export class APIError extends Error {
  public statusCode: number

  public context?: object

  constructor(message: string, statusCode: number, context?: object) {
    super(message)
    this.statusCode = statusCode
    this.name = 'APIError'
    this.context = context
  }
}
