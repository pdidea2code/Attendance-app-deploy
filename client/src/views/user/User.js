import { useEffect, useState } from 'react'
import * as Icons from '@mui/icons-material'
import swal from 'sweetalert'
import Cookies from 'js-cookie'
import { CSpinner } from '@coreui/react'
import { Button, IconButton } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import MUIDataTable from 'mui-datatables'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { deleteAdmin, deleteMultiAdmin, getAllAdmins, getrole } from 'src/redux/api/api'

const User = () => {
  const [dataTableData, setDataTabledata] = useState([])
  const [baseUrl, setBaseUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const auth = useSelector((state) => state.auth)
  const [permission, setPermissions] = useState([])

  const getUsers = async () => {
    setIsLoading(true)
    try {
      const res = await getAllAdmins()
      const data = res.data.info
      setDataTabledata(data)
      setBaseUrl(res.data.baseUrl)
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || 'An error occurred')
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
    getUsers()
  }, [])
  const columns = [
    {
      name: 'name',
      label: 'Name',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'email',
      label: 'Email',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'role_name',
      label: 'Role',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'image',
      label: 'Image',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (image) =>
          image && (
            <img
              src={`${baseUrl}${image}`}
              alt={image}
              style={{ height: '60px', width: '60px', borderRadius: '50%' }}
            />
          ),
      },
    },
  ]

  if (
    (Array.isArray(permission) && permission.includes('admin.delete')) ||
    permission.includes('admin.edit')
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
              {Array.isArray(permission) && permission.includes('admin.edit') && (
                <Icons.EditRounded
                  className="editButton"
                  onClick={() => {
                    const editData = dataTableData.find((data) => data._id === value)
                    navigate('/userform', {
                      state: { editData: editData, imageUrl: baseUrl },
                    })
                  }}
                ></Icons.EditRounded>
              )}
              {Array.isArray(permission) && permission.includes('admin.delete') && (
                <Icons.DeleteRounded
                  className="deleteButton"
                  onClick={async () => {
                    const confirm = await swal({
                      title: 'Are you sure?',
                      text: 'Are you sure? Want to delete employee?',
                      icon: 'warning',
                      buttons: ['No, cancel it!', 'Yes, I am sure!'],
                      dangerMode: true,
                    })
                    if (confirm) {
                      deleteAdmin(value)
                        .then(() => {
                          getUsers()
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
      text: 'Are you sure that you want to delete selected User?',
      icon: 'warning',
      buttons: ['No, cancel it!', 'Yes, I am sure!'],
      dangerMode: true,
    })

    if (confirm) {
      // console.log(ids)
      const data = {
        ids: ids,
      }
      deleteMultiAdmin(data)
        .then(() => {
          getUsers()
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
      permission.includes('admin.delete') && <SelectedRowsToolbar selectedRows={selectedRows} />,
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
          {Array.isArray(permission) && permission.includes('admin.add') && (
            <div className="right-text">
              <Button
                variant="contained"
                size="medium"
                className="AddButton"
                onClick={() => navigate('/userform')}
              >
                Add
              </Button>
            </div>
          )}
          <MUIDataTable title={'User'} data={dataTableData} columns={columns} options={options} />
        </>
      )}
    </>
  )
}

export default User
