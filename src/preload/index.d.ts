import { LoginInfo, LoginParams, LogoutParams } from '@/types'
import {
  AddPaymentsProps,
  AddPaymentsResponse,
  AddStudentProps,
  AddStudentResponse,
  GetStudentPaymentsParams,
  GetStudentPaymentsResponse,
  GetStudentsResponse,
  SearchStudentsParams,
  SearchStudentsResponse
} from '@shared/types'

declare global {
  interface Window {
    context: {
      reconnect: () => Promise<boolean>
      login: (params: LoginParams) => Promise<LoginInfo | boolean>
      logout: (params: LogoutParams) => Promise<boolean>
      addStudent: (params: AddStudentProps) => Promise<AddStudentResponse>
      getStudents: () => Promise<GetStudentsResponse>
      searchStudents: (params: SearchStudentsParams) => Promise<SearchStudentsResponse>
      getStudentPayments: (params: GetStudentPaymentsParams) => Promise<GetStudentPaymentsResponse>
      addPayments: (params: AddPaymentsProps) => Promise<AddPaymentsResponse>
    }
  }
}
