import { GetPaymentsDbParams, GetPaymentsDbResponse, Payment } from '@shared/types'
import mongoose from 'mongoose'
import { getPaymentsQuery } from './query'
import { paymentsSchema } from './schema'
export class PaymentsDbService {
  private db = mongoose.model<Payment>('Payments', paymentsSchema)

  getPayments(params: GetPaymentsDbParams): Promise<GetPaymentsDbResponse> {
    const query = getPaymentsQuery(params)
    return this.db
      .aggregate<GetPaymentsDbResponse>(query)
      .exec()
      .then((res) => {
        if (res && res.length) {
          return res[0]
        } else {
          return {
            count: 0,
            totalCount: 0,
            list: [],
            totalFeesPaid: 0,
            totalMiscPaid: 0
          }
        }
      })
  }

  async addPayments(payments: Omit<Payment, 'createdAt' | '_id'>[]): Promise<Payment[]> {
    if (payments && payments.length) {
      const result = await Promise.all(
        payments.map(async (payment) => {
          const record = new this.db(payment)
          return (await record.save()).toJSON()
        })
      )
      return result
    } else {
      return []
    }
  }
}
