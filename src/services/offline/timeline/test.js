import getTimeline from './index'
import { vi } from 'vitest'

describe('getTimeline', () => {
  let context = {}
  let req = {}
  beforeAll(() => {
    vi.useFakeTimers('modern')
  })
  it('returns goals for this week', async () => {
    vi.setSystemTime(Date.parse('2024-06-11'))
    let data = {
      goals: [{ title: 'the goal', targetDate: '2024-06-12' }]
    }
    await getTimeline(context, req, data)
    expect(JSON.parse(context.res.body)).toEqual([
      { title: 'Week', end: '2024-06-16T20:59:59.999Z', goals: data.goals }
    ])
  })
  it('returns goals for this month', async () => {
    vi.setSystemTime(Date.parse('2024-06-03'))
    let data = {
      goals: [
        { title: 'the week goal', targetDate: '2024-06-07' },
        { title: 'the month goal', targetDate: '2024-06-30' }
      ]
    }
    await getTimeline(context, req, data)
    expect(context.res.body).toContain('June')
    expect(JSON.parse(context.res.body)[1]).toEqual({
      title: 'June',
      end: '2024-06-30T20:59:59.999Z',
      goals: [{ title: 'the month goal', targetDate: '2024-06-30' }]
    })
  })
  it('uses next month if the week includes the last day of the month', async () => {
    vi.setSystemTime(Date.parse('2024-05-30'))
    let data = {
      goals: [
        { title: 'the week goal', targetDate: '2024-05-31' },
        { title: 'the month goal', targetDate: '2024-06-30' }
      ]
    }
    await getTimeline(context, req, data)
    expect(JSON.parse(context.res.body)[1]).toEqual({
      title: 'June',
      end: '2024-06-30T20:59:59.999Z',
      goals: [{ title: 'the month goal', targetDate: '2024-06-30' }]
    })
  })
  it('show quarter goals', async () => {
    vi.setSystemTime(Date.parse('2024-05-30'))
    let data = {
      goals: [
        { title: 'the week goal', targetDate: '2024-05-31' },
        { title: 'the month goal', targetDate: '2024-06-30' },
        { title: 'the quarter goal', targetDate: '2024-07-15' }
      ]
    }
    await getTimeline(context, req, data)
    expect(context.res.body).toContain('24Q3')
    expect(context.res.body).toContain('the quarter goal')
  })
  it("result goal without targetDate is included into 'Maybe someday'", async () => {
    let data = { goals: [{ title: 'good goal', type: 1 }] }
    await getTimeline(context, req, data)
    expect(context.res.body).toContain(
      '"title":"Maybe someday","goals":[{"title":"good goal","type":1}]'
    )
  })
  it('creates quarter section', async () => {
    vi.setSystemTime(Date.parse('2024-06-09'))
    let data = { goals: [{ title: 'quarter goal', targetDate: '2024-09-30' }] }

    await getTimeline(context, req, data)

    expect(JSON.parse(context.res.body)[0]).toEqual({
      title: '24Q3',
      end: '2024-09-30T20:59:59.999Z',
      goals: [{ title: 'quarter goal', targetDate: '2024-09-30' }]
    })
  })
  it('provides end property in sections', async () => {
    let data = { goals: [{ title: 'quarter goal', targetDate: '2024-09-30' }] }

    await getTimeline(context, req, data)

    expect(JSON.parse(context.res.body)[0].end).toBeDefined()
  })
  it('returns hierarchy', async () => {
    vi.setSystemTime(Date.parse('2024-08-01'))
    let data = {
      goals: [
        {
          title: 'goal1',
          targetDate: '2024-08-30',
          children: [{ title: 'goal2', targetDate: '2024-08-03' }]
        }
      ]
    }

    await getTimeline(context, req, data)

    expect(context.res.body).toContain('August')
    expect(JSON.parse(context.res.body)[1]).toEqual({
      title: 'August',
      end: '2024-08-31T20:59:59.999Z',
      goals: data.goals
    })
  })
  it('returns localized headers', async () => {
    vi.setSystemTime(Date.parse('2024-08-01'))
    let data = {
      goals: [
        {
          title: 'goal1',
          targetDate: '2024-08-30',
          children: [{ title: 'goal2', targetDate: '2024-08-03' }]
        }
      ]
    }
    req.query = { locale: 'ru' }

    await getTimeline(context, req, data)

    expect(context.res.body).toContain('Август')
  })
  afterAll(() => {
    vi.useRealTimers()
  })
})
