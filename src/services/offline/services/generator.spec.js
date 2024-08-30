import Generator from './generator'

describe('getNewId', () => {
  it('differs each time', () => {
    let prevId = Generator.getNewId()
    for (let i = 0; i < 10; i++) {
      let id = Generator.getNewId()
      expect(id).not.toEqual(prevId)
      prevId = id
    }
  })
})
