import {
  CCard,
  CCardBody,
  CCardHeader,
  CCardFooter,
  CCol,
  CContainer,
  CImage,
  CRow,
  CButton,
  CForm,
  CFormInput,
  CFormFeedback,
} from '@coreui/react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { getrole, getTotalAttendance, minutesToHHMM } from 'src/redux/api/api'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Employeeattendance from './Employeeattendance'

import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import Employeeleave from './Employeeleave'

const Employeeprofile = () => {
  const { state } = useLocation()
  const [employeedetail, setEmployeedetail] = useState({})
  const [image, setImage] = useState('')
  const navigate = useNavigate()
  const [permission, setPermissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()
  const auth = useSelector((state) => state.auth)
  const [attendance, setAttendance] = useState({})
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm()

  function formatDateToDDMMYYYY(isoDate) {
    const date = new Date(isoDate)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const gettotalattendance = async (data = null) => {
    setIsLoading(true)
    try {
      const req = {
        id: state.editData._id,
      }

      if (data && data.date) {
        const info = data.date.split('-')
        setMonth(info[1])
        setYear(info[0])
        req.month = info[1]
        req.year = info[0]
      }

      const res = await getTotalAttendance(req)

      const infom = {
        totalhour: minutesToHHMM(res.data.info.totalhour),
        totalworkingtime: minutesToHHMM(res.data.info.totalworkingtime),
        totoalovertime: minutesToHHMM(res.data.info.totoalovertime),
        totoalattengance: res.data.info.totoalattengance,
        workingdays: res.data.info.workingdays,
        daysInMonth: res.data.info.daysInMonth,
      }

      setAttendance(infom)

      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.log(error)
      const errorMsg = error.response?.data?.message || 'Something went wrong'
      toast.error(errorMsg)
    }
  }

  const onSubmit = async (data) => {
    gettotalattendance(data)
    const info = data.date.split('-')
    setMonth(info[1])
    setYear(info[0])
  }

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        await getrole(dispatch)
        setPermissions(auth.permission)
        if (Array.isArray(permission) && permission.includes('attendance.view')) {
          gettotalattendance()
        }
      } catch (error) {
        toast.error('Failed to fetch permissions.')
      } finally {
        setLoading(false)
      }
    }

    fetchPermissions()
  }, [])

  useEffect(() => {
    if (state && state.editData) {
      setEmployeedetail(state.editData)
      setImage(state.imageUrl + state.editData.image)
    } else {
      navigate('/employee')
      return null // Ensure the component doesn't render anything if navigation occurs
    }
  }, [state, navigate])

  useEffect(() => {
    if (Array.isArray(auth.permission) && auth.permission.includes('attendance.view')) {
      gettotalattendance()
    }

    setValue('date', format(new Date(), 'yyyy-MM'))
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <>
      {Array.isArray(permission) && permission.includes('employee.profile') && (
        <CContainer>
          <ToastContainer />
          <CRow className="justify-content-center">
            <CCol md={12} xl={6}>
              <CCard className="mb-4 shadow-sm">
                <CCardHeader className="bg-primary text-white text-center">
                  Employee Profile
                </CCardHeader>
                <CCardBody>
                  <CRow>
                    <CCol md={12} xl={4} className="text-center mb-3">
                      <CImage
                        src={image}
                        alt="Employee"
                        className="img-fluid rounded-circle shadow-lg"
                        style={{
                          transition: 'transform 0.3s ease',
                          width: '150px',
                          height: '150px',
                        }}
                        onMouseOver={(e) => (e.target.style.transform = 'scale(1.1)')}
                        onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}
                      />
                    </CCol>
                    <CCol md={12} xl={8}>
                      <CRow>
                        <CCol md={12} className="mb-3">
                          <h5>
                            <strong>Name:</strong> {employeedetail?.name}
                          </h5>
                        </CCol>
                        <CCol md={12} className="mb-3">
                          <h6>
                            <strong>Email:</strong> {employeedetail?.email}
                          </h6>
                        </CCol>
                        <CCol md={12} className="mb-3">
                          <h6>
                            <strong>Phone no.:</strong> {employeedetail?.phoneno}
                          </h6>
                        </CCol>
                        <CCol md={12} className="mb-3">
                          <h6>
                            <strong>Position:</strong> {employeedetail?.position}
                          </h6>
                        </CCol>
                        <CCol md={12} className="mb-3">
                          <h6>
                            <strong>Employee ID:</strong> {employeedetail?.user_id}
                          </h6>
                        </CCol>
                        <CCol md={12} className="mb-3">
                          <h6>
                            <strong>Account Open Date:</strong>{' '}
                            {formatDateToDDMMYYYY(employeedetail?.createdAt)}
                          </h6>
                        </CCol>
                      </CRow>
                    </CCol>
                  </CRow>
                </CCardBody>
                <CCardFooter className="text-center">
                  {Array.isArray(permission) && permission.includes('employee.edit') && (
                    <CButton
                      color="info"
                      className="text-white me-2"
                      onClick={() =>
                        navigate('/employeeform', {
                          state: { editData: state.editData, imageUrl: state.imageUrl },
                        })
                      }
                    >
                      Edit Profile
                    </CButton>
                  )}
                </CCardFooter>
              </CCard>
            </CCol>
            {Array.isArray(permission) && permission.includes('attendance.view') && (
              <CCol md={12} xl={6}>
                <CCard className="mb-4 shadow-sm">
                  <CCardHeader className="bg-primary text-white text-center">
                    Employee Attendance
                  </CCardHeader>
                  <CCardBody>
                    <CRow>
                      <CCol md={12} xl={12} className="mb-3">
                        <CForm className="row g-3" onSubmit={handleSubmit(onSubmit)}>
                          <CCol md={8} xl={8}>
                            <CFormInput
                              type="month"
                              {...register('date', { required: 'month is required' })}
                              invalid={!!errors.date}
                              // max={Date.now()}
                            />
                            <CFormFeedback invalid>{errors.date?.message}</CFormFeedback>
                          </CCol>
                          <CCol md={4} xl={4}>
                            <CButton type="submit"> Get</CButton>
                          </CCol>
                        </CForm>
                      </CCol>
                      <CCol md={12} className="mb-3">
                        <h6>
                          <strong>Total Hour:</strong> {attendance?.totalhour} hrs
                        </h6>
                      </CCol>
                      <CCol md={12} className="mb-3">
                        <h6>
                          <strong>Total Working Time:</strong> {attendance?.totalworkingtime} hrs
                        </h6>
                      </CCol>
                      <CCol md={12} className="mb-3">
                        <h6>
                          <strong>Total Overtime:</strong> {attendance?.totoalovertime} hrs
                        </h6>
                      </CCol>
                      <CCol md={12} className="mb-3">
                        <h6>
                          <strong>Total Days:</strong> {attendance?.daysInMonth} Days
                        </h6>
                      </CCol>
                      <CCol md={12} className="mb-3">
                        <h6>
                          <strong>Working Days:</strong> {attendance?.workingdays} Days
                        </h6>
                      </CCol>
                      <CCol md={12} className="mb-3">
                        <h6>
                          <strong>Total Attendance:</strong> {attendance?.totoalattengance} Days
                        </h6>
                      </CCol>
                    </CRow>
                  </CCardBody>
                </CCard>
              </CCol>
            )}

            {Array.isArray(permission) && permission.includes('attendance.view') && (
              <CCol md={12} xl={12} className="mb-4">
                <Employeeattendance props={{ id: employeedetail._id, month: month, year: year }} />
              </CCol>
            )}
            {Array.isArray(permission) && permission.includes('leave.view') && (
              <div id="leave">
                <CCol md={12} xl={12}>
                  <Employeeleave props={{ id: employeedetail._id }} />
                </CCol>
              </div>
            )}
          </CRow>
        </CContainer>
      )}
    </>
  )
}

export default Employeeprofile
