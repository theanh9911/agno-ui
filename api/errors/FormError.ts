import { APIError } from './APIError'

export const ALL_FIELDS_KEY = '_allFields'

interface ErrorObject {
  [ALL_FIELDS_KEY]: string[]
  [key: string]: string[]
}

export class FormError extends APIError {
  public errors: ErrorObject

  constructor(message: string, statusCode: number, errors: ErrorObject) {
    super(message, statusCode)

    this.errors = errors
    this.name = 'FormError'
  }
}
