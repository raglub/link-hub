export default class IpcResponse<T> {
  response!: T
  error!: Error

  isError () {
    return !!this.error
  }
}