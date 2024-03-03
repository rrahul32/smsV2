import { LoginInfo, LoginParams, LogoutParams } from '@/types'
import { AddStudentProps, AddStudentResponse, GetStudentsResponse } from '@shared/types'

declare global {
  interface Window {
    context: {
      reconnect: () => Promise<boolean>
      login: (params: LoginParams) => Promise<LoginInfo | boolean>
      logout: (params: LogoutParams) => Promise<boolean>
      addStudent: (params: AddStudentProps) => Promise<AddStudentResponse>
      getStudents: () => Promise<GetStudentsResponse>
    }
  }
}
