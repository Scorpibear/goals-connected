import FetchLocal from './fetch-local'
import { GoalsBackend } from './goals-backend'

export class OfflineBackend extends GoalsBackend {
  goalsDataKey = 'gc-goals-data'
  static defaultInstance = null

  constructor({ goalsData } = {}) {
    super()
    goalsData ||= this.loadGoalsData()
    this.fetch = FetchLocal.create({ goalsData })
    console.debug('OfflineBackend::fetch: ', this.fetch)
  }

  static getDefaultInstance() {
    return (OfflineBackend.defaultInstance ||= new OfflineBackend())
  }

  loadGoalsData() {
    try {
      return JSON.parse(localStorage.getItem(this.goalsDataKey))
    } catch {
      return {}
    }
  }
}
