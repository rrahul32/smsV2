import { LoginInfo, LoginParams, LogoutParams } from '@/types'
import {
  AddPaymentsProps,
  AddPaymentsResponse,
  AddStudentProps,
  AddStudentResponse,
  GetDueListResponse,
  GetPaymentListResponse,
  GetStudentParams,
  GetStudentPaymentsParams,
  GetStudentPaymentsResponse,
  GetStudentResponse,
  GetStudentsResponse,
  SearchStudentsParams,
  SearchStudentsResponse,
  UpdateStudentParams,
  UpdateStudentResponse
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
      getStudent: (params: GetStudentParams) => Promise<GetStudentResponse>
      updateStudent: (params: UpdateStudentParams) => Promise<UpdateStudentResponse>
      getPaymentList: () => Promise<GetPaymentListResponse>
      getDueList: () => Promise<GetDueListResponse>
    }
  }
}
