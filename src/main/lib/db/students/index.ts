import {
  GetDueListDbParams,
  GetDueListDbResponse,
  GetStudentsDbParams,
  GetStudentsDbResponse,
  Student,
  UpdateStudentParams
} from '@shared/types'
import mongoose, { FilterQuery, ProjectionType } from 'mongoose'
import { getDueListQuery, getStudentsQuery } from './query'
import { studentsSchema } from './schema'
export class StudentsDbService {
  private db = mongoose.model<Student>('Students', studentsSchema)

  getStudents(params: GetStudentsDbParams): Promise<GetStudentsDbResponse> {
    const query = getStudentsQuery(params)
    return this.db
      .aggregate<GetStudentsDbResponse>(query)
      .exec()
      .then((data) => {
        if (data && data.length) {
          return data[0]
        } else {
          return {
            totalCount: 0,
            count: 0,
            list: []
          }
        }
      })
  }

  getStudent(
    filter: FilterQuery<Student>,
    projection?: ProjectionType<Student>
  ): Promise<Student | null> {
    return this.db.findOne(filter, projection).lean()
  }

  addStudent(details: Omit<Student, '_id' | 'createdAt'>) {
    return new this.db(details).save()
  }

  updateStudent(params: UpdateStudentParams) {
    return this.db
      .updateOne(
        {
          _id: params.id
        },
        {
          $set: {
            ...params.details
          }
        }
      )
      .exec()
  }

  getDueList(params: GetDueListDbParams): Promise<GetDueListDbResponse> {
    const query = getDueListQuery(params)
    return this.db
      .aggregate(query)
      .exec()
      .then((res) => {
        if (res && res.length) {
          return res[0]
        } else {
          return {
            totalCount: 0,
            count: 0,
            list: []
          }
        }
      })
  }

  getStudentsByAcademicYear(academicYear: number, fields?: ProjectionType<Student>) {
    return this.db.find(
      {
        academicYear
      },
      fields
    )
  }
}
