import { getAcademicYear } from '@shared/utils'
import clsx, { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...args: ClassValue[]) => {
  return twMerge(clsx(args))
}

export const calculateGrandTotal = (
  admissionFee,
  tuitionFee,
  conveyanceFee,
  booksTotal,
  uniformTotal,
  joinedFrom,
  academicYear: number,
  currentMonth?: number
) => {
  if (currentMonth) {
    const currentYear = getAcademicYear()
    if (currentYear !== academicYear) {
      return 0
    }
  }
  const lastMonth = currentMonth ? currentMonth + 1 : 3
  const monthsToAcademicEnd =
    joinedFrom < lastMonth ? lastMonth - joinedFrom : 12 + lastMonth - joinedFrom

  return (
    admissionFee + (tuitionFee + conveyanceFee) * monthsToAcademicEnd + booksTotal + uniformTotal
  )
}
