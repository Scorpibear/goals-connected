import path from 'path'

class Response {
  body
  status

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

export default {
  create: ({ base, goalsData, onBindingsUpdate }) => {
    const funcMap = {}
    const getFuncByPath = (url) => {
      if (!funcMap[url]) {
        const fullPath = path.join(base, url, 'index.js')
        console.debug('fullPath: ' + fullPath)
        funcMap[url] = import(fullPath)
      }
      return funcMap[url]
    }
    return async (url, req) => {
      const urlObject = new URL(url, base)
      const func = getFuncByPath(urlObject.path)
      const context = { res: {}, log: console.log, bindings: {} }
      console.debug('FetchLocal: url, req, goalsData, func: ', url, req, goalsData, func)
      func(context, req, goalsData)
      if (onUpdate) onUpdate(context.bindings.outGoals)
      return new Response(context.res)
    }
  }
}
