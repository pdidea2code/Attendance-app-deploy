import { cilLockLocked } from '@coreui/icons'
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
  CSpinner,
} from '@coreui/react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { resetPassword, verifyLink } from 'src/redux/api/api'

const Resetpassword = () => {
  const { id, resetCode } = useParams()
  const [linkvalid, setLinkvalid] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const {
    register,
    getValues,
    setValue,
    handleSubmit,
    control,
    clearErrors,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    if (data.password !== data.confpassword) {
      toast.error('Passwords do not match')
      return
    }

    try {
      const senddata = {
        id,
        resetCode,
        password: data.password,
        confpassword: data.confpassword,
      }
      const res = await resetPassword(senddata)

      if (res.status === 401) {
        toast.error('Invalid Details')
      } else {
        toast.success('Password Changed Successfully')
        setValue('password', '')
        setValue('confpassword', '')
        setTimeout(() => {
          navigate('/')
        }, 2000)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || 'Error occurred while changing password')
    }
  }

  useEffect(() => {
    const linkValidation = async () => {
      try {
        setIsLoading(true)
        const data = {
          id,
          resetCode,
        }
        const res = await verifyLink(data)

        if (res.status === 401) {
          toast.error('Invalid reset link')
          setLinkvalid(false)
        } else {
          setLinkvalid(true)
        }
      } catch (error) {
        console.log(error)
        toast.error('Error validating reset link')
        setLinkvalid(false)
      } finally {
        setIsLoading(false)
      }
    }
    linkValidation()
  }, [id, resetCode]) // Ensure id and resetCode are passed as dependencies

  return (
    <>
      {isLoading ? (
        <div className="d-flex justify-content-center">
          <CSpinner className="theme-spinner-color" />
        </div>
      ) : linkvalid ? (
        <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
          <CContainer>
            <ToastContainer />
            <CRow className="justify-content-center">
              <CCol md={8} lg={7} xl={5}>
                <CCard className="mx-4">
                  <CCardBody className="p-4">
                    <CForm onSubmit={handleSubmit(onSubmit)}>
                      <h1>Reset Password</h1>

                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput
                          type="password"
                          placeholder="Password"
                          {...register('password', { required: 'Password is required' })}
                          invalid={!!errors.password}
                        />
                        {errors.password && (
                          <CFormFeedback invalid>{errors.password.message}</CFormFeedback>
                        )}
                      </CInputGroup>

                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput
                          type="password"
                          placeholder="Confirm Password"
                          {...register('confpassword', {
                            required: 'Confirm Password is required',
                          })}
                          invalid={!!errors.confpassword}
                        />
                        {errors.confpassword && (
                          <CFormFeedback invalid>{errors.confpassword.message}</CFormFeedback>
                        )}
                      </CInputGroup>

                      <CRow>
                        <CCol xs={6}>
                          <CButton color="primary" type="submit" className="px-4">
                            Submit
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
      ) : (
        <div className="d-flex justify-content-center mt-5">
          <h3>Invalid Link</h3>
        </div>
      )}
    </>
  )
}

export default Resetpassword

{
  /* <CCard className="text-white col-md-5 bg-primary py-5">
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard> */
}
