import { useSnackbar } from '@/contexts'
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material'
import { Classes, Months, Sections } from '@shared/constants'
import { useEffect, useState } from 'react'
import { AddStudentFormValuesType } from './types'

const AddStudent = () => {
  const { error, success } = useSnackbar()

  const numberRegex = /\d/
  const currentMonthIndex = new Date().getMonth()
  const months = Months.map((value, index) => {
    return {
      index,
      value
    }
  }).filter((month) => {
    if (currentMonthIndex >= 3) {
      if (month.index >= 3 && month.index <= currentMonthIndex) {
        return true
      } else {
        return false
      }
    } else {
      if (month.index >= 3 || month.index <= currentMonthIndex) {
        return true
      } else {
        return false
      }
    }
  })
  const inititalFormValues: AddStudentFormValuesType = {
    name: { value: null, error: false, errorMessage: '' },
    class: { value: null, error: false, errorMessage: '' },
    section: { value: null, error: false, errorMessage: '' },
    fatherName: { value: null, error: false, errorMessage: '' },
    contactNumber: { value: null, error: false, errorMessage: '' },
    admissionFee: { value: null, error: false, errorMessage: '' },
    tuitionFee: { value: null, error: false, errorMessage: '' },
    conveyanceFee: { value: null, error: false, errorMessage: '' },
    books: { value: null, error: false, errorMessage: '' },
    uniform: { value: null, error: false, errorMessage: '' },
    joinedFrom: { value: currentMonthIndex, error: false, errorMessage: '' }
  }

  const [student, setStudent] = useState(inititalFormValues)
  const [totalFee, setTotalFee] = useState(0)
  const [monthlyFee, setMonthlyFee] = useState(0)

  const errorKey = Object.keys(student).find(
    (item) => student[item].error || student[item].value === null
  )

  useEffect(() => {
    const admissionFee =
      typeof student.admissionFee.value === 'string' && numberRegex.test(student.admissionFee.value)
        ? parseFloat(student.admissionFee.value)
        : 0
    const tuitionFee =
      typeof student.tuitionFee.value === 'string' && numberRegex.test(student.tuitionFee.value)
        ? parseFloat(student.tuitionFee.value)
        : 0
    const conveyanceFee =
      typeof student.conveyanceFee.value === 'string' &&
      numberRegex.test(student.conveyanceFee.value)
        ? parseFloat(student.conveyanceFee.value)
        : 0
    const books =
      typeof student.books.value === 'string' && numberRegex.test(student.books.value)
        ? parseFloat(student.books.value)
        : 0
    const uniform =
      typeof student.uniform.value === 'string' && numberRegex.test(student.uniform.value)
        ? parseFloat(student.uniform.value)
        : 0
    const monthsToAcademicEnd =
      student.joinedFrom.value < 3 ? 3 - student.joinedFrom.value : 15 - student.joinedFrom.value

    const total =
      admissionFee + (tuitionFee + conveyanceFee) * monthsToAcademicEnd + books + uniform
    setTotalFee(total)
    return () => {
      setTotalFee(0)
    }
  }, [
    student.admissionFee.value,
    student.tuitionFee.value,
    student.conveyanceFee.value,
    student.books.value,
    student.uniform.value,
    student.joinedFrom.value
  ])

  useEffect(() => {
    const tuitionFee =
      typeof student.tuitionFee.value === 'string' && numberRegex.test(student.tuitionFee.value)
        ? parseFloat(student.tuitionFee.value)
        : 0
    const conveyanceFee =
      typeof student.conveyanceFee.value === 'string' &&
      numberRegex.test(student.conveyanceFee.value)
        ? parseFloat(student.conveyanceFee.value)
        : 0
    setMonthlyFee(tuitionFee + conveyanceFee)
    return () => {
      setMonthlyFee(0)
    }
  }, [student.tuitionFee.value, student.conveyanceFee.value])

  const handleClassChange = (e) => {
    const value = e.target.value
    const error = value && Object.values(Classes).includes(value) ? false : true
    const errorMessage = error ? 'Please select a class' : ''
    setStudent((prevStudent) => ({
      ...prevStudent,
      class: {
        value,
        error,
        errorMessage
      }
    }))
  }

  const handleJoinedFromChange = (e) => {
    const value = e.target.value
    const error =
      typeof value === 'number' && months.find((month) => month.index === value) ? false : true
    const errorMessage = error ? 'Please select a month' : ''
    setStudent((prevStudent) => ({
      ...prevStudent,
      joinedFrom: {
        value,
        error,
        errorMessage
      }
    }))
  }

  const handleSectionChange = (e) => {
    const value = e.target.value
    const error = value && Object.values(Sections).includes(value) ? false : true
    const errorMessage = error ? 'Please select a section' : ''
    setStudent((prevStudent) => ({
      ...prevStudent,
      section: {
        value,
        error,
        errorMessage
      }
    }))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    let error = false
    let errorMessage = ''
    switch (name) {
      case 'contactNumber':
        if (!/^[5-9]\d{9}$/.test(value)) {
          error = true
          errorMessage = 'Please enter a valid 10-digit phone number'
        }
        break
      case 'admissionFee':
      case 'tuitionFee':
      case 'conveyanceFee':
      case 'books':
      case 'uniform':
        if (!/^\d+(\.\d+)?$/.test(value)) {
          error = true
          errorMessage = 'Please enter a valid amount'
        }
        break
      default:
        error = value && value.length ? false : true
        errorMessage = error ? 'This field is required' : ''
        break
    }

    setStudent((prevStudent) => ({
      ...prevStudent,
      [name]: {
        value,
        error,
        errorMessage
      }
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (errorKey) {
      error('Unable to add student')
    } else {
      //
      setStudent(inititalFormValues)
    }
  }

  return (
    <div className="container mx-auto mt-8 px-4">
      <Typography variant="h4" component="h2" gutterBottom>
        Add Student
      </Typography>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-4 gap-4">
          <TextField
            error={student.name.error}
            className="col-span-2"
            label="Name"
            variant="outlined"
            fullWidth
            id="name"
            name="name"
            value={student.name.value}
            onChange={handleChange}
            helperText={student.name.errorMessage ?? ''}
          />
          <FormControl fullWidth error={student.class.error}>
            <InputLabel id="class-select">Class</InputLabel>
            <Select
              labelId="class-select"
              id="class"
              value={student.class.value}
              label="Class"
              onChange={handleClassChange}
            >
              {Object.values(Classes).map((each, index) => {
                return (
                  <MenuItem key={index} value={each}>
                    {each}
                  </MenuItem>
                )
              })}
            </Select>
            <FormHelperText>{student.class.errorMessage}</FormHelperText>
          </FormControl>
          <FormControl fullWidth error={student.section.error}>
            <InputLabel id="section-select">Section</InputLabel>
            <Select
              labelId="section-select"
              id="section"
              value={student.section.value}
              label="Section"
              onChange={handleSectionChange}
            >
              {Object.values(Sections).map((each, index) => {
                return (
                  <MenuItem key={index} value={each}>
                    {each}
                  </MenuItem>
                )
              })}
            </Select>
            <FormHelperText>{student.section.errorMessage}</FormHelperText>
          </FormControl>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="Father's Name"
            variant="outlined"
            fullWidth
            id="fatherName"
            name="fatherName"
            value={student.fatherName.value}
            error={student.fatherName.error}
            helperText={student.fatherName.errorMessage}
            onChange={handleChange}
          />
          <TextField
            label="Contact Number"
            variant="outlined"
            fullWidth
            id="contactNumber"
            name="contactNumber"
            type="tel"
            inputProps={{
              maxLength: 10
            }}
            value={student.contactNumber.value}
            error={student.contactNumber.error}
            helperText={student.contactNumber.errorMessage}
            onChange={handleChange}
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <TextField
            label="Admission Fee"
            variant="outlined"
            fullWidth
            id="admissionFee"
            name="admissionFee"
            value={student.admissionFee.value}
            error={student.admissionFee.error}
            helperText={student.admissionFee.errorMessage}
            onChange={handleChange}
          />
          <TextField
            label="Tuition Fee"
            variant="outlined"
            fullWidth
            id="tuitionFee"
            name="tuitionFee"
            value={student.tuitionFee.value}
            error={student.tuitionFee.error}
            helperText={student.tuitionFee.errorMessage}
            onChange={handleChange}
          />
          <TextField
            label="Conveyance Fee"
            variant="outlined"
            fullWidth
            id="conveyanceFee"
            name="conveyanceFee"
            value={student.conveyanceFee.value}
            error={student.conveyanceFee.error}
            helperText={student.conveyanceFee.errorMessage}
            onChange={handleChange}
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <TextField
            label="Books"
            variant="outlined"
            fullWidth
            id="books"
            name="books"
            value={student.books.value}
            error={student.books.error}
            helperText={student.books.errorMessage}
            onChange={handleChange}
          />
          <TextField
            label="Uniform"
            variant="outlined"
            fullWidth
            id="uniform"
            name="uniform"
            value={student.uniform.value}
            error={student.uniform.error}
            helperText={student.uniform.errorMessage}
            onChange={handleChange}
          />
          <FormControl fullWidth error={student.joinedFrom.error}>
            <InputLabel id="joined-from-select">Joined From</InputLabel>
            <Select
              labelId="joined-from-select"
              id="joined-from"
              value={student.joinedFrom.value}
              label="joined-from"
              onChange={handleJoinedFromChange}
            >
              {months.map((each) => {
                return each ? (
                  <MenuItem key={each.index} value={each.index}>
                    {each.value}
                  </MenuItem>
                ) : null
              })}
            </Select>
            <FormHelperText>{student.joinedFrom.errorMessage}</FormHelperText>
          </FormControl>
        </div>
        <div className="flex justify-center">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            className="mx-auto block"
            disabled={!!errorKey}
          >
            Add Student
          </Button>
        </div>
      </form>
      <div className="mt-8 bg-gray-100 p-4 rounded-lg flex justify-center space-x-10">
        <Typography variant="h4" gutterBottom>
          Total Fee: {totalFee}
        </Typography>
        <Typography variant="h4" gutterBottom>
          Monthly Fee: {monthlyFee}
        </Typography>
      </div>
    </div>
  )
}

export default AddStudent
