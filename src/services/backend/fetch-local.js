import path from 'path'

export default {
  create: ({ base, goalsData }) => {
    const funcMap = {}
    const getFuncByPath = (url) => {
      if (!funcMap[url]) {
        const fullPath = path.join(base, url)
        funcMap[url] = require(fullPath)
      }
      return funcMap[url]
    }
    return async (url, req) => {
      const func = getFuncByPath(url)
      const context = { res: {}, log: console.log }
      func(context, req, goalsData)
      return context.res.body
    }
  }
}
