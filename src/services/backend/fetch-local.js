import actgoals from '@/services/offline/actgoals/index'
import goal from '@/services/offline/goal/index'
import goals from '@/services/offline/goals/index'
import resultgoals from '@/services/offline/resultgoals/index'
import timeline from '@/services/offline/timeline/index'

export class Response {
  _body = ''
  status = 200

  constructor(data) {
    this._body ||= data.body
    this.status ||= data.status
  }

  text() {
    return Promise.resolve(this._body)
  }
  json() {
    return Promise.resolve(JSON.parse(this._body))
  }
  get body() {
    if (typeof this._body === 'object') {
      return this._body
    }
    try {
      return JSON.parse(this._body)
    } catch (e) {
      return this._body
    }
  }
}

export class Request {
  query
  path

  constructor(url, requestInit) {
    Object.assign(this, requestInit)
    const [path, query] = url.split('?')
    this.path = path
    this.query = query?.split('&').reduce((acc, item) => {
      const [key, value] = item.split('=')
      acc[key] = value
      return acc
    }, {})
    if (requestInit?.body) {
      if (typeof requestInit.body === 'object') {
        this.body = requestInit.body
      } else {
        try {
          this.body = JSON.parse(requestInit.body)
        } catch (e) {
          this.body = requestInit.body
        }
      }
    }
  }
}

export default {
  create: ({ goalsData, onUpdate }) => {
    console.debug('FetchLocal create: goalsData: ', goalsData)
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
      func(context, new Request(url, requestInit), goalsData)
      if (onUpdate) onUpdate(context.bindings.outGoals)
      return new Response(context.res)
    }
  }
}
