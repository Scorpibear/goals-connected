export default async function (context, req, goals) {
  const actGoals = []
  const actGoalType = 2
  function search(goal) {
    if (goal?.children?.length) {
      goal.children.forEach(search)
      return
    }
    if (goal.type == actGoalType) {
      actGoals.push(goal)
    }
  }
  try {
    goals.goals.forEach(search)

    context.res = {
      // status: 200, /* Defaults to 200 */
      body: JSON.stringify(actGoals)
    }
  } catch (ex) {
    context.res = {
      status: 500,
      body: ex.toString()
    }
  }
}
