export class GoalsBackend {
  constructor(endpoint, key, userId) {
    this.endpoint =
      endpoint || localStorage.getItem('endpoint') || 'https://goalsconnected.azurewebsites.net/api'
    this.key =
      key ||
      localStorage.getItem('key') ||
      'cYt1GnWRW1KjJY7eW6-jzOqk-Mctdd-cUWNavGoN9RvHAzFuGD4Tkw=='
    this.userId = userId || localStorage.getItem('userId') || '01909322-0bff-72ed-a522-632d025e53df' // example;
  }

  async create(goalData) {
    try {
      console.log(`Creating the goal with data: '${JSON.stringify(goalData)}'`)
      const url = this.apiPath2url('/goal')
      const response = await fetch(url, { method: 'POST', body: JSON.stringify(goalData) })
      return response.json()
    } catch (ex) {
      console.error('Issue while creating the goal: ' + ex)
    }
  }

  delete(goalId) {
    try {
      console.log(`Deleting the goal with id = '${goalId}'`)
      const apiPath = '/goal'
      const url = `${this.apiPath2url(apiPath)}&id=${goalId}`
      return fetch(url, {
        method: 'DELETE'
      })
    } catch (ex) {
      console.error('Issue while deleting the goal: ' + ex)
    }
  }

  static getDefaultInstance() {
    return (GoalsBackend.defaultInstance ||= new GoalsBackend())
  }

  apiPath2url(apiPath) {
    return `${this.endpoint}${apiPath}?code=${this.key}&userId=${this.userId}&locale=${navigator.language}`
  }

  updateGoal(goalData) {
    try {
      console.debug('Updating the goal with the following data: ' + JSON.stringify(goalData))
      const apiPath = '/goal'
      const url = `${this.apiPath2url(apiPath)}&id=${goalData.id}`
      return fetch(url, {
        method: 'PUT',
        body: JSON.stringify(goalData)
      })
    } catch (ex) {
      console.error('Issue while updating the goal: ' + ex)
    }
  }

  async fetchGoals(apiPath) {
    try {
      const url = this.apiPath2url(apiPath)
      let response = await fetch(url)
      let goalsData = await response.json()
      return goalsData
    } catch (ex) {
      console.error('Issue while fetching the goals:' + ex)
    }
  }

  getGoalsTree() {
    return this.fetchGoals('/goals')
  }

  getActGoals() {
    return this.fetchGoals('/actgoals')
  }

  getResultGoals() {
    return this.fetchGoals('/resultgoals')
  }

  getTimeline() {
    return this.fetchGoals('/timeline')
  }

  async moveUp(id) {
    return this.patch(id, 'moveUp')
  }

  async levelUp(id) {
    return this.patch(id, 'levelUp')
  }

  async levelDown(id) {
    return this.patch(id, 'levelDown')
  }

  async complete(id, value) {
    return this.patch(id, 'complete', { value })
  }

  async patch(id, action, params) {
    try {
      console.debug(`${action} goal with id = '${id}'`)
      const apiPath = '/goal'
      let url = `${this.apiPath2url(apiPath)}&id=${id}&action=${action}`
      if (params) {
        for (const key in params) {
          if (Object.prototype.hasOwnProperty.apply(params, [key])) {
            url += `&${key}=${params[key]}`
          }
        }
      }

      const response = await fetch(url, { method: 'PATCH' })
      return response.text()
    } catch (ex) {
      console.error(`Could not ${action} the goal: `, ex)
    }
  }
}
