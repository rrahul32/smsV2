export const getAcademicYear = () => {
  const date = new Date()
  const month = date.getMonth()
  const year = date.getFullYear()
  if (month < 3) {
    return year - 1
  }
  return year
}
