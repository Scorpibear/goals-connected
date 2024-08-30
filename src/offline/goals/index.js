export default async function (context, req, goals) {
  // use different goals based on username
  if (goals) {
    context.res = {
      body: JSON.stringify(goals.goals)
    }
  } else {
    context.log('no goals found')
    context.log('request:', req)
    context.res = {
      status: 404,
      body: 'no goals found'
    }
  }
}
