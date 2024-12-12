const initGoalsData = { goals: [{ id: '0-0-0-0-0-0-0', title: 'Be happy' }], types: [] }

export default class LocalGoalsProvider {
  goalsDataKey

  constructor(goalsDataKey = 'gc-goals-data') {
    this.goalsDataKey = goalsDataKey
  }

  loadGoalsData() {
    let data = initGoalsData
    try {
      let loaded = JSON.parse(localStorage.getItem(this.goalsDataKey))
      if (loaded.goals && loaded.types) data = loaded
    } catch {}
    return data
  }

  saveGoalsData(goalsData) {
    localStorage.setItem(this.goalsDataKey, JSON.stringify(goalsData))
  }
}
