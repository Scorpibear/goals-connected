export default async function (context, req, goals) {
  const out = []
  const targetType = 1
  function search(goal) {
    if (goal.type == targetType) {
      out.push(goal)
    } else {
      goal?.children?.forEach(search)
    }
  }
  try {
    goals.goals.forEach(search)

    context.res = {
      // status: 200, /* Defaults to 200 */
      body: JSON.stringify(out)
    }
  } catch (ex) {
    context.res = {
      status: 500,
      body: ex.toString()
    }
  }
}
