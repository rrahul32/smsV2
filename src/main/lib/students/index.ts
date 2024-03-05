import { Classes, Months, Sections, phoneNumberRegex } from '@shared/constants'
import { Students } from '@shared/realm'
import {
  AddStudentProps,
  AddStudentResponse,
  GetStudentsResponse,
  SearchStudentsParams,
  SearchStudentsResponse,
  Student
} from '@shared/types'
import { Database } from '../realm'
export class StudentsService {
  private db: Database

  constructor(db: Database) {
    this.db = db
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
      this.db.addObject<Students>(Students.schema.name, student)
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
}
