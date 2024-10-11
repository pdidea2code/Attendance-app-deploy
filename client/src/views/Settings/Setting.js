import { useEffect, useState } from 'react'
import { getRole, getSetting, updateSetting } from 'src/redux/api/api'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import swal from 'sweetalert'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CForm,
  CFormFeedback,
  CFormInput,
  CFormLabel,
  CInputGroup,
  CInputGroupText,
  CRow,
  CSpinner,
} from '@coreui/react'

const Setting = () => {
  const [setting, setSetting] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [permission, setPermissions] = useState([])
  const auth = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm()

  const getsetting = async () => {
    try {
      setIsLoading(true)
      const res = await getSetting()
      const data = res.data.info

      setIsLoading(false)
      setValue('workingtime', data.workingtime)
      setValue('breaktime', data.breaktime)
      setValue('rediusmiter', data.rediusmiter)
      setSetting(data)
    } catch (error) {
      console.log(error)
      setIsLoading(false)
      toast.error(error.response?.data?.message || 'An error occurred')
    }
  }

  const onSubmit = async (data) => {
    try {
      setIsLoading(true)
      const res = await updateSetting(data)
      getsetting()
      setIsLoading(false)
      toast.success('Update Successfully')
    } catch (error) {
      console.log(error)
      setIsLoading(false)
      toast.error(error.response?.data?.message || 'An error occurred')
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
    getsetting()
  }, [])

  return (
    <>
      <div className="bg-light min-vh-100">
        <ToastContainer />
        <CContainer className="mt-3">
          <CRow>
            <CCol md={6}>
              <CCard>
                <CCardHeader>Setting Form</CCardHeader>
                <CCardBody>
                  <CForm className="row g-3" onSubmit={handleSubmit(onSubmit)}>
                    <CCol xl={8} md={12}>
                      <CFormLabel> Working Time</CFormLabel>
                      <CInputGroup>
                        <CFormInput
                          type="text"
                          placeholder="Working Time in minutes"
                          {...register('workingtime', { required: 'Working Time is required' })}
                          invalid={!!errors.workingtime}
                        />

                        <CInputGroupText>Minutes</CInputGroupText>
                        <CFormFeedback invalid>{errors.workingtime?.message}</CFormFeedback>
                      </CInputGroup>
                    </CCol>
                    <CCol xl={8} md={12}>
                      <CFormLabel> Break Time</CFormLabel>
                      <CInputGroup>
                        <CFormInput
                          type="text"
                          placeholder="Break Time in minutes"
                          {...register('breaktime', { required: 'Break Time is required' })}
                          invalid={!!errors.breaktime}
                        />

                        <CInputGroupText>Minutes</CInputGroupText>
                        <CFormFeedback invalid>{errors.breaktime?.message}</CFormFeedback>
                      </CInputGroup>
                    </CCol>
                    <CCol xl={8} md={12}>
                      <CFormLabel> Check Out redius</CFormLabel>
                      <CInputGroup>
                        <CFormInput
                          type="text"
                          placeholder="Check Out redius"
                          {...register('rediusmiter', { required: 'Check Out redius is required' })}
                          invalid={!!errors.rediusmiter}
                        />

                        <CInputGroupText>Miter</CInputGroupText>
                        <CFormFeedback invalid>{errors.rediusmiter?.message}</CFormFeedback>
                      </CInputGroup>
                    </CCol>
                    {Array.isArray(permission) && permission.includes('setting.edit') && (
                      <CCol md={12} className="text-center submitButton">
                        {isLoading ? (
                          <CButton disabled>
                            <CSpinner component="span" size="sm" aria-hidden="true" />
                            Loading...
                          </CButton>
                        ) : (
                          <CButton type="submit" className="AddButton">
                            Update
                          </CButton>
                        )}
                      </CCol>
                    )}
                  </CForm>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    </>
  )
}

export default Setting
