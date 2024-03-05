import { getPaymentList } from '@/api'
import { PaymentReceiptDialog } from '@/components'
import { useSnackbar } from '@/contexts'
import { Button, CircularProgress } from '@mui/material'
import { Payment, Student } from '@shared/types'
import MUIDataTable from 'mui-datatables'
import { useEffect, useState } from 'react'

const PaymentList: React.FC = () => {
  const [payments, setPayments] = useState<(Payment & { student: Student })[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const { error } = useSnackbar()

  useEffect(() => {
    setIsLoading(true)
    getPaymentList()
      .then((res) => {
        if (res.result) {
          setPayments(res.result.list)
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
    filter: true,
    search: true,
    pagination: true,
    selectableRows: 'none',
    responsive: 'standard',
    download: false,
    print: false,
    viewColumns: false
  }

  const formatPayments = (payments: (Payment & { student: Student })[]) => {
    return payments.map((payment) => {
      return {
        studentName: payment.student.name,
        studentClass: payment.student.class,
        studentSection: payment.student.section,
        type: payment.type,
        amount: payment.amount,
        createdAt: payment.createdAt
      }
    })
  }

  const selectedPayment =
    typeof selectedIndex === 'number' && payments.length ? payments[selectedIndex] : null
  console.log('🚀 ~ selectedPayment:', selectedPayment)

  return isLoading ? (
    <CircularProgress color="primary" />
  ) : (
    <div className="container mt-8 mb-8">
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
