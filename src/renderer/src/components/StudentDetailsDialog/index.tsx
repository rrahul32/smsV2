import CloseIcon from '@mui/icons-material/Close'
import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material'
import React from 'react'
import { StudentDetailsProps } from './type'

export const StudentDetailsDialog: React.FC<StudentDetailsProps> = ({
  handleClose,
  open,
  selectedStudent
}) => {
  const calculateGrandTotal = (
    admissionFee,
    tuitionFee,
    conveyanceFee,
    booksTotal,
    uniformTotal,
    joinedFrom
  ) => {
    const monthsToAcademicEnd = joinedFrom < 3 ? 3 - joinedFrom : 15 - joinedFrom

    return (
      admissionFee + (tuitionFee + conveyanceFee) * monthsToAcademicEnd + booksTotal + uniformTotal
    )
  }
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
      <DialogTitle className="bg-blue-500 text-white flex justify-between items-center">
        <Typography variant="h6">Student Details</Typography>
        <IconButton onClick={handleClose} color="inherit">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      {selectedStudent && (
        <DialogContent className="p-4 my-3 flex flex-col gap-y-4">
          <Typography variant="h4" className="text-center">
            Basic Details
          </Typography>

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
                {calculateGrandTotal(
                  selectedStudent.admissionFee,
                  selectedStudent.tuitionFee,
                  selectedStudent.conveyanceFee,
                  selectedStudent.booksTotal,
                  selectedStudent.uniformTotal,
                  selectedStudent.joinedFrom
                )}
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
            Payments
          </Typography>
          <div className="flex w-full">
            {/* Render
            Payments
            List */}
          </div>
        </DialogContent>
      )}
    </Dialog>
  )
}
