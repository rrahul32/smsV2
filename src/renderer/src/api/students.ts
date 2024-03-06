import { AddStudentProps, SearchStudentsParams } from '@shared/types'

export const addStudent = (params: AddStudentProps) => {
  return window.context.addStudent(params)
}

export const getStudents = () => {
  return window.context.getStudents()
}

export const searchStudents = (params: SearchStudentsParams) => {
  return window.context.searchStudents(params)
}

export const getDueList = window.context.getDueList
export const getStudent = window.context.getStudent
