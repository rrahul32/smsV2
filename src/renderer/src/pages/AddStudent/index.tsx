import { addStudent, getStudent, updateStudent } from '@/api/students'
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
import { Classes, Months, Sections, amountRegex, phoneNumberRegex } from '@shared/constants'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AddStudentFormValuesType } from './types'

const AddStudent = () => {
  const { error, success } = useSnackbar()

  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const studentId = searchParams.get('studentId')

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
    name: { value: '', error: false, errorMessage: '' },
    class: { value: Classes.nursery, error: false, errorMessage: '' },
    section: { value: Sections.a, error: false, errorMessage: '' },
    fatherName: { value: '', error: false, errorMessage: '' },
    contactNumber: { value: '', error: false, errorMessage: '' },
    admissionFee: { value: '', error: false, errorMessage: '' },
    tuitionFee: { value: '', error: false, errorMessage: '' },
    conveyanceFee: { value: '', error: false, errorMessage: '' },
    books: { value: '', error: false, errorMessage: '' },
    uniform: { value: '', error: false, errorMessage: '' },
    joinedFrom: { value: 3, error: false, errorMessage: '' }
  }
  // const inititalFormValues: AddStudentFormValuesType = {
  //   name: { value: 'a', error: false, errorMessage: '' },
  //   class: { value: Classes.nursery, error: false, errorMessage: '' },
  //   section: { value: Sections.a, error: false, errorMessage: '' },
  //   fatherName: { value: 'a', error: false, errorMessage: '' },
  //   contactNumber: { value: '9876543210', error: false, errorMessage: '' },
  //   admissionFee: { value: '0', error: false, errorMessage: '' },
  //   tuitionFee: { value: '0', error: false, errorMessage: '' },
  //   conveyanceFee: { value: '0', error: false, errorMessage: '' },
  //   books: { value: '0', error: false, errorMessage: '' },
  //   uniform: { value: '0', error: false, errorMessage: '' },
  //   joinedFrom: { value: 3, error: false, errorMessage: '' }
  // }

  const [student, setStudent] = useState(inititalFormValues)
  const [totalFee, setTotalFee] = useState(0)
  const [monthlyFee, setMonthlyFee] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (studentId) {
      setLoading(true)
      getStudent({ id: studentId })
        .then((res) => {
          if (res.result) {
            inititalFormValues.admissionFee.value = `${res.result.admissionFee}`
            inititalFormValues.books.value = `${res.result.booksTotal}`
            inititalFormValues.contactNumber.value = `${res.result.phone}`
            inititalFormValues.conveyanceFee.value = `${res.result.conveyanceFee}`
            inititalFormValues.tuitionFee.value = `${res.result.tuitionFee}`
            inititalFormValues.uniform.value = `${res.result.uniformTotal}`
            inititalFormValues.section.value = res.result.section
            inititalFormValues.fatherName.value = res.result.fatherName
            inititalFormValues.name.value = res.result.fatherName
            inititalFormValues.joinedFrom.value = res.result.joinedFrom
            inititalFormValues.class.value = res.result.class
            setStudent(inititalFormValues)
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

    return () => {}
  }, [])

  const errorKey = Object.keys(student).find(
    (item) =>
      student[item].error ||
      !student[item].value ||
      (typeof student[item].value === 'string' && !student[item].value.length)
  )

  useEffect(() => {
    const admissionFee = numberRegex.test(student.admissionFee.value)
      ? parseFloat(student.admissionFee.value)
      : 0
    const tuitionFee = numberRegex.test(student.tuitionFee.value)
      ? parseFloat(student.tuitionFee.value)
      : 0
    const conveyanceFee = numberRegex.test(student.conveyanceFee.value)
      ? parseFloat(student.conveyanceFee.value)
      : 0
    const books = numberRegex.test(student.books.value) ? parseFloat(student.books.value) : 0
    const uniform = numberRegex.test(student.uniform.value) ? parseFloat(student.uniform.value) : 0
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
    const tuitionFee = numberRegex.test(student.tuitionFee.value)
      ? parseFloat(student.tuitionFee.value)
      : 0
    const conveyanceFee = numberRegex.test(student.conveyanceFee.value)
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
        if (!phoneNumberRegex.test(value)) {
          error = true
          errorMessage = 'Please enter a valid 10-digit phone number'
        }
        break
      case 'admissionFee':
      case 'tuitionFee':
      case 'conveyanceFee':
      case 'books':
      case 'uniform':
        if (!amountRegex.test(value)) {
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
      error('Unable to add/save student details')
    } else {
      const studentValues = {
        name: student.name.value,
        admissionFee: parseFloat(student.admissionFee.value),
        booksTotal: parseFloat(student.books.value),
        class: student.class.value,
        phone: parseInt(student.contactNumber.value),
        conveyanceFee: parseFloat(student.conveyanceFee.value),
        fatherName: student.fatherName.value,
        joinedFrom: student.joinedFrom.value,
        section: student.section.value,
        tuitionFee: parseFloat(student.tuitionFee.value),
        uniformTotal: parseFloat(student.uniform.value)
      }
      if (studentId) {
        updateStudent({ id: studentId, details: studentValues })
          .then((res) => {
            if (res.result) {
              success('Student details updated')
            } else if (res.error) {
              error(res.error.displayMessage)
            }
            setStudent(inititalFormValues)
          })
          .catch((e) => {
            console.log('🚀 ~ updateStudent ~ e:', e)
            error('Something went wrong')
          })
      } else {
        addStudent(studentValues)
          .then((res) => {
            if (res.result) {
              success('Student added')
            } else if (res.error) {
              error(res.error.displayMessage)
            }
            setStudent(inititalFormValues)
          })
          .catch((e) => {
            console.log('🚀 ~ addStudent ~ e:', e)
            error('Something went wrong')
          })
      }
    }
  }

  return (
    <div className="container mx-auto mt-8 px-4">
      <Typography variant="h4" component="h2" gutterBottom>
        {studentId ? 'Edit Student' : 'Add Student'}
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
            helperText={student.name.errorMessage}
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
              label="Joined From"
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
            {studentId ? 'Save Changes' : 'Add Student'}
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
