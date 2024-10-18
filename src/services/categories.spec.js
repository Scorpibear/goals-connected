import { flatCategories } from './categories'

describe('categories', () => {
  describe('flatCategories', () => {
    it('does not contain empty', () => {
      console.debug(flatCategories)
      flatCategories.forEach((element) => {
        expect(element.title).toBeDefined()
      })
    })
  })
})
