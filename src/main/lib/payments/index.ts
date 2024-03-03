import { PaymentTypes } from '@shared/constants'
import { Payments } from '@shared/realm'
import { AddPaymentProps, AddPaymentResponse } from '@shared/types/payments.type'
import { Database } from '../realm'
export class PaymentsService {
  private db: Database

  constructor(db: Database) {
    this.db = db
  }

  async getPaymentDetails() {
    try {
      const res = null
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

  async addPayment(payment: AddPaymentProps): Promise<AddPaymentResponse> {
    if (!Object.values(PaymentTypes).includes(payment.type)) {
      return {
        error: {
          displayMessage: 'Selected payment type is not valid'
        }
      }
    }
    try {
      this.db.addObjects<Payments>(Payments.schema.name, payment)
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
}
