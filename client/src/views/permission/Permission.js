import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { deletePermission, getPermission, getrole } from 'src/redux/api/api'
import { ToastContainer, toast } from 'react-toastify'
import { CSpinner } from '@coreui/react'
import 'react-toastify/dist/ReactToastify.css'
import * as Icons from '@mui/icons-material'
import swal from 'sweetalert'
import { Button } from '@mui/material'
import MUIDataTable from 'mui-datatables'

const Permission = () => {
  const [dataTableData, setDataTabledata] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const auth = useSelector((state) => state.auth)
  const [permission, setPermissions] = useState([])

  const getpermission = async () => {
    try {
      setIsLoading(true)
      const res = await getPermission()
      const data = res.data.info
      setIsLoading(false)
      setDataTabledata(data)
    } catch (error) {
      console.log(error)
      setIsLoading(false)
      toast.error(error.response?.data?.message || 'An error occurred')
    }
  }

  useEffect(() => {
    getrole(dispatch)
    setPermissions(auth.permission || [])
  }, [])

  useEffect(() => {
    getpermission()
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
  ]

  if (Array.isArray(permission) && permission.includes('permission.delete')) {
    columns.push({
      name: '_id',
      label: 'Action',
      options: {
        customBodyRender: (value) => {
          return (
            <>
              <Icons.DeleteRounded
                className="deleteButton"
                onClick={async () => {
                  const confirm = await swal({
                    title: 'Are you sure?',
                    text: 'Are you sure? Want to delete permission?',
                    icon: 'warning',
                    buttons: ['No, cancel it!', 'Yes, I am sure!'],
                    dangerMode: true,
                  })
                  if (confirm) {
                    deletePermission(value)
                      .then(() => {
                        getpermission()
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
            </>
          )
        },
      },
    })
  }

  const options = { selectableRows: 'none', onRowsDelete: false }

  return (
    <>
      {isLoading ? (
        <div className="d-flex justify-content-center">
          <CSpinner className="theme-spinner-color" />
        </div>
      ) : (
        <>
          <ToastContainer />

          {Array.isArray(permission) && permission.includes('permission.add') && (
            <div className="right-text">
              <Button
                variant="contained"
                size="medium"
                className="AddButton"
                onClick={() => navigate('/permissionform')}
              >
                Add
              </Button>
            </div>
          )}
          <MUIDataTable
            title={'Permission'}
            data={dataTableData}
            columns={columns}
            options={options}
          />
        </>
      )}
    </>
  )
}

export default Permission
