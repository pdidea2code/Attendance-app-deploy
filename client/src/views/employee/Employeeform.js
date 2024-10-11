import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
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
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { addEmplloyee, updateEmplloyee } from 'src/redux/api/api'

const Employeeform = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm()
  const { state } = useLocation()
  const [isUpdate, setIsUpdate] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [image, setImage] = useState('')
  const navigate = useNavigate()

  const handleFileChange = (e) => {
    const files = e.target.files[0]
    if (files) {
      const imageUrl = URL.createObjectURL(files)
      setImage(imageUrl)
    } else {
      setImage(null)
    }
  }

  const onSubmit = (data) => {
    setIsLoading(true)
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
    isUpdate === ''
      ? addEmplloyee(formData)
          .then((res) => {
            setIsLoading(false)
            if (res.status === 200) {
              navigate('/employee')
            }
          })
          .catch((error) => {
            console.log(error)
            setIsLoading(false)
            const errorMsg = error.response?.data?.message || 'Something went wrong'
            toast.error(errorMsg)
          })
      : updateEmplloyee(isUpdate, formData)
          .then((res) => {
            setIsLoading(false)
            if (res.status === 200) {
              navigate('/employee')
            }
          })
          .catch((error) => {
            setIsLoading(false)
            console.log(error)
            const errorMsg = error.response?.data?.message || 'Something went wrong'
            toast.error(errorMsg)
          })
  }

  useEffect(() => {
    if (state?.editData) {
      setIsUpdate(state.editData._id)
      setImage(state.imageUrl + state.editData.image)
      setValue('name', state.editData.name)
      setValue('email', state.editData.email)
      setValue('user_id', state.editData.user_id)
      setValue('position', state.editData.position)
      setValue('phoneno', state.editData.phoneno)
    }
  }, [state, setValue])

  const password = watch('password')

  return (
    <div className="bg-light min-vh-100">
      <ToastContainer />
      <CContainer className="mt-3">
        <CRow>
          <CCol md={8}>
            <CCard>
              <CCardHeader>{isUpdate ? 'Update' : 'Add'} Form</CCardHeader>
              <CCardBody>
                <CForm className="row g-3" onSubmit={handleSubmit(onSubmit)}>
                  <CCol xl={6} md={12}>
                    <CFormLabel>Name</CFormLabel>
                    <CFormInput
                      type="text"
                      placeholder="Name"
                      {...register('name', { required: 'Name is required' })}
                      invalid={!!errors.name}
                    />
                    <CFormFeedback invalid>{errors.name?.message}</CFormFeedback>
                  </CCol>
                  <CCol xl={6} md={12}>
                    <CFormLabel>Email</CFormLabel>
                    <CFormInput
                      type="email"
                      placeholder="Email"
                      {...register('email', { required: 'Email is required' })}
                      invalid={!!errors.email}
                    />
                    <CFormFeedback invalid>{errors.email?.message}</CFormFeedback>
                  </CCol>
                  <CCol xl={6} md={12}>
                    <CFormLabel>Password</CFormLabel>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      {...register('password', {
                        required: isUpdate === '' ? 'Password is required' : false,
                      })}
                      invalid={!!errors.password}
                    />
                    {errors.password && (
                      <CFormFeedback invalid>{errors.password.message}</CFormFeedback>
                    )}
                  </CCol>
                  <CCol xl={6} md={12}>
                    <CFormLabel>Confirm Password</CFormLabel>
                    <CFormInput
                      type="password"
                      placeholder="Confirm Password"
                      {...register('confpassword', {
                        validate: (value) => {
                          if (password) {
                            return value === password || 'Passwords do not match'
                          }
                        },
                      })}
                      invalid={!!errors.confpassword}
                    />
                    {errors.confpassword && (
                      <CFormFeedback invalid>{errors.confpassword.message}</CFormFeedback>
                    )}
                  </CCol>
                  <CCol xl={4} md={12}>
                    <CFormLabel>User ID</CFormLabel>
                    <CFormInput
                      type="text"
                      placeholder="User ID"
                      {...register('user_id', { required: 'User ID is required' })}
                      invalid={!!errors.user_id}
                    />
                    <CFormFeedback invalid>{errors.user_id?.message}</CFormFeedback>
                  </CCol>
                  <CCol xl={4} md={12}>
                    <CFormLabel>Position</CFormLabel>
                    <CFormInput
                      type="text"
                      placeholder="Position"
                      {...register('position', { required: 'Position is required' })}
                      invalid={!!errors.position}
                    />
                    <CFormFeedback invalid>{errors.position?.message}</CFormFeedback>
                  </CCol>
                  <CCol xl={4} md={12}>
                    <CFormLabel>Phone No</CFormLabel>
                    <CFormInput
                      type="tel"
                      placeholder="Phone No"
                      {...register('phoneno', { required: 'Phone No is required' })}
                      invalid={!!errors.phoneno}
                    />
                    <CFormFeedback invalid>{errors.phoneno?.message}</CFormFeedback>
                  </CCol>
                  <CCol xl={4} md={12}>
                    <CFormLabel>Image</CFormLabel>
                    <CFormInput
                      type="file"
                      {...register('image', {
                        required: isUpdate === '' ? 'Image is required' : false,
                      })}
                      accept="image/*"
                      name="image"
                      onChange={handleFileChange}
                    />
                    {errors.image && <CFormFeedback invalid>{errors.image.message}</CFormFeedback>}
                  </CCol>
                  <CCol md={5}>
                    {image && (
                      <>
                        <p>Image Preview</p>
                        <div className="mb-4 text-center">
                          <img
                            src={image}
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
  )
}

export default Employeeform
