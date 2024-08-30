export class OfflineBackend {
  static defaultInstance = null
  static getDefaultInstance() {
    return (OfflineBackend.defaultInstance ||= new OfflineBackend())
  }

  getTimeline() {
    return []
  }
}
