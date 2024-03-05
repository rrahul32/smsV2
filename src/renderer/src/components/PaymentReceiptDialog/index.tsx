import { Close as CloseIcon, Print as PrintIcon } from '@mui/icons-material'
import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material'
import { Payment, Student } from '@shared/types'
import React, { useRef } from 'react'
import ReactToPrint from 'react-to-print'
import { FeeReceipt } from '../FeeReceipt'

type PaymentReceiptDialogProps = {
  open: boolean
  onClose: () => void
  payments?: Payment[]
  student?: Student
}

export const PaymentReceiptDialog: React.FC<PaymentReceiptDialogProps> = ({
  open,
  onClose,
  payments,
  student
}) => {
  const refs = useRef<null[]>([])
  return payments && payments.length && student ? (
    <Dialog open={open} onClose={onClose} maxWidth="lg">
      <DialogTitle className="flex justify-center relative text-center ">
        Payment Receipt
        <Button className="right-2" sx={{ position: 'absolute' }} onClick={onClose}>
          <CloseIcon />
        </Button>
      </DialogTitle>
      <DialogContent>
        {payments.map((eachPayment, index) => {
          return (
            <div key={index} className="flex flex-col">
              <FeeReceipt
                payment={eachPayment}
                student={student}
                ref={(el) => (refs.current[index] = el)}
              />
              <ReactToPrint
                bodyClass="print-agreement"
                content={() => refs.current[index]}
                trigger={() => (
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    className="mx-auto col-span-2"
                  >
                    <PrintIcon />
                  </Button>
                )}
              />
            </div>
          )
        })}
      </DialogContent>
    </Dialog>
  ) : null
}
