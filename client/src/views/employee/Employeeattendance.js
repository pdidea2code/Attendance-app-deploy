import { getUserAttendance, minutesToHHMM } from 'src/redux/api/api'
import { useEffect, useState } from 'react'
import * as Icons from '@mui/icons-material'
import swal from 'sweetalert'
import { CSpinner } from '@coreui/react'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import MUIDataTable from 'mui-datatables'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { format } from 'date-fns'

const Employeeattendance = ({ props }) => {
  const [dataTableData, setDataTabledata] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const auth = useSelector((state) => state.auth)
  const { id, month, year } = props

  const getemployeeattendance = async () => {
    setIsLoading(true)
    try {
      const datas = {
        id: id,
      }

      if (month) {
        datas.month = month
      }

      if (year) {
        datas.year = year
      }

      const res = await getUserAttendance(datas)
      const data = res.data.info

      if (Array.isArray(data)) {
        const formattedData = await data.map((item) => ({
          ...item,
          modifyovertime: item.overtime ? minutesToHHMM(item.overtime) : '-',
          modifyworkingtime: item.workingtime ? minutesToHHMM(item.workingtime) : '-',

          modifyday: format(item.day, 'dd/MM/yyyy'),

          modifycheckin: item.checkin ? format(item.checkin, 'hh:mm a') : '-',

          modifycheckout: item.checkout ? format(item.checkout, 'hh:mm a') : '-',

          //
        }))

        setDataTabledata(formattedData)
      }
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getemployeeattendance()
  }, [id, month, year])

  const columns = [
    {
      name: 'modifyday',
      label: 'day',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'modifycheckin',
      label: 'checkin',
      options: {
        filter: true,
        sort: true,
      },
    },

    {
      name: 'modifycheckout',
      label: 'checkout',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'location',
      label: 'location',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'modifyworkingtime',
      label: 'workingtime',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'modifyovertime',
      label: 'overtime',
      options: {
        filter: true,
        sort: true,
      },
    },
  ]

  const options = {}

  return (
    <>
      <div id="attendance">
        {isLoading ? (
          <div className="d-flex justify-content-center">
            <CSpinner className="theme-spinner-color" />
          </div>
        ) : (
          <>
            <ToastContainer />

            <MUIDataTable
              title={'Attendance'}
              data={dataTableData}
              columns={columns}
              options={options}
            />
          </>
        )}
      </div>
    </>
  )
}

export default Employeeattendance
