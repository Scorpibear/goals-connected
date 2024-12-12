import { getDatePeriods, quarterDate, setLocale } from './date-utils'

describe('getDatePeriods', () => {
  it('adds 3.5 months to last quarter month date', () => {
    const periods = getDatePeriods(new Date('2024-06-09'))
    expect(periods[2]).toEqual({
      title: '24Q3',
      end: new Date('2024-09-30 23:59:59.999')
    })
  })
  it('show current quarter if it is only the first month of it', () => {
    const periods = getDatePeriods(new Date('2024-07-15'))
    expect(periods[2]).toEqual({
      title: '24Q3',
      end: new Date('2024-09-30 23:59:59.999')
    })
  })
  it('creates month period', () => {
    const periods = getDatePeriods(new Date('2024-08-01'))
    expect(periods[1]).toEqual({
      title: 'August',
      end: new Date('2024-08-31 23:59:59.999')
    })
  })
  it('create year period', () => {
    const periods = getDatePeriods(new Date('2024-06-15'))
    expect(periods[3]).toEqual({
      title: '2024',
      end: new Date('2024-12-31 23:59:59.999')
    })
  })
  it('generates quarter name', () => {
    const periods = getDatePeriods(new Date('2023-01-15'))
    expect(periods[2]).toEqual({
      title: '23Q1',
      end: new Date('2023-03-31 23:59:59.999')
    })
  })
  it('calc long-term years by just changing a year, not date', () => {
    const periods = getDatePeriods(new Date('2024-06-23'))
    expect(periods).toEqual([
      { title: 'Week', end: new Date('2024-06-30 23:59:59.999') },
      { title: 'July', end: new Date('2024-07-31 23:59:59.999') },
      { title: '24Q3', end: new Date('2024-09-30 23:59:59.999') },
      { title: '2024', end: new Date('2024-12-31 23:59:59.999') },
      { title: '3 years', end: new Date('2026-12-31 23:59:59.999') },
      { title: '5 years', end: new Date('2028-12-31 23:59:59.999') },
      { title: '10 years', end: new Date('2033-12-31 23:59:59.999') },
      { title: '20 years', end: new Date('2043-12-31 23:59:59.999') },
      { title: '50 years', end: new Date('2073-12-31 23:59:59.999') }
    ])
  })
  it('first day of Q4 periods are correct', () => {
    const periods = getDatePeriods(new Date('2024-10-01'))
    expect(periods).toEqual([
      { title: 'Week', end: new Date('2024-10-06 23:59:59.999') },
      { title: 'October', end: new Date('2024-10-31 23:59:59.999') },
      { title: '24Q4', end: new Date('2024-12-31 23:59:59.999') },
      { title: '2025', end: new Date('2025-12-31 23:59:59.999') },
      { title: '3 years', end: new Date('2027-12-31 23:59:59.999') },
      { title: '5 years', end: new Date('2029-12-31 23:59:59.999') },
      { title: '10 years', end: new Date('2034-12-31 23:59:59.999') },
      { title: '20 years', end: new Date('2044-12-31 23:59:59.999') },
      { title: '50 years', end: new Date('2074-12-31 23:59:59.999') }
    ])
  })
  it('calc for September 23', () => {
    const periods = getDatePeriods(new Date('2024-09-23'))
    expect(periods).toEqual([
      { title: 'Week', end: new Date('2024-09-29 23:59:59.999') },
      { title: 'September', end: new Date('2024-09-30 23:59:59.999') },
      { title: '24Q4', end: new Date('2024-12-31 23:59:59.999') },
      { title: '2025', end: new Date('2025-12-31 23:59:59.999') },
      { title: '3 years', end: new Date('2027-12-31 23:59:59.999') },
      { title: '5 years', end: new Date('2029-12-31 23:59:59.999') },
      { title: '10 years', end: new Date('2034-12-31 23:59:59.999') },
      { title: '20 years', end: new Date('2044-12-31 23:59:59.999') },
      { title: '50 years', end: new Date('2074-12-31 23:59:59.999') }
    ])
  })
  it('calc for September 30', () => {
    const periods = getDatePeriods(new Date('2024-09-30'))
    expect(periods).toEqual([
      { title: 'Week', end: new Date('2024-10-06 23:59:59.999') },
      { title: 'October', end: new Date('2024-10-31 23:59:59.999') },
      { title: '24Q4', end: new Date('2024-12-31 23:59:59.999') },
      { title: '2025', end: new Date('2025-12-31 23:59:59.999') },
      { title: '3 years', end: new Date('2027-12-31 23:59:59.999') },
      { title: '5 years', end: new Date('2029-12-31 23:59:59.999') },
      { title: '10 years', end: new Date('2034-12-31 23:59:59.999') },
      { title: '20 years', end: new Date('2044-12-31 23:59:59.999') },
      { title: '50 years', end: new Date('2074-12-31 23:59:59.999') }
    ])
  })
  it('calc for August 25', () => {
    const periods = getDatePeriods(new Date('2024-08-25'))
    expect(periods).toEqual([
      { title: 'Week', end: new Date('2024-09-01 23:59:59.999') },
      { title: 'September', end: new Date('2024-09-30 23:59:59.999') },
      { title: '24Q4', end: new Date('2024-12-31 23:59:59.999') },
      { title: '2025', end: new Date('2025-12-31 23:59:59.999') },
      { title: '3 years', end: new Date('2027-12-31 23:59:59.999') },
      { title: '5 years', end: new Date('2029-12-31 23:59:59.999') },
      { title: '10 years', end: new Date('2034-12-31 23:59:59.999') },
      { title: '20 years', end: new Date('2044-12-31 23:59:59.999') },
      { title: '50 years', end: new Date('2074-12-31 23:59:59.999') }
    ])
  })
  it('calc for August 16', () => {
    const periods = getDatePeriods(new Date('2024-08-16'))
    expect(periods).toEqual([
      { title: 'Week', end: new Date('2024-08-25 23:59:59.999') },
      { title: 'August', end: new Date('2024-08-31 23:59:59.999') },
      { title: '24Q3', end: new Date('2024-09-30 23:59:59.999') },
      { title: '2024', end: new Date('2024-12-31 23:59:59.999') },
      { title: '3 years', end: new Date('2026-12-31 23:59:59.999') },
      { title: '5 years', end: new Date('2028-12-31 23:59:59.999') },
      { title: '10 years', end: new Date('2033-12-31 23:59:59.999') },
      { title: '20 years', end: new Date('2043-12-31 23:59:59.999') },
      { title: '50 years', end: new Date('2073-12-31 23:59:59.999') }
    ])
  })
  it('calc for December 25', () => {
    const periods = getDatePeriods(new Date('2024-12-25'))
    expect(periods).toEqual([
      { title: 'Week', end: new Date('2024-12-29 23:59:59.999') },
      { title: 'December', end: new Date('2024-12-31 23:59:59.999') },
      { title: '25Q1', end: new Date('2025-03-31 23:59:59.999') },
      { title: '2025', end: new Date('2025-12-31 23:59:59.999') },
      { title: '3 years', end: new Date('2027-12-31 23:59:59.999') },
      { title: '5 years', end: new Date('2029-12-31 23:59:59.999') },
      { title: '10 years', end: new Date('2034-12-31 23:59:59.999') },
      { title: '20 years', end: new Date('2044-12-31 23:59:59.999') },
      { title: '50 years', end: new Date('2074-12-31 23:59:59.999') }
    ])
  })
  it('calc for December 31', () => {
    const periods = getDatePeriods(new Date('2024-12-31'))
    expect(periods).toEqual([
      { title: 'Week', end: new Date('2025-01-05 23:59:59.999') },
      { title: 'January', end: new Date('2025-01-31 23:59:59.999') },
      { title: '25Q1', end: new Date('2025-03-31 23:59:59.999') },
      { title: '2025', end: new Date('2025-12-31 23:59:59.999') },
      { title: '3 years', end: new Date('2027-12-31 23:59:59.999') },
      { title: '5 years', end: new Date('2029-12-31 23:59:59.999') },
      { title: '10 years', end: new Date('2034-12-31 23:59:59.999') },
      { title: '20 years', end: new Date('2044-12-31 23:59:59.999') },
      { title: '50 years', end: new Date('2074-12-31 23:59:59.999') }
    ])
  })
  it('calc for January 1st', () => {
    const periods = getDatePeriods(new Date('2025-01-01'))
    expect(periods).toEqual([
      { title: 'Week', end: new Date('2025-01-05 23:59:59.999') },
      { title: 'January', end: new Date('2025-01-31 23:59:59.999') },
      { title: '25Q1', end: new Date('2025-03-31 23:59:59.999') },
      { title: '2025', end: new Date('2025-12-31 23:59:59.999') },
      { title: '3 years', end: new Date('2027-12-31 23:59:59.999') },
      { title: '5 years', end: new Date('2029-12-31 23:59:59.999') },
      { title: '10 years', end: new Date('2034-12-31 23:59:59.999') },
      { title: '20 years', end: new Date('2044-12-31 23:59:59.999') },
      { title: '50 years', end: new Date('2074-12-31 23:59:59.999') }
    ])
  })
  it("on the second half of Friday I would like to see goals for the next week in 'Week' section", () => {
    const periods = getDatePeriods(new Date('2024-07-05 16:00'))
    expect(periods[0].end).toEqual(new Date('2024-07-14 23:59:59.999'))
  })
  it('show localized month name', () => {
    setLocale('ru')
    const periods = getDatePeriods(new Date('2024-07-05'))
    expect(periods[1].title).toEqual('Июль')
  })
  it('show localized names for ru-RU', () => {
    setLocale('ru-RU')
    const periods = getDatePeriods(new Date('2024-07-05'))
    expect(periods[0].title).toEqual('Неделя')
    expect(periods[1].title).toEqual('Июль')
    expect(periods[4].title).toEqual('3 года')
    expect(periods[5].title).toEqual('5 лет')
  })
  it('localization for uk works', () => {
    setLocale('uk')
    const periods = getDatePeriods(new Date('2024-07-05'))
    expect(periods[0].title).toEqual('Тиждень')
    expect(periods[1].title).toEqual('Липень')
    expect(periods[4].title).toEqual('3 роки')
  })
  it('localization to be works', () => {
    setLocale('be')
    const periods = getDatePeriods(new Date('2024-07-05'))
    expect(periods[0].title).toEqual('Тыдзень')
    expect(periods[1].title).toEqual('Ліпень')
    expect(periods[4].title).toEqual('3 гады')
  })
})

describe('quarterDate', () => {
  it('cuts the distance between today and provided date as a string and returns as a string', () => {
    expect(quarterDate('2024-07-31', '2024-07-01')).toEqual('2024-07-08')
  })
})
