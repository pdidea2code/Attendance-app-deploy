import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormFeedback,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { useForm } from 'react-hook-form'
import { getRole, login } from 'src/redux/api/api'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Cookies from 'js-cookie'
import { useDispatch } from 'react-redux'
import { LOGIN_SUCCESS, PERMISSION } from 'src/redux/actions/action'

const Login = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [roles, setRole] = useState({})
  const [permission, setPermissions] = useState([])

  const onSubmit = async (data) => {
    setError('')
    setIsLoading(true)
    try {
      const res = await login(data)

      if (res.status === 400 || res.data.success === false) {
        setError(res.data.message)
        setIsLoading(false)
      } else {
        Cookies.set('token', res.data.info.token)
        Cookies.set('refreshToken', res.data.info.refreshToken)

        const userObject = {
          name: res.data.info.admin.name,
          id: res.data.info.admin._id,
          email: res.data.info.admin.email,
          role: res.data.info.admin.role.name,
          img: res.data.info.admin.image ? res.data.baseUrl + res.data.info.admin.image : null,
        }

        Cookies.set('admin', JSON.stringify(userObject))

        // Fetch role and permissions
        try {
          const role = await getRole()
          const data = role.data.info

          setRole({ role: data.role, _id: data._id })
          setPermissions(data.permissions)

          Cookies.set('role', JSON.stringify(data.role))
          Cookies.set('permission', JSON.stringify(data.permissions))

          // Now dispatch after the role and permissions are set
          dispatch({
            type: LOGIN_SUCCESS,
            data: userObject,
          })

          dispatch({
            type: PERMISSION,
            role: data.role,
            permission: data.permissions,
          })

          setIsLoading(false)
          navigate('/dashboard') // Un-comment this line when ready to navigate
        } catch (error) {
          console.log(error)
          setIsLoading(false)
          setError('Failed to fetch user role and permissions.')
        }
      }
    } catch (err) {
      console.log(err)
      const errorMessage =
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : 'An error occurred while logging in. Please try again.'

      setError(errorMessage)
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <ToastContainer />
        <CRow className="justify-content-center">
          <CCol md={5}>
            <CCardGroup>
              <CCard className="p-4 col-md-7">
                <CCardBody>
                  <CForm onSubmit={handleSubmit(onSubmit)}>
                    <h1>Login</h1>
                    <p className="text-medium-emphasis">Sign In to your account</p>
                    {error && <p className="errors">{error}</p>}
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        type="email"
                        placeholder="Email"
                        {...register('email', { required: 'Email is required' })}
                        invalid={!!errors.email}
                      />
                      <CFormFeedback invalid>{errors.email?.message}</CFormFeedback>
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        {...register('password', { required: 'Password is required' })}
                        invalid={!!errors.password}
                      />
                      <CFormFeedback invalid>{errors.password?.message}</CFormFeedback>
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton
                          color="primary"
                          type="submit"
                          className="px-4"
                          disabled={isLoading}
                        >
                          {isLoading ? 'Loading...' : 'Login'}
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <Link to="/forgotpassword">
                          <CButton color="link" className="px-0">
                            Forgot password?
                          </CButton>
                        </Link>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
