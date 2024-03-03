import { Student } from '@shared/types'

export type StudentDetailsProps = {
  open: boolean
  handleClose: () => void
  selectedStudent?: Student
}
