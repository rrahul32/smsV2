import MUIDataTable from 'mui-datatables'

const StudentsList: React.FC = () => {
  const data = [
    { ID: 1, Name: 'John Doe', Age: 20, Grade: 'A' },
    { ID: 1, Name: 'John Doe', Age: 20, Grade: 'A' },
    { ID: 1, Name: 'John Doe', Age: 20, Grade: 'A' },
    { ID: 1, Name: 'John Doe', Age: 20, Grade: 'A' }
  ]

  const columns = [{ name: 'ID' }, { name: 'Name' }, { name: 'Age' }, { name: 'Grade' }]

  const options = {
    filter: false,
    search: false,
    pagination: false,
    selectableRows: 'none',
    responsive: 'standard',
    download: false,
    print: false,
    viewColumns: false
  }

  return (
    <div className="container mx-auto mt-8">
      <MUIDataTable title="Students" data={data} columns={columns} options={options} />
    </div>
  )
}

export default StudentsList
