import { getStudents } from '@/api'
import { StudentDetailsDialog } from '@/components'
import { useAuth, useSnackbar } from '@/contexts'
import { Button, CircularProgress } from '@mui/material'
import Backdrop from '@mui/material/Backdrop'
import { Classes, GetStudentsSortFields, Sections, SortOrder } from '@shared/constants'
import { Student } from '@shared/types'
import MUIDataTable from 'mui-datatables'
import { useEffect, useState } from 'react'

const StudentsList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [totalCount, setTotalCount] = useState<number>(0)
  const [selectedClasses, setSelectedClasses] = useState<Classes[]>([])
  const [selectedSections, setSelectedSections] = useState<Sections[]>([])
  const [searchText, setSearchText] = useState<string>('')
  const [sort, setSort] = useState<
    { field: GetStudentsSortFields; sortOrder: SortOrder } | undefined
  >()
  const [paginationMeta, setPaginationMeta] = useState({
    limit: 10,
    page: 0
  })

  const { userInfo } = useAuth()

  const { error } = useSnackbar()

  useEffect(() => {
    return () => {
      setStudents([])
      setSelectedClasses([])
      setSelectedSections([])
      setIsLoading(true)
      setSort(undefined)
      setSearchText('')
      setTotalCount(0)
      setPaginationMeta({
        limit: 10,
        page: 0
      })
    }
  }, [])

  useEffect(() => {
    let active = true
    if (userInfo) {
      setIsLoading(true)
      getStudents({
        userId: userInfo.id,
        filter: {
          classes: selectedClasses,
          sections: selectedSections,
          searchText
        },
        sort,
        limit: paginationMeta.limit,
        page: paginationMeta.page
      })
        .then((res) => {
          if (active) {
            if (res.result) {
              setStudents(res.result.list)
              setTotalCount(res.result.totalCount)
            } else if (res.error) {
              error(res.error.displayMessage)
            }
          }
        })
        .catch((e) => {
          console.log('🚀 ~ useEffect ~ e:', e)
          if (active) {
            error('Something went wrong')
          }
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
    return () => {
      active = false
    }
  }, [selectedClasses, selectedSections, sort, searchText, paginationMeta])

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
        sort: false,
        customBodyRenderLite: (dataIndex) => dataIndex + 1
      }
    },
    {
      name: 'name',
      label: 'Name',
      options: {
        filter: false
      }
    },
    {
      name: 'class',
      label: 'Class',
      options: {
        filterOptions: {
          names: Object.values(Classes)
        },
        customFilterListOptions: { render: (v) => `Class: ${v}` }
      }
    },
    {
      name: 'section',
      label: 'Section',
      options: {
        sort: false,
        filterOptions: {
          names: Object.values(Sections)
        },
        customFilterListOptions: { render: (v) => `Section: ${v}` }
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
    filterType: 'multiselect',
    onFilterChange: (_, filterList, type, changedColumnIndex) => {
      const selectedColumn = columns[changedColumnIndex ?? 0].name
      const filters = filterList[changedColumnIndex ?? 0]
      switch (selectedColumn) {
        case 'class':
          setSelectedClasses(filters)
          break
        case 'section':
          setSelectedSections(filters)
          break
        default:
          if (type === 'reset') {
            setSelectedClasses([])
            setSelectedSections([])
          }
          break
      }
    },
    onColumnSortChange: (changedColumn, direction) => {
      setSort({
        field: GetStudentsSortFields[changedColumn],
        sortOrder: direction === 'desc' ? SortOrder.desc : SortOrder.asc
      })
    },
    onSearchChange: (searchText?: string) => {
      if (searchText) {
        const strippedSearchText = searchText.replace(/\s/g, '')
        setSearchText(strippedSearchText)
      } else {
        setSearchText('')
      }
    },
    count: totalCount,
    rowsPerPage: paginationMeta.limit,
    page: paginationMeta.page,
    onChangePage: (currentPage: number) => {
      setPaginationMeta({
        limit: paginationMeta.limit,
        page: currentPage
      })
    },
    onChangeRowsPerPage: (numberOfRows: number) => {
      setPaginationMeta({
        limit: numberOfRows,
        page: 0
      })
    },
    serverSide: true,
    selectableRows: 'none',
    responsive: 'standard',
    download: false,
    print: false,
    viewColumns: false
  }

  return (
    <div className="container mt-8 mb-8">
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
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
