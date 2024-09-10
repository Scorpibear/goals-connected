import FetchLocal from './fetch-local'

describe('fetchLocal', () => {
  const goalsData = {
    goals: [
      {
        id: '986c1013-5dc4-4d64-92e0-1c1c3428eb4a',
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
    const fetch = FetchLocal.create({ base: '../../offline/', goalsData })
    const output = await fetch('../../offline/goal')
    expect(output).toEqual(goalsData.goals)
  })
})
