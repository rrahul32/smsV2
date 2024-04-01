import { getPaymentList } from '@/api'
import { PaymentReceiptDialog } from '@/components'
import { useAuth, useSnackbar } from '@/contexts'
import { Backdrop, Button, CircularProgress } from '@mui/material'
import { GetPaymentListSortFields, PaymentTypes, SortOrder } from '@shared/constants'
import { Payment, Student } from '@shared/types'
import MUIDataTable from 'mui-datatables'
import { useEffect, useState } from 'react'

const PaymentList: React.FC = () => {
  const [payments, setPayments] = useState<
    (Payment & { student?: Pick<Student, '_id' | 'name' | 'class' | 'section'> })[]
  >([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [selectedTypes, setSelectedTypes] = useState<PaymentTypes[]>([])
  const [totalCount, setTotalCount] = useState<number>(0)
  const [sort, setSort] = useState({
    field: GetPaymentListSortFields.createdAt,
    sortOrder: SortOrder.desc
  })
  const [paginationMeta, setPaginationMeta] = useState({
    limit: 10,
    page: 0
  })

  const { userInfo } = useAuth()

  const { error } = useSnackbar()

  useEffect(() => {
    return () => {
      setSelectedTypes([])
      setSort({
        field: GetPaymentListSortFields.createdAt,
        sortOrder: SortOrder.desc
      })
      setTotalCount(0)
      setPaginationMeta({
        limit: 10,
        page: 0
      })
    }
  }, [])

  useEffect(() => {
    setIsLoading(true)
    if (userInfo) {
      getPaymentList({
        userId: userInfo.id,
        filter: {
          types: selectedTypes
        },
        sort,
        limit: paginationMeta.limit,
        page: paginationMeta.page
      })
        .then((res) => {
          if (res.result) {
            setPayments(res.result.list)
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
  }, [selectedTypes, sort, paginationMeta])

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
      name: 'studentName',
      label: 'Name',
      options: {
        filter: false,
        sort: false
      }
    },
    {
      name: 'studentClass',
      label: 'Class',
      options: {
        filter: false,
        sort: false
      }
    },
    {
      name: 'studentSection',
      label: 'Section',
      options: {
        filter: false,
        sort: false
      }
    },
    {
      name: 'type',
      label: 'Type',
      options: {
        filterOptions: {
          names: Object.values(PaymentTypes),
          filterType: 'dropdown'
        }
      }
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
    filterType: 'multiselect',
    onFilterChange: (_, filterList, type, changedColumnIndex) => {
      const selectedColumn = columns[changedColumnIndex ?? 0].name
      const filters = filterList[changedColumnIndex ?? 0]
      switch (selectedColumn) {
        case 'type':
          setSelectedTypes(filters)
          break
        default:
          if (type === 'reset') {
            setSelectedTypes([])
          }
          break
      }
    },
    onColumnSortChange: (changedColumn, direction) => {
      setSort({
        field: GetPaymentListSortFields[changedColumn],
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

  const formatPayments = (
    payments: (Payment & { student?: Pick<Student, '_id' | 'name' | 'class' | 'section'> })[]
  ) => {
    return payments.map((payment) => {
      return {
        studentName: payment.student?.name,
        studentClass: payment.student?.class,
        studentSection: payment.student?.section,
        type: payment.type,
        amount: payment.amount,
        createdAt: payment.createdAt
      }
    })
  }

  const selectedPayment =
    typeof selectedIndex === 'number' && payments.length ? payments[selectedIndex] : null

  return (
    <div className="container mt-8 mb-8">
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <PaymentReceiptDialog
        open={isOpen}
        onClose={handleDetailsClose}
        payments={selectedPayment ? [selectedPayment] : []}
        student={selectedPayment?.student}
      />
      <div className="flex justify-center">
        <MUIDataTable
          title="Payments"
          data={formatPayments(payments)}
          columns={columns}
          options={options}
          className="w-11/12"
        />
      </div>
    </div>
  )
}

export default PaymentList
