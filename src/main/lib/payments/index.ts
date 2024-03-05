import { PaymentTypes } from '@shared/constants'
import { Payments, Students } from '@shared/realm'
import {
  AddPaymentProps,
  AddPaymentResponse,
  AddPaymentsProps,
  AddPaymentsResponse,
  GetPaymentListResponse,
  GetStudentPaymentsParams,
  GetStudentPaymentsResponse,
  Payment,
  Student
} from '@shared/types'
import { Database } from '../realm'
export class PaymentsService {
  private db: Database

  constructor(db: Database) {
    this.db = db
  }

  async getPaymentList(): Promise<GetPaymentListResponse> {
    try {
      const payments = this.db.getObjects<Payments>(Payments.schema.name)?.toJSON() as Payment[]
      const students = this.db.getObjects<Students>(Students.schema.name)?.toJSON() as Student[]

      const list = payments.length
        ? payments.map((eachPayment) => {
            return {
              ...eachPayment,
              student: students.find((student) => student._id === eachPayment.studentId) as Student
            }
          })
        : []
      return {
        result: {
          list
        }
      }
    } catch (e) {
      console.log('🚀 ~ PaymentsService ~ getPaymentList ~ e:', e)
      return {
        error: {
          displayMessage: 'Unable to get payments',
          reason: e instanceof Error ? e.message : undefined
        }
      }
    }
  }

  async getStudentPayments(params: GetStudentPaymentsParams): Promise<GetStudentPaymentsResponse> {
    try {
      const list =
        (this.db
          .getObjects<Payments>(Payments.schema.name)
          ?.filtered('studentId == $0', params.studentId)
          .toJSON() as Array<Payment>) ?? []
      let totalMiscPaid = 0
      let totalFeesPaid = 0
      list.map((item) => {
        if (item.type === PaymentTypes.misc) {
          totalMiscPaid += item.amount
        }
        if (item.type === PaymentTypes.fees) {
          totalFeesPaid += item.amount
        }
      })
      return {
        result: {
          list,
          totalFeesPaid,
          totalMiscPaid
        }
      }
    } catch (e) {
      console.log('🚀 ~ StudentsService ~ getStudentPayments ~ e:', e)
      return {
        error: {
          displayMessage: 'Unable to get students',
          reason: e instanceof Error ? e.message : undefined
        }
      }
    }
  }

  async addPayment(payment: AddPaymentProps): Promise<AddPaymentResponse> {
    if (!Object.values(PaymentTypes).includes(payment.type)) {
      return {
        error: {
          displayMessage: 'Selected payment type is not valid'
        }
      }
    }
    try {
      this.db.addObject<Payments, Payment>(Payments.schema.name, payment)
      return {
        result: true
      }
    } catch (e) {
      console.log('🚀 ~ PaymentsService ~ addPayment ~ e:', e)
      return {
        error: {
          displayMessage: 'Unable to add payment',
          reason: e instanceof Error ? e.message : undefined
        }
      }
    }
  }
  async addPayments(params: AddPaymentsProps): Promise<AddPaymentsResponse> {
    let res: AddPaymentsResponse = {}
    const payments = params.payments.map((eachPayment) => {
      if (!Object.values(PaymentTypes).includes(eachPayment.type)) {
        res = {
          error: {
            displayMessage: 'Selected payment type is not valid'
          }
        }
      }
      return {
        studentId: params.studentId,
        type: eachPayment.type,
        amount: eachPayment.amount
      }
    })
    if (!res.error) {
      try {
        const list = this.db.addObjects<Payments, Payment>(Payments.schema.name, payments)
        if (list && list.length) {
          res = { result: { list } }
        } else {
          res = {
            error: {
              displayMessage: 'Unable to add payments'
            }
          }
        }
      } catch (e) {
        console.log('🚀 ~ PaymentsService ~ addPayment ~ e:', e)
        res = {
          error: {
            displayMessage: 'Unable to add payments',
            reason: e instanceof Error ? e.message : undefined
          }
        }
      }
    } else {
      res = {
        error: {
          displayMessage: 'Unable to add payments'
        }
      }
    }
    return res
  }
}
