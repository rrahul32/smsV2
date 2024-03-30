import { getDueList } from '@/api'
import { useAuth, useSnackbar } from '@/contexts'
import { CircularProgress } from '@mui/material'
import { DueListItem } from '@shared/types'
import MUIDataTable from 'mui-datatables'
import { useEffect, useState } from 'react'

const DueList: React.FC = () => {
  const [dueList, setDueList] = useState<DueListItem[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { userInfo } = useAuth()

  const { error } = useSnackbar()

  useEffect(() => {
    setIsLoading(true)
    if (userInfo) {
      getDueList({
        userId: userInfo?.id
      })
        .then((res) => {
          if (res.result) {
            setDueList(res.result.list)
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
  }, [])

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
      name: 'studentName',
      label: 'Name',
      options: {
        filter: false
      }
    },
    {
      name: 'studentClass',
      label: 'Class'
    },
    {
      name: 'studentSection',
      label: 'Section',
      options: {
        filter: false
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
    filter: true,
    search: true,
    pagination: true,
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

  return isLoading ? (
    <CircularProgress color="primary" />
  ) : (
    <div className="container mt-8 mb-8 flex justify-center">
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
