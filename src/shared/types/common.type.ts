export type ServerError = {
  errorCode?: number
  displayMessage: string
  reason?: string
}
export type ServerResponse<T> = {
  result?: T
  error?: ServerError
}
