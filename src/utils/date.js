function parseDateISOString (string) {
  // If no string, or format doesnt fit YYYY-MM-DD, return `Date(NaN)`
  if (typeof string !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(string)) return new Date(NaN);
  // https://stackoverflow.com/a/42626876
  const date = string.split(/\D+/).map(digit => parseInt(digit)).slice(0, 6);
  date[1] = date[1] - 1; // adjust month
  return new Date(...date);
}

function maybeDate (maybe) {
  const date = parseDateISOString(maybe);
  return isNaN(date) ? maybe : date;
}

export {
  maybeDate,
  parseDateISOString,
}
