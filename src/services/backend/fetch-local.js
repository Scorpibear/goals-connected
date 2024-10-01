import actgoals from '@/services/offline/actgoals/index'
import goal from '@/services/offline/goal/index'
import goals from '@/services/offline/goals/index'
import resultgoals from '@/services/offline/resultgoals/index'
import timeline from '@/services/offline/timeline/index'

class Response {
  body = ''
  status = 200

  constructor(data) {
    this.body ||= data.body
    this.status ||= data.status
  }

  text() {
    return Promise.resolve(this.body)
  }
  json() {
    return Promise.resolve(JSON.parse(this.body))
  }
}

class Request {
  query = {}

  constructor(requestInit) {
    Object.assign(this, requestInit)
  }
}

export default {
  create: ({ goalsData, onUpdate }) => {
    const funcMap = {
      '/goal': goal,
      '/actgoals': actgoals,
      '/goals': goals,
      '/resultgoals': resultgoals,
      '/timeline': timeline
    }
    const getFuncByPath = (url) => {
      const base = url.split('?')[0]
      return funcMap[base]
    }
    return async (url, requestInit) => {
      const func = getFuncByPath(url)
      const context = { res: {}, log: console.log, bindings: {} }
      func(context, new Request(requestInit), goalsData)
      if (onUpdate) onUpdate(context.bindings.outGoals)
      return new Response(context.res)
    }
  }
}
