import { getDatePeriods, setLocale } from '../services/date-utils'

const NoDatePeriodName = 'Maybe someday'

export default async function (context, req, goals) {
  const mapByDate = {}
  setLocale(req.query?.locale)
  const periodsData = getDatePeriods(new Date())

  function addGoal(goal, periodName) {
    if (!mapByDate[periodName]) mapByDate[periodName] = []
    mapByDate[periodName].push(goal)
  }

  function addToTimeline(goal) {
    let date = Date.parse(goal.targetDate)
    for (let i = 0; i < periodsData.length; i++) {
      if (date < periodsData[i].end) return addGoal(goal, periodsData[i].title)
    }
    return addGoal(goal, NoDatePeriodName)
  }

  function search(goal) {
    if (goal?.children?.length) {
      goal.children.forEach(search)
    }
    if (goal.type || goal.targetDate) {
      // all goals with targetDate and all non-zero type goals
      addToTimeline(goal)
    }
  }

  function formatMap(map) {
    let output = []
    // need to iterate through periodsData to keep the correct order in the output
    periodsData.forEach((period) => {
      const goals = mapByDate[period.title]
      if (goals?.length) {
        output.push({ ...period, goals })
      }
    })
    if (NoDatePeriodName in map) {
      output.push({ title: NoDatePeriodName, goals: map[NoDatePeriodName] })
    }
    return JSON.stringify(output)
  }

  try {
    goals.goals.forEach(search)

    context.res = {
      // status: 200, /* Defaults to 200 */
      body: formatMap(mapByDate)
    }
  } catch (ex) {
    context.res = {
      status: 500,
      body: ex.toString()
    }
  }
}
