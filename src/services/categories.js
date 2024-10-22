const categoriesTree = [
  {
    title: 'Путь Создателя',
    showOnTimeline: false,
    includes: [
      { title: 'Путь Отца', tags: ['семья'] },
      {
        title: 'Путь Создателя Продуктов',
        includes: [{ title: 'Путь SDET-архитектора', includes: [{ id: 'cpp' }] }]
      },
      { title: 'Путь Блогера' }
    ]
  },
  {
    title: 'Путь Мастера',
    showOnTimeline: false,
    includes: [
      {
        title: 'Путь Мастера Жизни',
        includes: [
          {
            title: 'Путь Мастера Спорта',
            includes: [
              {
                id: 'chess',
                title: 'Путь Шахматиста',
                showOnTimeline: false,
                includes: [{ title: 'Путь 3kGM' }]
              }
            ]
          },
          { title: 'Путь Полиглота' },
          {
            title: 'Путь Мастера Разработки',
            includes: [{ id: 'cpp', title: 'Мастер С++', showOnTimeline: false }]
          },
          { title: 'Путь Инвестора' },
          {
            title: 'Путь Игрока',
            showOnTimeline: false,
            includes: [{ title: 'Путь Покериста', showOnTimeline: false }, { id: 'chess' }]
          }
        ]
      }
    ]
  }
]

const flat = (cats) =>
  cats.flatMap((cat) => (cat.includes?.length ? [cat, ...flat(cat.includes)] : cat))

export const flatCategories = flat(categoriesTree).filter(({ title }) => title)

export const timelineCategories = flatCategories.filter(
  ({ showOnTimeline }) => showOnTimeline === undefined || showOnTimeline === true
)
