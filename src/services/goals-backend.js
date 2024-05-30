export class GoalsBackend {
  constructor(endpoint, key) {
    this.endpoint = endpoint || 'https://goalsconnected.azurewebsites.net/api'
    this.key = key || 'ubG0PmjhlrhsErJr7xz6SunsD6QJK-FMy8_UHHKU1oQUAzFudzaInQ%3D%3D'
  }

  static getDefaultInstance() {
    return (GoalsBackend.defaultInstance ||= new GoalsBackend())
  }

  apiPath2url(apiPath) {
    return `${this.endpoint}${apiPath}?code=${this.key}`
  }

  updateGoal(goalData) {
    try {
      console.log('Updating the goal with the following data: ' + JSON.stringify(goalData))
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

  async getResultGoals() {
    return this.fetchGoals('/resultgoals')
  }

  getTimeline() {
    return this.fetchGoals('/timeline')
  }
}
