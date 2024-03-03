import { AddStudentProps } from '@shared/types'

export const addStudent = (params: AddStudentProps) => {
  return window.context.addStudent(params)
}

export const getStudents = () => {
  return window.context.getStudents()
}
