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
import { addEmplloyee, getMapApikey, updateEmplloyee } from 'src/redux/api/api'

import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'

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
  const [mapapikey, setMapApiKey] = useState('')
  const navigate = useNavigate()

  const getmapapikey = async () => {
    try {
      setIsLoading(true)
      const res = await getMapApikey()

      if (res.status === 200) {
        setIsLoading(false)
        setMapApiKey(res.data.info)
      }
    } catch (error) {
      setIsLoading(false)
      const errorMsg = error.response?.data?.message || 'Something went wrong'
      toast.error(errorMsg)
    }
  }

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
      } else if (data[key] === '') {
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
            // console.log(error)
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
            // console.log(error)
            const errorMsg = error.response?.data?.message || 'Something went wrong'
            toast.error(errorMsg)
          })
  }

  const center = {
    lat: Number(state?.editData?.workplaceLatitude),
    lng: Number(state?.editData?.workplaceLongitude),
  }

  const [location, setLocation] = useState(center)
  const [marker, setMarker] = useState(center)

  const handleMapClick = (event) => {
    // console.log(event)
    setLocation({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    })
    setMarker({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    })

    setValue('workplaceLatitude', event.latLng.lat())
    setValue('workplaceLongitude', event.latLng.lng())
  }

  const mapContainerStyle = {
    height: '400px',
    width: 'auto',
  }

  const formatDateToYMD = (date) => {
    if (!date) return ''
    const parts = date.split('/')

    if (parts.length === 3) {
      const [day, month, year] = parts
      return `${year}-${month}-${day}`
    }
    return ''
  }

  useEffect(() => {
    getmapapikey()
    if (state?.editData) {
      // console.log(state.editData.dob)
      setIsUpdate(state.editData._id)
      setImage(state.imageUrl + state.editData.image)
      setValue('name', state.editData.name)
      setValue('email', state.editData.email)
      setValue('user_id', state.editData.user_id)
      setValue('position', state.editData.position)
      setValue('phoneno', state.editData.phoneno)
      setValue('workplaceLatitude', state.editData.workplaceLatitude)
      setValue('workplaceLongitude', state.editData.workplaceLongitude)
      // setValue('dob', formatDateToYMD(state.editData.dob))
      setValue('dob', state.editData.dob)
      // setValue('dob', '2005/6/20')
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
                      placeholder="Jone Doe"
                      {...register('name', { required: 'Name is required' })}
                      invalid={!!errors.name}
                    />
                    <CFormFeedback invalid>{errors.name?.message}</CFormFeedback>
                  </CCol>
                  <CCol xl={6} md={12}>
                    <CFormLabel>Email</CFormLabel>
                    <CFormInput
                      type="email"
                      placeholder="example@domain.com"
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
                        minLength: {
                          value: 8,
                          message: 'Password must be at least 8 characters long',
                        },
                        validate: {
                          validatePassword: (value) => {
                            if (!value) return true // Skip validation if no value is entered

                            const hasUpperCase = /[A-Z]/.test(value)
                            const hasLowerCase = /[a-z]/.test(value)
                            const hasNumber = /[0-9]/.test(value)
                            const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value)

                            if (!hasUpperCase) {
                              return 'Password must contain at least one uppercase letter'
                            }
                            if (!hasLowerCase) {
                              return 'Password must contain at least one lowercase letter'
                            }
                            if (!hasNumber) {
                              return 'Password must contain at least one number'
                            }
                            if (!hasSpecialChar) {
                              return 'Password must contain at least one special character'
                            }

                            return true // If all validations pass
                          },
                        },
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
                  <CCol xl={6} md={12}>
                    <CFormLabel>Workplace Latitude</CFormLabel>
                    <CFormInput
                      type="number"
                      step="any"
                      placeholder="21.230449"
                      {...register('workplaceLatitude', {
                        required: 'workplace Latitude is required',
                      })}
                      invalid={!!errors.workplaceLatitude}
                    />
                    <CFormFeedback invalid>{errors.workplaceLatitude?.message}</CFormFeedback>
                  </CCol>
                  <CCol xl={6} md={12}>
                    <CFormLabel>Workplace Longitude</CFormLabel>
                    <CFormInput
                      type="number"
                      step="any"
                      placeholder="72.900889"
                      {...register('workplaceLongitude', {
                        required: 'workplace Longitude is required',
                      })}
                      invalid={!!errors.workplaceLongitude}
                    />
                    <CFormFeedback invalid>{errors.workplaceLongitude?.message}</CFormFeedback>
                  </CCol>
                  <CCol xl={12} md={12}>
                    <LoadScript googleMapsApiKey={mapapikey}>
                      <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={location}
                        zoom={12}
                        onClick={handleMapClick}
                      >
                        {marker && <Marker position={marker} />}
                      </GoogleMap>
                      {/* <div>
                        <h2>Selected Location</h2>
                        <p>Latitude: {location.lat}</p>
                        <p>Longitude: {location.lng}</p>
                      </div> */}
                    </LoadScript>
                  </CCol>
                  <CCol xl={4} md={12}>
                    <CFormLabel>User ID</CFormLabel>
                    <CFormInput
                      type="text"
                      placeholder="01"
                      {...register('user_id', { required: 'User ID is required' })}
                      invalid={!!errors.user_id}
                    />
                    <CFormFeedback invalid>{errors.user_id?.message}</CFormFeedback>
                  </CCol>
                  <CCol xl={4} md={12}>
                    <CFormLabel>Position</CFormLabel>
                    <CFormInput
                      type="text"
                      placeholder="Software Engineer"
                      {...register('position', { required: 'Position is required' })}
                      invalid={!!errors.position}
                    />
                    <CFormFeedback invalid>{errors.position?.message}</CFormFeedback>
                  </CCol>
                  <CCol xl={4} md={12}>
                    <CFormLabel>Phone No</CFormLabel>
                    <CFormInput
                      type="tel"
                      placeholder="9999999999"
                      {...register('phoneno', {
                        required: 'Phone No is required',
                        pattern: {
                          value: /^[0-9]{10}$/,
                          message: 'Phone No must be exactly 10 digits',
                        },
                      })}
                      invalid={!!errors.phoneno}
                    />
                    <CFormFeedback invalid>{errors.phoneno?.message}</CFormFeedback>
                  </CCol>
                  <CCol xl={4} md={12}>
                    <CFormLabel>Date of birth</CFormLabel>
                    <CFormInput
                      type="date"
                      {...register('dob', {
                        required: 'Date of birth No is required',
                      })}
                      invalid={!!errors.dob}
                    />
                    <CFormFeedback invalid>{errors.dob?.message}</CFormFeedback>
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

                  <CCol md={4}>
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
