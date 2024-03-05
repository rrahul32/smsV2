import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { PaymentTypes } from '@shared/constants'
import { Payment, Student } from '@shared/types'
import React from 'react'

export const FeeReceipt = React.forwardRef<null, { student: Student; payment: Payment }>(
  ({ payment, student }, ref) => {
    return (
      <div className="p-3" ref={ref}>
        <div className="border p-3">
          <div className="flex flex-col gap-3 pb-3">
            {payment.type === PaymentTypes.fees ? (
              <Typography variant="h4" className="text-center">
                Guru Ramdas Public School, Bham
              </Typography>
            ) : null}
            <Typography variant="h5" className="text-center">
              Receipt
            </Typography>
            <div className="flex justify-between">
              <Typography>Name: {student.name}</Typography>
              <Typography>Class: {student.class}</Typography>
              <Typography>Section: {student.section}</Typography>
            </div>
          </div>
          <Table className="border">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography className="text-center">Particulars</Typography>
                </TableCell>
                <TableCell>
                  <Typography className="text-center">Amount</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell sx={{ paddingBottom: '300px' }}>
                  <Typography className="text-center">
                    {payment.type === PaymentTypes.fees ? 'Fees' : 'Miscellaneous'}
                  </Typography>
                </TableCell>
                <TableCell sx={{ paddingBottom: '300px' }}>
                  <Typography className="text-center">{payment.amount}</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography className="text-center">Total</Typography>
                </TableCell>
                <TableCell>
                  <Typography className="text-center">{payment.amount}</Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }
)

FeeReceipt.displayName = 'FeeReceipt'
