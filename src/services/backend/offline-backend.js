import FetchLocal from './fetch-local'
import LocalGoalsProvider from './local-goals-provider'
import { GoalsBackend } from './goals-backend'

export class OfflineBackend extends GoalsBackend {
  goalsDataKey = 'gc-goals-data'
  static defaultInstance = null

  constructor(goalsProvider = new LocalGoalsProvider()) {
    super()
    this.fetch = FetchLocal.create({ goalsProvider })
    this.endpoint = '' // used by parent class to construct the URL for fetch
  }

  static getDefaultInstance() {
    return (OfflineBackend.defaultInstance ||= new OfflineBackend())
  }
}
