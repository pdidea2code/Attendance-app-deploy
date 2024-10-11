import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { deleteAttendance, getAttendance, getrole, minutesToHHMM } from 'src/redux/api/api'
import { ToastContainer, toast } from 'react-toastify'
import { CButton, CCol, CForm, CFormInput, CFormLabel, CRow, CSpinner } from '@coreui/react'
import 'react-toastify/dist/ReactToastify.css'

import MUIDataTable from 'mui-datatables'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'

const Attendance = () => {
  const [dataTableData, setDataTabledata] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const auth = useSelector((state) => state.auth)
  const [attendance, setAttendances] = useState([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm()

  const getattendance = async (date) => {
    try {
      setIsLoading(true)
      const res = await getAttendance(date)
      const data = res.data.info

      if (Array.isArray(data)) {
        const formattedData = await data.map((item) => ({
          ...item,
          modifyovertime: item.overtime ? minutesToHHMM(item.overtime) : '-',
          modifyworkingtime: item.workingtime ? minutesToHHMM(item.workingtime) : '-',

          modifyday: format(item.day, 'dd/MM/yyyy'),

          modifycheckin: item.checkin ? format(item.checkin, 'hh:mm a') : '-',

          modifycheckout: item.checkout ? format(item.checkout, 'hh:mm a') : '-',
          name: item.user_id.name,
          modifyuser_id: item.user_id._id,
          radius: parseFloat(item.radius).toFixed(2),
          //
        }))

        setDataTabledata(formattedData)
      }
      setIsLoading(false)
    } catch (error) {
      console.log(error)
      setIsLoading(false)
      toast.error(error.response?.data?.message || 'An error occurred')
    }
  }

  const onSubmit = (data) => {
    const info = data.date.split('-')
    const date = {
      year: info[0],
      month: info[1],
      date: info[2],
    }
    getattendance(date)
  }

  useEffect(() => {
    getrole(dispatch)
    setAttendances(auth.attendance || [])
  }, [])

  useEffect(() => {
    getattendance()
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
      name: '_id',
      label: 'checkin Lat,Long',
      options: {
        customBodyRender: (value) => {
          const editData = dataTableData.find((data) => data._id === value)
          return `${editData.checkinLatitude},${editData.checkinLongitude}`
        },
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
      name: '_id',
      label: 'checkout Lat,Long',
      options: {
        customBodyRender: (value) => {
          const editData = dataTableData.find((data) => data._id === value)
          return `${editData.checkoutLatitude},${editData.checkoutLongitude}`
        },
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
    {
      name: 'radius',
      label: 'radius',
      options: {
        filter: true,
        sort: true,
      },
    },
  ]

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
          {/* 
          {Array.isArray(attendance) && attendance.includes('attendance.add') && (
            <div className="right-text">
              <Button
                variant="contained"
                size="medium"
                className="AddButton"
                onClick={() => navigate('/attendanceform')}
              >
                Add
              </Button>
            </div>
          )} */}
          <CRow className="mb-3">
            <CCol md={12} xl={4}>
              <CForm className="row g-3" onSubmit={handleSubmit(onSubmit)}>
                <CCol md={12} xl={6}>
                  <CFormInput
                    type="date"
                    {...register('date', { required: 'date ise required' })}
                  />
                </CCol>
                <CCol md={12} xl={4}>
                  <CButton type="submit">Get</CButton>
                </CCol>
              </CForm>
            </CCol>
          </CRow>
          <MUIDataTable
            title={'Attendance'}
            data={dataTableData}
            columns={columns}
            options={options}
          />
        </>
      )}
    </>
  )
}

export default Attendance
