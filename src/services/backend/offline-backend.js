import FetchLocal from './fetch-local'
import { GoalsBackend } from './goals-backend'

export class OfflineBackend extends GoalsBackend {
  goalsDataKey = 'gc-goals-data'
  static defaultInstance = null

  constructor({ goalsData } = {}) {
    super()
    this.goalsData = goalsData || this.loadGoalsData()
    this.fetch = FetchLocal.create({ goalsData: this.goalsData })
    this.endpoint = ''
  }

  static getDefaultInstance() {
    return (OfflineBackend.defaultInstance ||= new OfflineBackend())
  }

  loadGoalsData() {
    let data = { goals: [{ id: '0-0-0-0-0-0-0', title: 'Be happy' }], types: [] }
    try {
      let loaded = JSON.parse(localStorage.getItem(this.goalsDataKey))
      if (loaded.goals && loaded.types) data = loaded
    } catch {}
    return data
  }
}
