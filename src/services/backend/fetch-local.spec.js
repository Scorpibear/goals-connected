import { default as FetchLocal, Request, Response } from './fetch-local'

describe('fetchLocal', () => {
  const goalsData = {
    goals: [
      {
        id: '12-34-56',
        title: 'Be happy',
        type: 0,
        children: [
          {
            id: 'e12072c2-39af-451b-be64-e50e4a1b1550',
            title: 'оказываю позитивное влияние',
            type: 0,
            children: [
              {
                id: 'f27d50c7-4a85-47a2-a479-bdbd2cf8ca07',
                title: '12 push-ups',
                type: 1
              }
            ]
          },
          {
            id: '2024-03-15 08:47:00.000:0000',
            title: 'To have 1 billion of dollars',
            type: 1,
            date: '2030',
            tags: ['family'],
            children: [
              {
                id: '8e83fcd6-3a31-48fb-bee8-778ba026cfeb',
                title: 'Find a job',
                date: '2024-05-04',
                type: 1
              }
            ]
          }
        ]
      }
    ],
    types: [
      {
        title: 'State'
      },
      {
        title: 'Result'
      },
      {
        title: 'Action'
      }
    ]
  }
  it('resolves with local data', async () => {
    const fetch = FetchLocal.create({ goalsData })
    const response = await fetch('/goals')
    const output = await response.json()
    expect(output).toEqual(goalsData.goals)
  })
  it('calls onUpdate with updated goals', async () => {
    const onUpdate = vi.fn()
    const fetch = FetchLocal.create({ goalsData, onUpdate })
    await fetch('/goal?id=12-34-56', {
      method: 'PUT',
      body: JSON.stringify({ title: 'Be happy!' })
    })
    expect(onUpdate).toHaveBeenCalledWith(goalsData)
  })
})

describe('Response', () => {
  it('text() returns text representation of body', async () => {
    const res = new Response({ body: 'Good' })
    expect(await res.text()).toEqual('Good')
  })
  it('json() returns json representation of body', async () => {
    const res = new Response({ body: '{"a": 42}' })
    expect(await res.json()).toEqual({ a: 42 })
  })
  it('body returns parsed body', async () => {
    const res = new Response({ body: '{"a": 42}' })
    expect(res.body).toEqual({ a: 42 })
  })
  it('body returns unparsed body', async () => {
    const res = new Response({ body: { a: 42 } })
    expect(res.body).toEqual({ a: 42 })
  })
  it('body could be string text, not object', async () => {
    const res = new Response({ body: 'Good' })
    expect(res.body).toEqual('Good')
  })
})

describe('Request', () => {
  it('parses url and requestInit', async () => {
    const req = new Request('/goals?code=42', { method: 'POST' })
    expect(req.path).toEqual('/goals')
    expect(req.query).toEqual({ code: '42' })
    expect(req.method).toEqual('POST')
  })
  it('parses body', async () => {
    const req = new Request('/goals', { body: JSON.stringify({ a: 42 }) })
    expect(req.body).toEqual({ a: 42 })
  })
})
