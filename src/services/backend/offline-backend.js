import getTimeline from '@/services/offline/timeline/index'
import { GoalsBackend } from './goals-backend'

export class OfflineBackend extends GoalsBackend {
  goalsKey = 'gc-goals'
  static defaultInstance = null
  static getDefaultInstance() {
    return (OfflineBackend.defaultInstance ||= new OfflineBackend())
  }

  getTimeline() {
    const context = {}
    const req = {}
    const goals = localStorage.getItem(this.goalsKey) || []
    getTimeline(context, req, goals)
    return JSON.parse(context.res.body)
  }
}
