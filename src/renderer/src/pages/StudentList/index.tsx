import { getStudents } from '@/api'
import { StudentDetailsDialog } from '@/components'
import { useSnackbar } from '@/contexts'
import { Button, CircularProgress } from '@mui/material'
import { Student } from '@shared/types'
import MUIDataTable from 'mui-datatables'
import { useEffect, useState } from 'react'

const StudentsList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  console.log('🚀 ~ selectedIndex:', selectedIndex)

  const { error } = useSnackbar()

  useEffect(() => {
    setIsLoading(true)
    getStudents()
      .then((res) => {
        if (res.result) {
          setStudents(res.result.list)
        } else if (res.error) {
          error(res.error.displayMessage)
        }
      })
      .catch((e) => {
        console.log('🚀 ~ useEffect ~ e:', e)
        error('Something went wrong')
      })
      .finally(() => setIsLoading(false))
  }, [])

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
      name: 'name',
      label: 'Name',
      options: {
        filter: false
      }
    },
    { name: 'class', label: 'Class' },
    {
      name: 'section',
      label: 'Section',
      options: {
        sort: false
      }
    },
    {
      name: 'fatherName',
      label: "Father's Name",
      options: {
        filter: false,
        sort: false
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
              View Details
            </Button>
          )
        }
      }
    }
  ]

  const options = {
    filter: true,
    search: true,
    pagination: true,
    selectableRows: 'none',
    responsive: 'standard',
    download: false,
    print: false,
    viewColumns: false
  }

  return isLoading ? (
    <CircularProgress color="primary" />
  ) : (
    <div className="container mt-8 mb-8">
      <StudentDetailsDialog
        open={isOpen}
        handleClose={handleDetailsClose}
        selectedStudent={typeof selectedIndex === 'number' ? students[selectedIndex] : undefined}
      />
      <div className="flex justify-center">
        <MUIDataTable
          title="Students"
          data={students}
          columns={columns}
          options={options}
          className="w-11/12"
        />
      </div>
    </div>
  )
}

export default StudentsList
