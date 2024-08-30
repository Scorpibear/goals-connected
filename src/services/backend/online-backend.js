import { GoalsBackend } from './goals-backend'

export class OnlineBackend extends GoalsBackend {
  constructor(endpoint, key, userId) {
    super()
    this.endpoint =
      endpoint || localStorage.getItem('endpoint') || 'https://goalsconnected.azurewebsites.net/api'
    this.key =
      key ||
      localStorage.getItem('key') ||
      'cYt1GnWRW1KjJY7eW6-jzOqk-Mctdd-cUWNavGoN9RvHAzFuGD4Tkw=='
    this.userId = userId || localStorage.getItem('userId') || '01909322-0bff-72ed-a522-632d025e53df' // example;
  }

  static getDefaultInstance() {
    return (OnlineBackend.defaultInstance ||= new OnlineBackend())
  }
}
