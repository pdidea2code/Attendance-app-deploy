import Cookies from 'js-cookie'
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
import Changepassword from './Changepassword'
import { changeProfile } from 'src/redux/api/api'
const profile = JSON.parse(Cookies.get('admin'))
const Profileform = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [image, setImage] = useState('')
  const {
    register,
    setError,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    try {
      setIsLoading(true)
      let formData = new FormData()
      Object.keys(data).forEach((key) => {
        if (key === 'image' && data[key][0]) {
          formData.append(key, data[key][0])
        } else {
          formData.append(key, data[key])
        }
      })

      // Send formData instead of data
      const res = await changeProfile(formData)

      if (res.status === 200) {
        const updatedProfile = {
          name: data.name || profile.name,
          id: profile.id,
          email: data.email || profile.email,
          role: profile.role,
          img: image === '' ? profile.img : res.data.baseUrl,
        }
        Cookies.set('admin', JSON.stringify(updatedProfile))
        toast.success('Profile updated successfully') // Correct toast invocation
      }
      setIsLoading(false)
    } catch (error) {
      console.log(error)
      setIsLoading(false)
      toast.error(error.response?.data?.message || 'An error occurred') // Correct toast invocation
    }
  }

  const handleFileChange = (e) => {
    const files = e.target.files[0]
    if (files) {
      const imageUrl = URL.createObjectURL(files)
      setImage(imageUrl)
    } else {
      setImage('')
    }
  }

  useEffect(() => {
    const profileData = Cookies.get('admin')
    const admin = JSON.parse(profileData)
    if (!admin) {
      navigate('/')
    }

    setValue('name', admin.name)
    setValue('email', admin.email)
    setImage(admin.img)
  }, [])
  return (
    <>
      <div className="bg-light min-vh-100">
        {/* <ToastContainer /> */}
        <CContainer className="mt-3">
          <CRow>
            <CCol md={12}>
              <CCard>
                <CCardHeader>Profile</CCardHeader>
                <CCardBody>
                  <CForm className="row g-3" onSubmit={handleSubmit(onSubmit)}>
                    <CCol xl={12} md={12}>
                      <CFormLabel>Name</CFormLabel>
                      <CFormInput
                        type="text"
                        {...register('name', { required: 'Name is required' })}
                        invalid={!!errors.name}
                      />
                      <CFormFeedback invalid>{errors.name?.message}</CFormFeedback>
                    </CCol>
                    <CCol xl={12} md={12}>
                      <CFormLabel>Email</CFormLabel>
                      <CFormInput
                        type="email"
                        {...register('email', { required: 'Email is required' })}
                        invalid={!!errors.email}
                      />
                      <CFormFeedback invalid>{errors.email?.message}</CFormFeedback>
                    </CCol>
                    <CCol xl={6} md={12}>
                      <CFormLabel>Image</CFormLabel>
                      <CFormInput
                        type="file"
                        {...register('image', {
                          required: image === '' ? 'Image is required' : false,
                        })}
                        accept="image/*"
                        name="image"
                        onChange={handleFileChange}
                      />
                      {errors.image && (
                        <CFormFeedback invalid>{errors.image.message}</CFormFeedback>
                      )}
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
                          Update
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

export default Profileform
