import { CButton, CSpinner } from '@coreui/react'
import MUIDataTable from 'mui-datatables'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { changeStatus, convertToDDMMYYYY, getLeaveRequest, getRole } from 'src/redux/api/api'
const Leaverequest = () => {
  const [dataTableData, setDataTabledata] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()
  const auth = useSelector((state) => state.auth)
  const [permission, setPermissions] = useState([])
  const Leaverequests = async () => {
    try {
      const res = await getLeaveRequest()
      const data = res.data.info
      // console.log(data)
      if (Array.isArray(data)) {
        const formattedData = await data.map((item) => ({
          ...item,
          modifydate: convertToDDMMYYYY(item.date),
          modifytodate: item.todate ? convertToDDMMYYYY(item.todate) : '-',
          modifyhour: item.hour ? `${item.hour} Hour ` : '-',
          modifyapprovebyname: item.approvebyname ? item.approvebyname : '-',
          modiftuser_id: item.user_id.user_id ? item.user_id.user_id : '-',
          username: item.user_id.name ? item.user_id.name : '-',
        }))
        // console.log(formattedData)
        setDataTabledata(formattedData)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || 'An error occurred')
    }
  }

  const changestatus = async (data, status) => {
    try {
      const req = {
        id: data._id,
        status: status,
      }
      const res = await changeStatus(req)
      // console.log(res)
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || 'An error occurred')
    } finally {
      Leaverequests()
    }
  }

  useEffect(() => {
    const fetchPermissions = async () => {
      await getRole(dispatch)
      setPermissions(auth.permission)
    }
    fetchPermissions()
  }, [])
  useEffect(() => {
    Leaverequests()
  }, [])

  const columns = [
    {
      name: 'modiftuser_id',
      label: 'user_id',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'username',
      label: 'name',
      options: {
        filter: true,
        sort: true,
      },
    },
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

  const options = { rowsPerPage: 5, rowsPerPageOptions: [5, 10, 15, 20] }
  return (
    <>
      {isLoading ? (
        <div className="d-flex justify-content-center">
          <CSpinner className="theme-spinner-color" />
        </div>
      ) : (
        <MUIDataTable title={'Leave'} data={dataTableData} columns={columns} options={options} />
      )}
    </>
  )
}

export default Leaverequest
