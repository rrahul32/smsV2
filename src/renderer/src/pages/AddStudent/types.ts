type FieldType<T> = {
  value: T
  error: boolean
  errorMessage: string
}

export type AddStudentFormValuesType = {
  name: FieldType<string | null>
  class: FieldType<string | null>
  section: FieldType<string | null>
  fatherName: FieldType<string | null>
  contactNumber: FieldType<string | null>
  admissionFee: FieldType<string | null>
  tuitionFee: FieldType<string | null>
  conveyanceFee: FieldType<string | null>
  books: FieldType<string | null>
  uniform: FieldType<string | null>
  joinedFrom: FieldType<number>
}
