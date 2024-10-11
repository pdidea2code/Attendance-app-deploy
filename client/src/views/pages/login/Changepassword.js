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
  CRow,
  CSpinner,
} from '@coreui/react'
import { useForm } from 'react-hook-form'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { changePassword } from 'src/redux/api/api'

const Changepassword = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    setError,
    setValue,
    getFieldState,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm()

  const onSubmit = async (data) => {
    setIsLoading(true)

    try {
      const res = await changePassword(data)

      if (res.status === 200) {
        toast.success('Password change successfully')
      }
      setIsLoading(false)
      setValue('password', '')
      setValue('newPassword', '')
      setValue('confirmPassword', '')
    } catch (error) {
      console.log(error)
      setIsLoading(false)
      toast.error(error.response?.data?.message || 'An error occurred')
    }
  }

  // Watch the new password field for comparison in confirm password validation
  const newPassword = watch('newPassword')

  return (
    <>
      <div className="bg-light min-vh-100">
        {/* <ToastContainer /> */}
        <CContainer className="mt-3">
          <CRow>
            <CCol md={12}>
              <CCard>
                <CCardHeader>Change Password </CCardHeader>
                <CCardBody>
                  <CForm className="row g-3" onSubmit={handleSubmit(onSubmit)}>
                    <CCol xl={12} md={12}>
                      <CFormLabel>Password</CFormLabel>
                      <CFormInput
                        type="password"
                        {...register('password', { required: 'Password is required' })}
                        invalid={!!errors.password}
                      />
                      <CFormFeedback invalid>{errors.password?.message}</CFormFeedback>
                    </CCol>
                    <CCol xl={12} md={12}>
                      <CFormLabel>New Password</CFormLabel>
                      <CFormInput
                        type="password"
                        {...register('newPassword', { required: 'New password is required' })}
                        invalid={!!errors.newPassword}
                      />
                      <CFormFeedback invalid>{errors.newPassword?.message}</CFormFeedback>
                    </CCol>
                    <CCol xl={12} md={12}>
                      <CFormLabel>Confirm Password</CFormLabel>
                      <CFormInput
                        type="password"
                        {...register('confirmPassword', {
                          required: 'Confirm password is required',
                          validate: (value) => value === newPassword || 'Passwords do not match',
                        })}
                        invalid={!!errors.confirmPassword}
                      />
                      <CFormFeedback invalid>{errors.confirmPassword?.message}</CFormFeedback>
                    </CCol>
                    <CCol xl={12} md={12}>
                      <CButton type="submit" color="primary">
                        {isLoading ? <CSpinner size="sm" /> : 'Submit'}
                      </CButton>
                    </CCol>
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

export default Changepassword
