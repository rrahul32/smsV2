export type ServerResponse<T> = {
  result?: T
  error?: {
    errorCode?: number
    displayMessage: string
    reason?: string
  }
}
