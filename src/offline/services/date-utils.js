const defaultLocale = 'en';
let locale = defaultLocale;
const setLocale = (newLocale) => { if(newLocale) locale = newLocale };
const getLocale = () => locale.slice(0, 2);

function plusYears(date, yearsToAdd) {
  let newDate = new Date(date);
  newDate.setFullYear(date.getFullYear() + yearsToAdd);
  return newDate;
}

function getDatePeriods(today) {
  const dayOfTheWeek = today.getDay();
  const lastDayOfWeek = today.getDate() - dayOfTheWeek + (dayOfTheWeek >= 5 ? 14 : 7);
  const endOfWeek = new Date(today.setDate(lastDayOfWeek));
  endOfWeek.setHours(23, 59, 59, 999);
  
  const localizedWeek = getLocalizedWeek();

  const theFirstDayAfterWeekEnds = new Date(+endOfWeek + 1);
  const month = theFirstDayAfterWeekEnds.getMonth();
  let year = theFirstDayAfterWeekEnds.getFullYear();
  const lastDayOfMonth = new Date(year, theFirstDayAfterWeekEnds.getMonth() + 1, 0, 23, 59, 59, 999); // 0th day of next month is the last day of current month
  const monthName = capitalize(lastDayOfMonth.toLocaleString(locale, {month: 'long'}));

  let endOfQuarterMonth = Math.trunc((month + 4) / 3) * 3 - 1;
  if(endOfQuarterMonth > 11) {
    year++;
    endOfQuarterMonth -= 12;
  }
  let quarterIndex = Math.trunc((endOfQuarterMonth - 1) / 3) % 4 + 1;
  const lastDayOfQuarter = new Date(year, endOfQuarterMonth + 1, 0, 23, 59, 59, 999);
  const quarterName = `${year.toString().slice(2)}Q${quarterIndex}`;

  year+= quarterIndex == 4 ? 1 : 0;
  const lastDayOfYear = new Date(year + 1, 0, 0, 23, 59, 59, 999);
  const yearName = year.toString();
  
  const yearLabelFormatter = new Intl.RelativeTimeFormat(locale, { numeric: 'auto', style: 'long' });

  const output = [
    { title: localizedWeek, end: endOfWeek },
    { title: monthName, end: lastDayOfMonth },
    { title: quarterName, end: lastDayOfQuarter },
    { title: yearName, end: lastDayOfYear }];
  
  [3, 5, 10, 20, 50].forEach(years => {
    output.push({ title: generateYearsLabel(yearLabelFormatter, years), end: plusYears(lastDayOfYear, years - 1) });
  });

  return output;
}

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

function getLocalizedWeek() {
  const weekNames = {'be': 'Тыдзень', 'en': 'Week', 'ru': 'Неделя', 'uk': 'Тиждень'};
  return weekNames[getLocale()] || weekNames[defaultLocale];
}

function generateYearsLabel(yearLabelFormatter, years) {
  const formattedLabel = yearLabelFormatter.format(years, 'year')
  const startIndex = 1;
  const yearLabelParts = formattedLabel.split(' ');
  return yearLabelParts.slice(startIndex, startIndex + 2).join(' ');
}

/**
 * get date between today and specified as a string date, which will be after 1/4 (quarter) of this period
 * @param {string} strEndDate date in a future as a string
 * @param {string} strStartDate start date, if not specified, today is used
 * @returns date as a string in 'YYYY-MM-DD' format
 */
function quarterDate(strEndDate, strStartDate = null) {
  const start = strStartDate ? Date.parse(strStartDate) : Date.now();
  const end = Date.parse(strEndDate);
  const reduced = start + (end - start) / 4;
  return new Date(reduced).toISOString().split('T')[0];
}

module.exports = { getDatePeriods, quarterDate, setLocale };
