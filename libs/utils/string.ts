export const toFormattedString = (value: unknown) => {
  if (typeof value === 'object') {
    return JSON.stringify(value)
  }

  return String(value)
}
