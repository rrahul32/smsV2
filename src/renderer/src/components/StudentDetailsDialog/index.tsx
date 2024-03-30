import { getStudentPayments } from '@/api'
import { useAuth, useSnackbar } from '@/contexts'
import { calculateGrandTotal } from '@/utils'
import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'
import {
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography
} from '@mui/material'
import { Payment } from '@shared/types'
import MUIDataTable from 'mui-datatables'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PaymentReceiptDialog } from '../PaymentReceiptDialog'
import { StudentDetailsProps } from './type'

export const StudentDetailsDialog: React.FC<StudentDetailsProps> = ({
  handleClose,
  open,
  selectedStudent
}) => {
  const [payments, setPayments] = useState<Payment[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [totalDue, setTotalDue] = useState({
    fees: 0,
    misc: 0
  })

  const { userInfo } = useAuth()

  const { error } = useSnackbar()

  useEffect(() => {
    if (selectedStudent?._id && userInfo) {
      setLoading(true)
      getStudentPayments({ studentId: selectedStudent._id })
        .then((res) => {
          if (res.result) {
            setPayments(res.result.list)
            const currentMonth = new Date().getMonth()
            const totalFeeDue =
              calculateGrandTotal(
                selectedStudent.admissionFee,
                selectedStudent.tuitionFee,
                selectedStudent.conveyanceFee,
                0,
                0,
                selectedStudent.joinedFrom,
                userInfo.academicYear,
                currentMonth
              ) - res.result.totalFeesPaid
            const totalMiscDue =
              selectedStudent.booksTotal + selectedStudent.uniformTotal - res.result.totalMiscPaid
            setTotalDue({
              fees: totalFeeDue < 0 ? 0 : totalFeeDue,
              misc: totalMiscDue
            })
          } else if (res.error) {
            error(res.error.displayMessage)
          }
        })
        .catch((e) => {
          console.log('🚀 ~ useEffect ~ e:', e)
          error('Something went wrong')
        })
        .finally(() => {
          setLoading(false)
        })
    }
    return () => {
      setPayments([])
    }
  }, [selectedStudent])

  const handleDetailsClick = (index: number) => {
    setIsOpen(true)
    setSelectedIndex(index)
  }

  const handleDetailsClose = () => {
    setIsOpen(false)
    setSelectedIndex(null)
  }

  const columns = [
    {
      name: 'sno',
      label: 'S. No.',
      options: {
        filter: false,
        customBodyRenderLite: (dataIndex) => dataIndex + 1
      }
    },
    {
      name: 'type',
      label: 'Type'
    },
    {
      name: 'amount',
      label: 'Amount',
      options: {
        filter: false,
        sort: false
      }
    },
    {
      name: 'createdAt',
      label: 'Paid On',
      options: {
        filter: false,
        customBodyRender: (date: Date) =>
          date.toLocaleDateString('en-UK', {
            // weekday: 'short', // full, long, short, narrow
            year: 'numeric', // 2-digit, numeric
            month: 'numeric', // 2-digit, numeric, long, short, narrow
            day: 'numeric' // 2-digit, numeric
          })
      }
    },
    {
      name: 'actions',
      label: ' ',
      options: {
        filter: false,
        sort: false,
        customBodyRenderLite: (dataIndex) => {
          return (
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={() => handleDetailsClick(dataIndex)}
            >
              View Receipt
            </Button>
          )
        }
      }
    }
  ]

  const options = {
    filter: false,
    search: false,
    pagination: true,
    selectableRows: 'none',
    responsive: 'standard',
    download: false,
    print: false,
    viewColumns: false
  }

  const selectedPayment = selectedIndex !== null ? payments[selectedIndex] : null

  return (
    <div className="flex justify-center">
      <PaymentReceiptDialog
        open={isOpen}
        onClose={handleDetailsClose}
        payments={selectedPayment ? [selectedPayment] : []}
        student={selectedStudent}
      />
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
        <DialogTitle className="bg-blue-500 text-white flex justify-between items-center">
          <Typography variant="h6">Student Details</Typography>
          <IconButton onClick={handleClose} color="inherit">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        {selectedStudent && (
          <DialogContent className="p-4 my-3 flex flex-col gap-y-4">
            <div className="flex relative">
              <Typography variant="h4" className="flex-1 text-center">
                Basic Details
              </Typography>
              <Button
                className="flex-1 text-center right-0"
                variant="contained"
                sx={{
                  position: 'absolute'
                }}
              >
                <Link to={`/students/add?studentId=${selectedStudent._id}`}>
                  <EditIcon />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="flex gap-3">
                <Typography variant="body1" className="font-bold">
                  Name:
                </Typography>
                <Typography variant="body1">{selectedStudent.name}</Typography>
              </div>
              <div className="flex gap-3">
                <Typography variant="body1" className="font-bold">
                  {"Father's Name"}:
                </Typography>
                <Typography variant="body1">{selectedStudent.fatherName}</Typography>
              </div>
              <div className="flex gap-3">
                <Typography variant="body1" className="font-bold">
                  Class:
                </Typography>
                <Typography variant="body1">{selectedStudent.class}</Typography>
              </div>
              <div className="flex gap-3">
                <Typography variant="body1" className="font-bold">
                  Section:
                </Typography>
                <Typography variant="body1">{selectedStudent.section}</Typography>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="flex gap-3">
                <Typography variant="body1" className="font-bold">
                  Phone:
                </Typography>
                <Typography variant="body1">{selectedStudent.phone}</Typography>
              </div>
              <div className="flex gap-3">
                <Typography variant="body1" className="font-bold">
                  Admission Fee:
                </Typography>
                <Typography variant="body1">{selectedStudent.admissionFee}</Typography>
              </div>
              <div className="flex gap-3">
                <Typography variant="body1" className="font-bold">
                  Tuition Fee:
                </Typography>
                <Typography variant="body1">{selectedStudent.tuitionFee}</Typography>
              </div>
              <div className="flex gap-3">
                <Typography variant="body1" className="font-bold">
                  Conveyance Fee:
                </Typography>
                <Typography variant="body1">{selectedStudent.conveyanceFee}</Typography>
              </div>
              <div className="flex gap-3">
                <Typography variant="body1" className="font-bold">
                  Books Total:
                </Typography>
                <Typography variant="body1">{selectedStudent.booksTotal}</Typography>
              </div>
              <div className="flex gap-3">
                <Typography variant="body1" className="font-bold">
                  Uniform Total:
                </Typography>
                <Typography variant="body1">{selectedStudent.uniformTotal}</Typography>
              </div>
              <div className="flex gap-3">
                <Typography variant="body1" className="font-bold">
                  Grand Total:
                </Typography>
                <Typography variant="body1">
                  {userInfo
                    ? calculateGrandTotal(
                        selectedStudent.admissionFee,
                        selectedStudent.tuitionFee,
                        selectedStudent.conveyanceFee,
                        selectedStudent.booksTotal,
                        selectedStudent.uniformTotal,
                        selectedStudent.joinedFrom,
                        userInfo.academicYear
                      )
                    : 0}
                </Typography>
              </div>
              <div className="flex gap-3">
                <Typography variant="body1" className="font-bold">
                  Monthly Total:
                </Typography>
                <Typography variant="body1">
                  {selectedStudent.tuitionFee + selectedStudent.conveyanceFee}
                </Typography>
              </div>
            </div>
            <Typography variant="h4" className="text-center">
              Dues
            </Typography>
            <div className="flex">
              <Typography className="flex-1 text-center">Miscellaneous: {totalDue.misc}</Typography>
              <Typography className="flex-1 text-center">Fees: {totalDue.fees}</Typography>
              <Typography className="flex-1 text-center">
                Total: {totalDue.fees + totalDue.misc}
              </Typography>
              <Button
                className="flex-1 text-center"
                variant="contained"
                disabled={!(totalDue.fees + totalDue.misc)}
              >
                <Link to={`/payments/new?studentId=${selectedStudent._id}`}>Pay Now</Link>
              </Button>
            </div>

            <Typography variant="h4" className="text-center">
              Payments
            </Typography>
            <div className="flex justify-center">
              {loading ? (
                <CircularProgress />
              ) : (
                <MUIDataTable
                  // title="Payments"
                  data={payments}
                  columns={columns}
                  options={options}
                  className="w-11/12"
                />
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
