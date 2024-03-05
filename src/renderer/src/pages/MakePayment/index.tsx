import { addPayments, getStudentPayments, searchStudents } from '@/api'
import { FeeReceipt } from '@/components'
import { useSnackbar } from '@/contexts'
import { Close as CloseIcon, Print as PrintIcon } from '@mui/icons-material'
import { Button, Dialog, DialogContent, DialogTitle, TextField, Typography } from '@mui/material'
import { PaymentTypes, amountRegex } from '@shared/constants'
import { Payment, Student } from '@shared/types'
import { useEffect, useRef, useState } from 'react'
import ReactToPrint from 'react-to-print'

const MakePayment = () => {
  const refs = useRef<null[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Student[]>([])
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [totalDue, setTotalDue] = useState({
    fees: 0,
    misc: 0
  })
  const [totalPaid, setTotalPaid] = useState(0)
  const [payment, setPayment] = useState({
    value: '',
    error: false,
    errorMessage: ''
  })

  const [payments, setPayments] = useState<Payment[]>([])

  const { error } = useSnackbar()

  const calculateGrandTotal = (
    admissionFee,
    tuitionFee,
    conveyanceFee,
    booksTotal,
    uniformTotal,
    joinedFrom,
    currentMonth?: number
  ) => {
    const lastMonth = currentMonth ? currentMonth + 1 : 3
    const monthsToAcademicEnd =
      joinedFrom < lastMonth ? lastMonth - joinedFrom : 12 + lastMonth - joinedFrom

    return (
      admissionFee + (tuitionFee + conveyanceFee) * monthsToAcademicEnd + booksTotal + uniformTotal
    )
  }

  // Function to handle search query change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value)
  }

  const handleReceiptClose = () => {
    setPayments([])
  }

  const handlePaymentChange = (event) => {
    const value = event.target.value
    const error = !amountRegex.test(value)
    const errorMessage = error ? 'Please enter a valid amount greater than 0' : ''
    setPayment({
      error,
      errorMessage,
      value
    })
  }

  const onSubmitPayment = (e) => {
    e.preventDefault()
    if (payment.error || !parseFloat(payment.value)) {
      error('Please enter a valid amount')
    } else if (selectedStudent) {
      const amount = parseFloat(payment.value)
      const miscPayment = totalDue.misc
        ? amount > totalDue.misc
          ? totalDue.misc
          : totalDue.misc - amount
        : 0
      const feePayment = amount - miscPayment
      const payments: { amount: number; type: PaymentTypes }[] = []
      if (miscPayment) {
        payments.push({
          amount: miscPayment,
          type: PaymentTypes.misc
        })
      }
      if (feePayment) {
        payments.push({
          amount: feePayment,
          type: PaymentTypes.fees
        })
      }
      if (confirm(`Confirm payment of ${amount}?`)) {
        addPayments({ payments, studentId: selectedStudent._id })
          .then((res) => {
            if (res.error) {
              error(res.error.displayMessage)
            } else if (res.result) {
              setPayments(res.result.list)
              setPayment({
                error: false,
                errorMessage: '',
                value: ''
              })
            }
          })
          .catch((e) => {
            console.log('🚀 ~ getStudentPayments ~ e:', e)
            error('Something went wrong')
          })
      }
    }
  }

  useEffect(() => {
    if (searchQuery && searchQuery.length) {
      searchStudents({ searchText: searchQuery })
        .then((res) => {
          if (res.result) {
            setSearchResults(res.result.list)
          } else if (res.error) {
            error(res.error.displayMessage)
          }
        })
        .catch((e) => {
          console.log('🚀 ~ searchStudents ~ e:', e)
          error('Something went wrong')
        })
    } else {
      setSearchResults([])
    }
    return () => {
      setSearchResults([])
    }
  }, [searchQuery])

  useEffect(() => {
    if (selectedStudent) {
      getStudentPayments({ studentId: selectedStudent._id })
        .then((res) => {
          if (res.result) {
            const currentMonth = new Date().getMonth()
            const totalFeeDue =
              calculateGrandTotal(
                selectedStudent.admissionFee,
                selectedStudent.tuitionFee,
                selectedStudent.conveyanceFee,
                0,
                0,
                selectedStudent.joinedFrom,
                currentMonth
              ) - res.result.totalFeesPaid
            const totalMiscDue =
              selectedStudent.booksTotal + selectedStudent.uniformTotal - res.result.totalMiscPaid
            const finalDue = totalFeeDue + totalMiscDue
            setTotalDue({
              fees: totalFeeDue < 0 ? 0 : totalFeeDue,
              misc: totalMiscDue
            })
            setPayment({ value: `${finalDue > 0 ? finalDue : ''}`, error: false, errorMessage: '' })
            setTotalPaid(res.result.totalFeesPaid + res.result.totalMiscPaid)
          } else if (res.error) {
            error(res.error.displayMessage)
          }
        })
        .catch((e) => {
          console.log('🚀 ~ getStudentPayments ~ e:', e)
          error('Something went wrong')
        })
    }
    return () => {
      setTotalDue({
        fees: 0,
        misc: 0
      })
      setTotalPaid(0)
    }
  }, [selectedStudent])

  // Function to handle student selection
  const handleStudentSelect = (student) => {
    setSelectedStudent(student)
    setSearchQuery('')
    setSearchResults([])
    setTotalDue({
      fees: 0,
      misc: 0
    })
    setTotalPaid(0)
    setPayment({
      error: false,
      errorMessage: '',
      value: ''
    })
  }

  // Function to generate receipt
  const generateReceipt = (selectedStudent) => {
    // Generate receipt based on selected student's payment data
    // You can format the receipt in HTML or any other desired format
    const receipt = `
      Student Name: ${selectedStudent.name}
      Class: ${selectedStudent.class}
      Section: ${selectedStudent.section}
      Fees Paid: ${selectedStudent.paymentData.feesPaid}
      Outstanding Balance: ${selectedStudent.paymentData.outstandingBalance}
    `
    return receipt
  }

  return (
    <div className="container mx-auto mt-8 px-4 relative">
      <TextField
        label="Search Student"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={handleSearchChange}
      />
      {/* Display search results */}
      {searchQuery.length ? (
        <div className="flex p-4 border flex-col fixed bg-blue-100 z-10">
          {searchResults.length ? (
            searchResults.map((student, index) => (
              <div
                key={index}
                onClick={() => handleStudentSelect(student)}
                className="flex gap-3 cursor-pointer p-2 mb-2 hover:bg-slate-400"
              >
                <Typography>Name: {student.name}</Typography>
                <Typography>Class: {student.class}</Typography>
                <Typography>Section: {student.section}</Typography>
              </div>
            ))
          ) : (
            <Typography>No students found</Typography>
          )}
        </div>
      ) : null}

      {/* Details */}
      {selectedStudent ? (
        <div className="border mt-5 p-3 flex flex-col gap-3">
          <Typography className="text-center"> Details</Typography>
          <div className="flex justify-between mx-3">
            <Typography className="text-center"> Name: {selectedStudent.name}</Typography>
            <Typography className="text-center"> Class: {selectedStudent.class}</Typography>
            <Typography className="text-center"> Section: {selectedStudent.section}</Typography>
            <Typography className="text-center">
              {"Father's Name"}: {selectedStudent.fatherName}
            </Typography>
          </div>
          <div className="flex justify-between mx-3">
            <Typography className="text-center">
              Total Fee:{' '}
              {calculateGrandTotal(
                selectedStudent.admissionFee,
                selectedStudent.tuitionFee,
                selectedStudent.conveyanceFee,
                selectedStudent.booksTotal,
                selectedStudent.uniformTotal,
                selectedStudent.joinedFrom
              )}
            </Typography>
            <Typography className="text-center">
              Monthly Fee: {selectedStudent.tuitionFee + selectedStudent.conveyanceFee}
            </Typography>
            <Typography className="text-center">Total Paid: {totalPaid}</Typography>
            <Typography className="text-center">
              Amount Due: {totalDue.fees + totalDue.misc}
            </Typography>
          </div>
          <div className="flex justify-center mx-3">
            <form onSubmit={onSubmitPayment} className="flex justify-between gap-5">
              <TextField
                error={payment.error}
                className="flex-1"
                label="Amount"
                variant="outlined"
                fullWidth
                id="amount"
                name="amount"
                value={payment.value}
                onChange={handlePaymentChange}
                helperText={payment.errorMessage}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                className=""
                disabled={payment.error || !payment.value.length}
              >
                Pay Now
              </Button>
            </form>
          </div>
        </div>
      ) : null}

      {/* Receipt Dialog */}
      {payments && payments.length && selectedStudent ? (
        <Dialog open onClose={handleReceiptClose} maxWidth="lg">
          <DialogTitle className="flex justify-center relative text-center ">
            Payment Receipt
            <Button className="absolute right-2" onClick={handleReceiptClose}>
              <CloseIcon />
            </Button>
          </DialogTitle>
          <DialogContent>
            {payments.map((eachPayment, index) => {
              return (
                <div key={index} className="flex flex-col">
                  <FeeReceipt
                    payment={eachPayment}
                    student={selectedStudent}
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
      ) : null}
    </div>
  )
}

export default MakePayment
