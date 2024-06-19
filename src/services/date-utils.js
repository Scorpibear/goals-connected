const defaultLocale = 'ru'
let locale = defaultLocale

export function setLocale(input) {
  locale = input
}

export function formatDate(input) {
  const date = new Date(input)
  // valid options - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#date-time_component_options
  const options = { day: 'numeric', month: 'long' }
  if (date.getFullYear() != new Date().getFullYear()) options.year = 'numeric'
  return new Intl.DateTimeFormat(locale, options).format(date)
}
