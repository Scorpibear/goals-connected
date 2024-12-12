export default class Generator {
  static lastId = ''
  static getNewId() {
    let newId
    let count = 0
    do {
      newId = new Date().toISOString().replace('T', '@').replace('Z', count)
      count++
    } while (newId == Generator.lastId)
    Generator.lastId = newId
    return newId
  }
}
