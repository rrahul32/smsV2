import { getDueList } from '@/api'
import { useAuth, useSnackbar } from '@/contexts'
import { Backdrop, CircularProgress } from '@mui/material'
import { Classes, GetDueListSortFields, Sections, SortOrder } from '@shared/constants'
import { DueListItem } from '@shared/types'
import MUIDataTable from 'mui-datatables'
import { useEffect, useState } from 'react'

const DueList: React.FC = () => {
  const [dueList, setDueList] = useState<DueListItem[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [selectedSections, setSelectedSections] = useState<Sections[]>([])
  const [totalCount, setTotalCount] = useState<number>(0)
  const [selectedClasses, setSelectedClasses] = useState<Classes[]>([])
  const [sort, setSort] = useState<
    { sortField: GetDueListSortFields; sortOrder: SortOrder } | undefined
  >()
  const [paginationMeta, setPaginationMeta] = useState({
    limit: 10,
    page: 0
  })

  const { userInfo } = useAuth()

  const { error } = useSnackbar()

  useEffect(() => {
    return () => {
      setDueList([])
      setIsLoading(true)
      setSelectedSections([])
      setSelectedClasses([])
      setSort(undefined)
      setTotalCount(0)
      setPaginationMeta({
        limit: 10,
        page: 0
      })
    }
  }, [])

  useEffect(() => {
    if (userInfo) {
      setIsLoading(true)
      getDueList({
        userId: userInfo.id,
        filter: {
          classes: selectedClasses,
          sections: selectedSections
        },
        sort,
        limit: paginationMeta.limit,
        page: paginationMeta.page
      })
        .then((res) => {
          if (res.result) {
            setDueList(res.result.list)
            setTotalCount(res.result.totalCount)
          } else if (res.error) {
            error(res.error.displayMessage)
          }
        })
        .catch((e) => {
          console.log('🚀 ~ useEffect ~ e:', e)
          error('Something went wrong')
        })
        .finally(() => setIsLoading(false))
    }
  }, [selectedClasses, selectedSections, sort, paginationMeta])

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
      name: 'studentName',
      label: 'Name',
      options: {
        filter: false
      }
    },
    {
      name: 'studentClass',
      label: 'Class',
      options: {
        filterOptions: {
          names: Object.values(Classes)
        },
        customFilterListOptions: { render: (v) => `Class: ${v}` }
      }
    },
    {
      name: 'studentSection',
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
      name: 'totalFeesDue',
      label: 'Fees Due',
      options: {
        filter: false
      }
    },
    {
      name: 'totalMiscDue',
      label: 'Miscellaneous Due',
      options: {
        filter: false
      }
    },
    {
      name: 'totalDue',
      label: 'Total Due',
      options: {
        filter: false
      }
    }
  ]

  const options = {
    filterType: 'multiselect',
    onFilterChange: (_, filterList, type, changedColumnIndex) => {
      const selectedColumn = columns[changedColumnIndex ?? 0].name
      const filters = filterList[changedColumnIndex ?? 0]
      switch (selectedColumn) {
        case 'studentClass':
          setSelectedClasses(filters)
          break
        case 'studentSection':
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
        sortField: GetDueListSortFields[changedColumn],
        sortOrder: direction === 'desc' ? SortOrder.desc : SortOrder.asc
      })
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
    search: false,
    selectableRows: 'none',
    responsive: 'standard',
    download: false,
    print: false,
    viewColumns: false
  }

  const formatDueList = (dueList: DueListItem[]) => {
    return dueList.map((due) => {
      return {
        studentName: due.name,
        studentClass: due.class,
        studentSection: due.section,
        totalFeesDue: due.totalFeesDue,
        totalMiscDue: due.totalMiscDue,
        totalDue: due.totalDue
      }
    })
  }

  return (
    <div className="container mt-8 mb-8 flex justify-center">
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <MUIDataTable
        title="Due List"
        data={formatDueList(dueList)}
        columns={columns}
        options={options}
        className="w-11/12"
      />
    </div>
  )
}

export default DueList
