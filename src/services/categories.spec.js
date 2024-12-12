import { flatCategories, findBestTimelineCategory } from './categories'

describe('categories', () => {
  describe('flatCategories', () => {
    it('does not contain empty', () => {
      flatCategories.forEach((element) => {
        expect(element.title).toBeDefined()
      })
    })
  })
  describe('findBestTimelineCategory', () => {
    it('works for sub-items', () => {
      const category = findBestTimelineCategory(['хобби', 'Путь 3kGM'])
      expect(category).toEqual('Мастер Жизни')
    })
    it('works for another case', () => {
      console.debug('TEST')
      const category = findBestTimelineCategory(['Путь Отца'])
      expect(category).toEqual('Отец')
    })
    it('return undefined if tags are absent', () => {
      const category = findBestTimelineCategory()
      expect(category).toBeUndefined()
    })
  })
})
