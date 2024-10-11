import { useEffect, useState } from 'react'
import { getAllEmplloyee, getrole } from 'src/redux/api/api'
import * as Icons from '@mui/icons-material'
import swal from 'sweetalert'
import { CSpinner } from '@coreui/react'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import MUIDataTable from 'mui-datatables'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Employee = () => {
  const [dataTableData, setDataTabledata] = useState([])
  const [baseUrl, setBaseUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const auth = useSelector((state) => state.auth)
  const [permission, setPermissions] = useState([])

  const getemployee = async () => {
    setIsLoading(true)
    try {
      const res = await getAllEmplloyee()
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
    getemployee()
  }, [])

  const columns = [
    {
      name: 'user_id',
      label: 'user_id',
      options: {
        filter: true,
        sort: true,
      },
    },
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
      name: 'phoneno',
      label: 'Phoneno',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'position',
      label: 'Position',
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
    (Array.isArray(permission) && permission.includes('employee.delete')) ||
    permission.includes('employee.edit') ||
    permission.includes('employee.profile')
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
              {Array.isArray(permission) && permission.includes('employee.edit') && (
                <Icons.EditRounded
                  className="editButton"
                  onClick={() => {
                    const editData = dataTableData.find((data) => data._id === value)
                    navigate('/employeeform', {
                      state: { editData: editData, imageUrl: baseUrl },
                    })
                  }}
                ></Icons.EditRounded>
              )}
              {Array.isArray(permission) && permission.includes('employee.delete') && (
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
                      deletePermission(value)
                        .then(() => {
                          getemployee()
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
              {Array.isArray(permission) && permission.includes('employee.profile') && (
                <Icons.AccountBoxRounded
                  className="editButton"
                  onClick={() => {
                    const editData = dataTableData.find((data) => data._id === value)
                    navigate('/employeeprofile', {
                      state: { editData: editData, imageUrl: baseUrl },
                    })
                  }}
                ></Icons.AccountBoxRounded>
              )}
            </>
          )
        },
      },
    })
  }

  const options = {}

  return (
    <>
      {isLoading ? (
        <div className="d-flex justify-content-center">
          <CSpinner className="theme-spinner-color" />
        </div>
      ) : (
        <>
          <ToastContainer />
          {Array.isArray(permission) && permission.includes('employee.add') && (
            <div className="right-text">
              <Button
                variant="contained"
                size="medium"
                className="AddButton"
                onClick={() => navigate('/employeeform')}
              >
                Add
              </Button>
            </div>
          )}
          <MUIDataTable
            title={'Employee'}
            data={dataTableData}
            columns={columns}
            options={options}
          />
        </>
      )}
    </>
  )
}

export default Employee
