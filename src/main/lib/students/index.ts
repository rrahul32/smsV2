import { Classes, Months, Sections, phoneNumberRegex } from '@shared/constants'
import { Students } from '@shared/realm'
import {
  AddStudentProps,
  AddStudentResponse,
  GetDueListResponse,
  GetStudentParams,
  GetStudentResponse,
  GetStudentsResponse,
  SearchStudentsParams,
  SearchStudentsResponse,
  ServerError,
  Student,
  UpdateStudentParams,
  UpdateStudentResponse
} from '@shared/types'
import { PaymentsService } from '../payments'
import { Database } from '../realm'
export class StudentsService {
  private db: Database
  private paymentService: PaymentsService

  constructor(db: Database) {
    this.db = db
    this.paymentService = new PaymentsService(db)
  }

  async getStudents(): Promise<GetStudentsResponse> {
    try {
      const list: Student[] =
        (this.db.getObjects<Students>(Students.schema.name)?.toJSON() as Array<Student>) ?? []
      const totalCount = list.length ?? 0
      return {
        result: {
          list,
          totalCount
        }
      }
    } catch (e) {
      console.log('🚀 ~ StudentsService ~ addStudent ~ e:', e)
      return {
        error: {
          displayMessage: 'Unable to get students',
          reason: e instanceof Error ? e.message : undefined
        }
      }
    }
  }

  async searchStudents({ searchText }: SearchStudentsParams): Promise<SearchStudentsResponse> {
    try {
      const list: Student[] =
        (this.db
          .getObjects<Students>(Students.schema.name)
          ?.filtered('name TEXT $0', `*${searchText}*`)
          .toJSON() as Array<Student>) ?? []
      return {
        result: {
          list: list.length > 5 ? list.slice(0, 5) : list
        }
      }
    } catch (e) {
      console.log('🚀 ~ StudentsService ~ addStudent ~ e:', e)
      return {
        error: {
          displayMessage: 'Unable to get students',
          reason: e instanceof Error ? e.message : undefined
        }
      }
    }
  }

  async getStudent({ id }: GetStudentParams): Promise<GetStudentResponse> {
    try {
      const student = (
        this.db.getObjects<Students>(Students.schema.name)?.toJSON() as Array<Student>
      ).find((student) => student._id === id)
      if (student) {
        return {
          result: student
        }
      } else {
        return {
          error: {
            displayMessage: 'Student not found'
          }
        }
      }
    } catch (e) {
      console.log('🚀 ~ StudentsService ~ addStudent ~ e:', e)
      return {
        error: {
          displayMessage: 'Unable to get students',
          reason: e instanceof Error ? e.message : undefined
        }
      }
    }
  }

  async addStudent(student: AddStudentProps): Promise<AddStudentResponse> {
    if (!Object.values(Classes).includes(student.class)) {
      return {
        error: {
          displayMessage: 'Selected class is not valid'
        }
      }
    }
    if (!Object.values(Sections).includes(student.section)) {
      return {
        error: {
          displayMessage: 'Selected section is not valid'
        }
      }
    }
    if (!Months[student.joinedFrom]) {
      return {
        error: {
          displayMessage: 'Selected joined from month is not valid'
        }
      }
    }
    if (!phoneNumberRegex.test(String(student.phone))) {
      return {
        error: {
          displayMessage: 'Contact number is not valid'
        }
      }
    }
    try {
      this.db.addObject<Students, Student>(Students.schema.name, student)
      return {
        result: true
      }
    } catch (e) {
      console.log('🚀 ~ StudentsService ~ addStudent ~ e:', e)
      return {
        error: {
          displayMessage: 'Unable to add student',
          reason: e instanceof Error ? e.message : undefined
        }
      }
    }
  }

  async updateStudent(params: UpdateStudentParams): Promise<UpdateStudentResponse> {
    const student = params.details
    const id = params.id
    if (!Object.values(Classes).includes(student.class)) {
      return {
        error: {
          displayMessage: 'Selected class is not valid'
        }
      }
    }
    if (!Object.values(Sections).includes(student.section)) {
      return {
        error: {
          displayMessage: 'Selected section is not valid'
        }
      }
    }
    if (!Months[student.joinedFrom]) {
      return {
        error: {
          displayMessage: 'Selected joined from month is not valid'
        }
      }
    }
    if (!phoneNumberRegex.test(String(student.phone))) {
      return {
        error: {
          displayMessage: 'Contact number is not valid'
        }
      }
    }
    try {
      const updated = this.db.updateObject<Students>(Students.schema.name, id, student)
      if (updated) {
        return {
          result: true
        }
      } else {
        return {
          error: {
            displayMessage: 'Unable to update student'
          }
        }
      }
    } catch (e) {
      console.log('🚀 ~ StudentsService ~ update Student ~ e:', e)
      return {
        error: {
          displayMessage: 'Unable to update student',
          reason: e instanceof Error ? e.message : undefined
        }
      }
    }
  }

  async getDueList(): Promise<GetDueListResponse> {
    try {
      const students = this.db.getObjects<Students>(Students.schema.name)?.toJSON() as Student[]
      if (!students) {
        return {
          error: {
            displayMessage: 'Unable to fetch students'
          }
        }
      }
      const list = students.length
        ? await Promise.all(
            students.map(async (student) => {
              const { totalMiscPaid, totalFeesPaid } = await this.paymentService
                .getStudentPayments({
                  studentId: student._id
                })
                .then((res) => {
                  if (res.error) {
                    throw res.error
                  }
                  return {
                    totalFeesPaid: res.result?.totalFeesPaid ?? 0,
                    totalMiscPaid: res.result?.totalMiscPaid ?? 0
                  }
                })
              const totalMisc = student.booksTotal + student.uniformTotal

              const currentMonth = new Date().getMonth() + 1
              const monthsToAcademicEnd =
                student.joinedFrom < currentMonth
                  ? currentMonth - student.joinedFrom
                  : 12 + currentMonth - student.joinedFrom

              const totalFees =
                student.admissionFee +
                (student.tuitionFee + student.conveyanceFee) * monthsToAcademicEnd
              const totalMiscDue = totalMisc - totalMiscPaid
              const totalFeesDue = totalFees - totalFeesPaid > 0 ? totalFees - totalFeesPaid : 0
              const totalDue = totalMiscDue + totalFeesDue
              return {
                ...student,
                totalMiscDue,
                totalFeesDue,
                totalDue
              }
            })
          )
        : []
      return {
        result: {
          list: list.filter((item) => item.totalDue)
        }
      }
    } catch (e) {
      console.log('🚀 ~ StudentsService ~ getDueList ~ e:', e)
      const error = e as ServerError | Error
      return {
        error: {
          displayMessage: error instanceof Error ? error.message : error.displayMessage,
          reason: error instanceof Error ? error.message : error.reason
        }
      }
    }
  }
}
