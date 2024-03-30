import { PaymentsDbService } from '@lib/db'
import {
  AddPaymentProps,
  AddPaymentResponse,
  AddPaymentsProps,
  AddPaymentsResponse,
  GetPaymentListParams,
  GetPaymentListResponse,
  GetStudentPaymentsParams,
  GetStudentPaymentsResponse
} from '@shared/types'
export class PaymentsService {
  private paymentsDb = new PaymentsDbService()

  async getPaymentList(params: GetPaymentListParams): Promise<GetPaymentListResponse> {
    try {
      const limit = params.limit ?? 10
      const skip = params.page ? params.page * limit : 0
      const result = await this.paymentsDb.getPayments({
        filter: params.filter,
        limit,
        skip,
        sort: params.sort,
        studentDetails: true
      })
      return {
        result
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
      const limit = params.limit ?? 10
      const skip = params.page ? limit * params.page : 0
      const result = await this.paymentsDb.getPayments({
        filter: {
          studentIds: [params.studentId]
        },
        limit,
        skip
      })
      return {
        result
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

  async addPayment(params: AddPaymentProps): Promise<AddPaymentResponse> {
    try {
      const result = await this.paymentsDb.addPayments([params.payment])
      return {
        result: result.length > 0
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
    try {
      const list = await this.paymentsDb.addPayments(params.payments)
      if (list && list.length) {
        return { result: { list } }
      } else {
        return {
          error: {
            displayMessage: 'Unable to add payments'
          }
        }
      }
    } catch (e) {
      console.log('🚀 ~ PaymentsService ~ addPayment ~ e:', e)
      return {
        error: {
          displayMessage: 'Unable to add payments',
          reason: e instanceof Error ? e.message : undefined
        }
      }
    }
  }
}
