import FetchLocal from './fetch-local'
import { GoalsBackend } from './goals-backend'

export class OfflineBackend extends GoalsBackend {
  goalsDataKey = 'gc-goals-data'
  static defaultInstance = null

  constructor({ goalsData } = {}) {
    super()
    goalsData ||= this.goalsData
    this.fetch = FetchLocal.create({ base: '@/src/offline', goalsData })
    console.debug('OfflineBackend::fetch: ', this.fetch)
  }

  static getDefaultInstance() {
    return (OfflineBackend.defaultInstance ||= new OfflineBackend())
  }

  get goalsData() {
    try {
      return JSON.parse(localStorage.getItem(this.goalsDataKey))
    } catch {
      return {}
    }
  }
}
