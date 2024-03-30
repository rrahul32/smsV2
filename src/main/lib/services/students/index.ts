import { StudentsDbService, UsersDbService } from '@lib/db'
import { Months, phoneNumberRegex } from '@shared/constants'
import {
  AddStudentProps,
  AddStudentResponse,
  GetDueListParams,
  GetDueListResponse,
  GetStudentParams,
  GetStudentResponse,
  GetStudentsParams,
  GetStudentsResponse,
  SearchStudentsParams,
  SearchStudentsResponse,
  ServerError,
  UpdateStudentParams,
  UpdateStudentResponse
} from '@shared/types'
import { getAcademicYear } from '@shared/utils'
export class StudentsService {
  private readonly studentsDb = new StudentsDbService()
  private readonly usersDb = new UsersDbService()
  private getUserAcademicYear(id) {
    return this.usersDb
      .getUserById(id, {
        academicYear: 1
      })
      .then((data) => {
        if (data) {
          return data.academicYear
        } else {
          return getAcademicYear()
        }
      })
      .catch(() => {
        return getAcademicYear()
      })
  }

  async getStudents(params: GetStudentsParams): Promise<GetStudentsResponse> {
    try {
      const academicYear = await this.getUserAcademicYear(params.userId)
      const limit = params.limit ?? 10
      const skip = params.page ? params.page * limit : 0
      const result = await this.studentsDb.getStudents({
        filter: {
          academicYear,
          classes: params.filter?.classes,
          searchText: params.searchText,
          sections: params.filter?.sections
        },
        limit,
        skip
      })
      return {
        result
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

  async searchStudents({
    searchText,
    userId
  }: SearchStudentsParams): Promise<SearchStudentsResponse> {
    return this.getStudents({
      searchText,
      userId,
      limit: 5,
      page: 0
    })
  }

  async getStudent({ id }: GetStudentParams): Promise<GetStudentResponse> {
    try {
      const student = await this.studentsDb.getStudent({
        _id: id
      })
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
          displayMessage: 'Unable to get student',
          reason: e instanceof Error ? e.message : undefined
        }
      }
    }
  }

  async addStudent(params: AddStudentProps): Promise<AddStudentResponse> {
    const academicYear = await this.getUserAcademicYear(params.userId)
    const student = params.details

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
      await this.studentsDb.addStudent({
        ...student,
        academicYear
      })
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
      const updated = await this.studentsDb.updateStudent(params).then((res) => !!res.modifiedCount)
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

  async getDueList(params: GetDueListParams): Promise<GetDueListResponse> {
    try {
      const academicYear = await this.getUserAcademicYear(params.userId)
      const limit = params.limit ?? 10
      const skip = params.page ? params.page * limit : 0
      const result = await this.studentsDb.getDueList({
        filter: {
          academicYear,
          ...(params.filter ?? {})
        },
        limit,
        skip,
        sort: params.sort
      })

      return {
        result
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
