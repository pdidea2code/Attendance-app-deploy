import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
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
import { addUser, getRole, updateUser } from 'src/redux/api/api'
import Cookies from 'js-cookie'
import { useForm } from 'react-hook-form'

const Userform = () => {
  const { state } = useLocation()
  const [baseUrl, setBaseUrl] = useState('')
  const [isUpdate, setIsUpdate] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [role, setRole] = useState('')
  const [cuRole, setcuRole] = useState('')
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

  useEffect(() => {
    const getrole = async () => {
      try {
        setIsLoading(true)
        const role = await getRole()
        const data = role.data.info

        const cookie = {
          _id: data._id,
          name: data.name,
          insert: data.insert,
          update: data.update,
          delete: data.delete,
        }
        setcuRole(data.name)
        Cookies.set('role', JSON.stringify(cookie))

        setIsLoading(false)
      } catch (error) {
        console.log(error)
        setIsLoading(false)
        toast.error(error.response?.data?.message || 'Error occurred ')
      }
    }

    // getrole()
  }, [])

  useEffect(() => {
    const role = JSON.parse(Cookies.get('role'))

    if (!state) {
      navigate('/users')
    }
  }, [])

  useEffect(() => {
    setRole(state.role)

    if (state.editData) {
      setIsUpdate(state.editData._id)
      setValue('name', state.editData.name)
      setValue('email', state.editData.email)
      setBaseUrl(state.imageUrl + state.editData.image)
    }
  }, [])

  const handleFileChange = (e) => {
    const files = e.target.files[0]
    if (files) {
      const imageUrl = URL.createObjectURL(files)
      setBaseUrl(imageUrl)
    } else {
      setBaseUrl(null)
    }
  }

  const onSubmit = (data) => {
    let formData = new FormData()
    Object.keys(data).forEach(function (key) {
      if (key === 'image') {
        if (data[key][0] !== undefined) {
          formData.append(key, data[key][0])
        }
      } else {
        formData.append(key, data[key])
      }
    })
    if (isUpdate) {
      formData.append('id', isUpdate)
    }
    if (formData) {
      formData.append('rolename', role)
    }

    isUpdate === ''
      ? addUser(formData)
          .then((res) => {
            role === cuRole ? navigate('/') : navigate('/users', { state: { role: role } })
          })
          .catch((error) => {
            console.log(error)

            const errorMsg = error.response?.data?.message || 'Something went wrong'
            toast.error(errorMsg)
          })
      : updateUser(formData)
          .then((res) => {
            role === cuRole ? navigate('/') : navigate('/users', { state: { role: role } })
          })
          .catch((error) => {
            console.log(error)

            const errorMsg = error.response?.data?.message || 'Something went wrong'
            toast.error(errorMsg)
          })
  }
  return (
    <>
      <div className="bg-light min-vh-100">
        <ToastContainer />
        <CContainer className="mt-3">
          <CRow>
            <CCol md={8}>
              <CCard>
                <CCardHeader>{isUpdate ? 'Update' : 'Add'} Form</CCardHeader>
                <CCardBody>
                  <CForm className="row g-3 " onSubmit={handleSubmit(onSubmit)}>
                    <CCol xl={6} md={12}>
                      <CFormLabel>Name</CFormLabel>
                      <CFormInput
                        type="text"
                        placeholder="User Name"
                        {...register('name', { required: 'Name is required' })}
                        invalid={!!errors.name}
                      />
                      <CFormFeedback invalid> Name is required</CFormFeedback>
                    </CCol>
                    <CCol xl={6} md={12}>
                      <CFormLabel>Email</CFormLabel>
                      <CFormInput
                        type="email"
                        placeholder="Email"
                        {...register('email', { required: 'Email is required' })}
                        invalid={!!errors.email}
                      />
                      <CFormFeedback invalid> Email is required</CFormFeedback>
                    </CCol>
                    {isUpdate == '' && (
                      <CCol xl={6} md={12}>
                        <CFormLabel>Password</CFormLabel>
                        <CFormInput
                          type="password"
                          placeholder="Password"
                          {...register('password', { required: 'Password is required' })}
                          invalid={!!errors.password}
                        />
                        <CFormFeedback invalid>Password is required</CFormFeedback>
                      </CCol>
                    )}
                    <CCol xl={7} md={12}>
                      <CFormLabel>Image</CFormLabel>
                      <CFormInput
                        type="file"
                        name="image"
                        accept="image/*"
                        {...register('image', {
                          required: isUpdate === '' ? 'Image is required' : false,
                        })}
                        onChange={handleFileChange}
                      />
                      {errors.image && (
                        <CFormFeedback invalid>{errors.image.message}</CFormFeedback>
                      )}
                    </CCol>
                    <CCol md={5}>
                      {baseUrl && (
                        <>
                          <p>Image Preview</p>
                          <div className="mb-4 text-center">
                            <img
                              src={baseUrl}
                              alt="Profile Preview"
                              style={{
                                width: '150px',
                                height: '150px',
                                objectFit: 'cover',
                                borderRadius: '50%',
                              }}
                            />
                          </div>
                        </>
                      )}
                    </CCol>
                    <CCol md={12} className="text-center submitButton">
                      {isLoading ? (
                        <CButton disabled>
                          <CSpinner component="span" size="sm" aria-hidden="true" />
                          Loading...
                        </CButton>
                      ) : (
                        <CButton type="submit" className="AddButton">
                          {isUpdate === '' ? 'Add' : 'Update'}
                        </CButton>
                      )}
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

export default Userform


<CCol xs={12} md={6}>
        <CCard className="mb-4">
          <CCardBody>
            <CForm className="row g-3 needs-validation" onSubmit={handleSubmit(onSubmitUser)}>
              <CCol md={12} className="form-header ">
                <div>
                  <CIcon icon={cilHandPointRight} />
                  &nbsp;&nbsp;USER PRIVACY POLICY
                </div>
              </CCol>
              <CCol md={12}>
                <Controller
                  name="user_pp"
                  control={control}
                  defaultValue={getValues("user_pp")}
                  render={({ field }) => (
                    <ReactQuill
                      value={field.value || ""}
                      onChange={field.onChange}
                      style={{ height: "400px", border: "none" }}
                    />
                  )}
                />
              </CCol>
              </CForm></CCardBody></CCard>