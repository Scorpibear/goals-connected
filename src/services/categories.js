const categoriesTree = [
  {
    title: 'Путь Создателя',
    includes: [
      { title: 'Путь Отца', tags: ['семья'] },
      { title: 'Путь Создателя Продуктов', includes: [{ title: 'Путь SDET-архитектора' }] },
      { title: 'Путь Блогера' }
    ]
  },
  {
    title: 'Путь Мастера',
    includes: [
      {
        title: 'Путь Мастера Жизни',
        includes: [
          { title: 'Путь Мастера Спорта', includes: [{ title: 'Путь 3kGM' }] },
          { title: 'Путь Инвестора' },
          { title: 'Путь Мастера Разработки' },
          { title: 'Путь Полиглота' }
        ]
      }
    ]
  }
]

const flat = (cats) =>
  cats.flatMap((cat) => (cat.includes?.length ? [cat, ...flat(cat.includes)] : cat))

export default flat(categoriesTree)
