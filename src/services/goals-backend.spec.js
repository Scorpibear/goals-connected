import { GoalsBackend } from './goals-backend'
import { vi } from 'vitest'

describe('getActGoals', () => {
  const fetchResultStub = Promise.resolve({ json: Promise.resolve({}) })
  it('fetch is used', () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(fetchResultStub)
    let backend = new GoalsBackend()
    backend.getActGoals()
    expect(global.fetch).toHaveBeenCalled()
  })
  afterEach(() => {
    vi.resetAllMocks()
  })
})
describe('getDefaultInstance', () => {
  it('is not null', () => {
    expect(GoalsBackend.getDefaultInstance()).toBeDefined()
  })
  it('returns each type the same instance')
  it('is a GoalsBackend class instance')
})
