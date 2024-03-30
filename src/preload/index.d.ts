import { LoginInfo, LoginParams, LogoutParams } from '@/types'
import {
  AddPaymentsProps,
  AddPaymentsResponse,
  AddStudentProps,
  AddStudentResponse,
  GetDueListParams,
  GetDueListResponse,
  GetPaymentListParams,
  GetPaymentListResponse,
  GetStudentParams,
  GetStudentPaymentsParams,
  GetStudentPaymentsResponse,
  GetStudentResponse,
  GetStudentsParams,
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
      getStudents: (params: GetStudentsParams) => Promise<GetStudentsResponse>
      searchStudents: (params: SearchStudentsParams) => Promise<SearchStudentsResponse>
      getStudentPayments: (params: GetStudentPaymentsParams) => Promise<GetStudentPaymentsResponse>
      addPayments: (params: AddPaymentsProps) => Promise<AddPaymentsResponse>
      getStudent: (params: GetStudentParams) => Promise<GetStudentResponse>
      updateStudent: (params: UpdateStudentParams) => Promise<UpdateStudentResponse>
      getPaymentList: (params: GetPaymentListParams) => Promise<GetPaymentListResponse>
      getDueList: (params: GetDueListParams) => Promise<GetDueListResponse>
    }
  }
}
