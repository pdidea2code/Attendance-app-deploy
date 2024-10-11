import { useEffect, useState } from 'react'
import {
  convertToDDMMYYYY,
  deleteMonth,
  deleteMultiMonth,
  getMonth,
  getrole,
} from 'src/redux/api/api'
import * as Icons from '@mui/icons-material'
import swal from 'sweetalert'
import { CSpinner } from '@coreui/react'
import { Button, IconButton } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import MUIDataTable from 'mui-datatables'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Month = () => {
  const [dataTableData, setDataTabledata] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const auth = useSelector((state) => state.auth)
  const [permission, setPermissions] = useState([])

  const getmonth = async () => {
    setIsLoading(true)
    try {
      const res = await getMonth()
      const data = res.data.info

      if (Array.isArray(data)) {
        const formattedData = data.map((item) => ({
          ...item,
          modifydate: convertToDDMMYYYY(item.date),
        }))

        setDataTabledata(formattedData)
      } else {
        setDataTabledata([])
      }
    } catch (error) {
      console.error(error)
      const errorMessage = error.response?.data?.message || 'An error occurred'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const fetchPermissions = async () => {
      await getrole(dispatch)
      setPermissions(auth.permission)
    }
    fetchPermissions()
  }, [])
  useEffect(() => {
    getmonth()
  }, [])

  const columns = [
    {
      name: 'day',
      label: 'day',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'month',
      label: 'month',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'year',
      label: 'year',
      options: {
        filter: true,
        sort: true,
      },
    },
  ]

  if (
    (Array.isArray(permission) && permission.includes('month.delete')) ||
    permission.includes('month.edit')
  ) {
    columns.push({
      name: '_id',
      label: 'Action',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value) => {
          return (
            <>
              {Array.isArray(permission) && permission.includes('month.edit') && (
                <Icons.EditRounded
                  className="editButton"
                  onClick={() => {
                    const editData = dataTableData.find((data) => data._id === value)
                    navigate('/monthform', {
                      state: { editData: editData },
                    })
                  }}
                ></Icons.EditRounded>
              )}
              {Array.isArray(permission) && permission.includes('month.delete') && (
                <Icons.DeleteRounded
                  className="deleteButton"
                  onClick={async () => {
                    const confirm = await swal({
                      title: 'Are you sure?',
                      text: 'Are you sure? Want to delete announcement?',
                      icon: 'warning',
                      buttons: ['No, cancel it!', 'Yes, I am sure!'],
                      dangerMode: true,
                    })
                    if (confirm) {
                      deleteMonth(value)
                        .then(() => {
                          getmonth()
                          toast.success('Deleted successfully!')
                          swal({
                            title: 'Deleted successfully!',
                            icon: 'success',
                            button: 'close',
                          })
                        })
                        .catch((error) => {
                          console.log(error)
                          const errorMsg = error.response?.data?.message || 'Something went wrong'
                          toast.error(errorMsg)
                        })
                    }
                  }}
                />
              )}
            </>
          )
        },
      },
    })
  }

  const deleteMultiple = async (selectedRows) => {
    const ids = selectedRows.data.map((row) => dataTableData[row.dataIndex]._id)
    const confirm = await swal({
      title: 'Are you sure?',
      text: 'Are you sure that you want to delete selected Month?',
      icon: 'warning',
      buttons: ['No, cancel it!', 'Yes, I am sure!'],
      dangerMode: true,
    })

    if (confirm) {
      // console.log(ids)
      const data = {
        ids: ids,
      }

      deleteMultiMonth(data)
        .then(() => {
          getmonth()
          toast.success('Deleted successfully!', {
            key: ids.join(','),
          })
        })
        .catch((error) => {
          toast.error(error.response?.data?.message || 'Something went wrong')
        })
    }
  }

  const SelectedRowsToolbar = ({ selectedRows }) => {
    return (
      <div>
        <IconButton onClick={() => deleteMultiple(selectedRows)}>
          <Icons.Delete />
        </IconButton>
      </div>
    )
  }

  const options = {
    customToolbarSelect: (selectedRows) =>
      Array.isArray(permission) &&
      permission.includes('month.delete') && <SelectedRowsToolbar selectedRows={selectedRows} />,
  }

  return (
    <>
      {isLoading ? (
        <div className="d-flex justify-content-center">
          <CSpinner className="theme-spinner-color" />
        </div>
      ) : (
        <>
          <ToastContainer />
          {Array.isArray(permission) && permission.includes('month.add') && (
            <div className="right-text">
              <Button
                variant="contained"
                size="medium"
                className="AddButton"
                onClick={() => navigate('/monthform')}
              >
                Add
              </Button>
            </div>
          )}
          <MUIDataTable title={'Month'} data={dataTableData} columns={columns} options={options} />
        </>
      )}
    </>
  )
}

export default Month
