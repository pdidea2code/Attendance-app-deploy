import { cilUser } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormFeedback,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import { useForm } from 'react-hook-form'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useState } from 'react'
import { sendLink } from 'src/redux/api/api'

const Forgotpassword = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm()
  const [email, setEmail] = useState('')
  const [input, setInput] = useState(false)

  const handleChange = (fieldName, fieldValue) => {
    if (fieldName === 'email') {
      setEmail(fieldValue)
    }
  }

  const onSubmit = async () => {
    try {
      setInput(true)

      const data = { email }
      const res = await sendLink(data) // Reuse sendOtp for sending the reset link

      if (res.status === 401) {
        toast.error('Error sending reset link')
        setInput(false)
      } else {
        toast.success('Reset link sent successfully!')
        setValue('email', '')
        setInput(false)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || 'Error occurred while changing password')
      setInput(false)
    }
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <ToastContainer />
        <CRow className="justify-content-center">
          <CCol md={9} xl={5}>
            <CCard className="mx-4">
              <CCardBody>
                <CForm onSubmit={handleSubmit(onSubmit)}>
                  <h1 style={{ textAlign: 'center' }}>Forgot Password</h1>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      type="email"
                      placeholder="Email"
                      name="email"
                      {...register('email', { required: 'Email is required' })}
                      invalid={!!errors.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      disabled={input}
                    />
                    <CFormFeedback invalid>{errors.email?.message}</CFormFeedback>
                  </CInputGroup>

                  <CRow className="mt-4">
                    <CCol xs={6}>
                      <CButton type="submit" disabled={input}>
                        Send Reset Link
                      </CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Forgotpassword
