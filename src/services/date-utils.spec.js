import { formatDate, setLocale } from './date-utils'
import { vi } from 'vitest'

describe('formatDate', () => {
  beforeAll(() => {
    vi.useFakeTimers('modern')
    setLocale('ru')
  })
  it('shows only date and month without year if it is the current year', () => {
    vi.setSystemTime(Date.parse('2024-06-09'))
    const str = formatDate('2024-06-09')
    expect(str).toEqual('9 июня')
  })
  it('shows the year if it is not current', () => {
    vi.setSystemTime(Date.parse('2024-06-09'))
    const str = formatDate('2048-12-31')
    expect(str).toEqual('31 декабря 2048 г.')
  })
  afterAll(() => {
    vi.useRealTimers()
  })
})
