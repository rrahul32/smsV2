import { Classes, Sections } from '@shared/constants'

type FieldType<T> = {
  value: T
  error: boolean
  errorMessage: string
}

export type AddStudentFormValuesType = {
  name: FieldType<string>
  class: FieldType<Classes>
  section: FieldType<Sections>
  fatherName: FieldType<string>
  contactNumber: FieldType<string>
  admissionFee: FieldType<string>
  tuitionFee: FieldType<string>
  conveyanceFee: FieldType<string>
  books: FieldType<string>
  uniform: FieldType<string>
  joinedFrom: FieldType<number>
}
