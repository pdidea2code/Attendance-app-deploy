import { useEffect, useState } from 'react'
import { changeStatus, convertToDDMMYYYY, getrole, getUserLeave } from 'src/redux/api/api'
import * as Icons from '@mui/icons-material'
import swal from 'sweetalert'
import { CButton, CSpinner } from '@coreui/react'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import MUIDataTable from 'mui-datatables'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import changeState from 'src/redux/reducer/changeState'

const Employeeleave = ({ props }) => {
  const [dataTableData, setDataTabledata] = useState([])
  const [baseUrl, setBaseUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const auth = useSelector((state) => state.auth)
  const [permission, setPermissions] = useState([])
  const { id } = props

  const attendance = async () => {
    // setIsLoading(true)
    try {
      const req = { id: id }
      const res = await getUserLeave(req)
      const data = res.data.info
      if (Array.isArray(data)) {
        const formattedData = await data.map((item) => ({
          ...item,
          modifydate: convertToDDMMYYYY(item.date),
          modifytodate: item.todate ? convertToDDMMYYYY(item.todate) : '-',
          modifyhour: item.hour ? `${item.hour} Hour ` : '-',
          modifyapprovebyname: item.approvebyname ? item.approvebyname : '-',
        }))
        // console.log(formattedData)
        setDataTabledata(formattedData)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const changestatus = async (data, status) => {
    try {
      const req = {
        id: data._id,
        status: status,
      }
      const res = await changeStatus(req)
      console.log(res)
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || 'An error occurred')
    } finally {
      attendance()
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
    attendance()
  }, [])

  const columns = [
    {
      name: 'modifydate',
      label: 'date',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'modifytodate',
      label: 'todate',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'modifyhour',
      label: 'hour',
      options: {
        filter: true,
        sort: true,
      },
    },

    {
      name: 'type',
      label: 'type',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'levaetype',
      label: 'levaetype',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'day',
      label: 'day',
      options: {
        filter: true,
        sort: true,
      },
    },

    {
      name: 'reson',
      label: 'reson',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'modifyapprovebyname',
      label: 'approveby',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'status',
      label: 'status',
      options: {
        filter: true,
        sort: true,
        customBodyRender: (status) => {
          if (status === 'Pending') {
            return (
              <p
                style={{
                  background: '#ffc800',
                  color: 'black',
                  borderRadius: '20px',
                  textAlign: 'center',
                  padding: '4px',
                }}
              >
                {status}
              </p>
            )
          } else if (status === 'Rejected') {
            return (
              <p
                style={{
                  background: 'red',
                  color: 'black',
                  borderRadius: '20px',
                  textAlign: 'center',
                  padding: '4px',
                }}
              >
                {status}
              </p>
            )
          } else if (status === 'Approved') {
            return (
              <p
                style={{
                  background: '#00ff00',
                  color: 'black',
                  borderRadius: '20px',
                  textAlign: 'center',
                  padding: '4px',
                }}
              >
                {status}
              </p>
            )
          }
          return null // return null for any other status
        },
      },
    },
  ]

  if (Array.isArray(permission) && permission.includes('leave.edit')) {
    columns.push({
      name: '_id',
      label: 'Action',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value) => {
          const editData = dataTableData.find((data) => data._id === value)

          if (editData.status === 'Approved') {
            return (
              <>
                <CButton
                  className="me-1 mb-1"
                  style={{ padding: '5px', background: 'red', color: 'black' }}
                  onClick={() => {
                    changestatus(editData, 'Rejected')
                  }}
                >
                  Reject
                </CButton>
                <CButton
                  style={{ padding: '5px', background: '#ffc800', color: 'black' }}
                  onClick={() => {
                    changestatus(editData, 'Pending')
                  }}
                >
                  Pending
                </CButton>
              </>
            )
          } else if (editData.status === 'Rejected') {
            return (
              <>
                <CButton
                  className="me-1 mb-1"
                  style={{ padding: '5px', background: '#00ff00', color: 'black' }}
                  onClick={() => {
                    changestatus(editData, 'Approved')
                  }}
                >
                  Approv
                </CButton>
                <CButton
                  style={{ padding: '5px', background: '#ffc800', color: 'black' }}
                  onClick={() => {
                    changestatus(editData, 'Pending')
                  }}
                >
                  Pending
                </CButton>
              </>
            )
          } else if (editData.status === 'Pending') {
            return (
              <>
                <CButton
                  className="me-1 mb-1"
                  style={{ padding: '5px', background: '#00ff00', color: 'black' }}
                  onClick={() => {
                    changestatus(editData, 'Approved')
                  }}
                >
                  Approv
                </CButton>
                <CButton
                  style={{ padding: '5px', background: 'red', color: 'black' }}
                  onClick={() => {
                    changestatus(editData, 'Rejected')
                  }}
                >
                  Reject
                </CButton>
              </>
            )
          }
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
          {/* {Array.isArray(permission) && permission.includes('leave.add') && (
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
          )} */}
          <MUIDataTable
            title={'Leave'}
            data={dataTableData}
            columns={columns}
            options={options}
            id="leave"
          />
        </>
      )}
    </>
  )
}

export default Employeeleave
