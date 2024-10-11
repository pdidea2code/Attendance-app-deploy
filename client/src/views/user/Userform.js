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
  CFormSelect,
  CRow,
  CSpinner,
} from '@coreui/react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { addAdmin, updateAdmin, getallRole } from 'src/redux/api/api' // Ensure updateAdmin is imported

const Userform = () => {
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
  const [roles, setRoles] = useState([])
  const [selectedRole, setSelectedRole] = useState('')
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

  const getRoles = async () => {
    try {
      const res = await getallRole()
      const data = res.data.info
      setRoles(data)
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || 'An error occurred while fetching roles')
    }
  }

  const onSubmit = (data) => {
    setIsLoading(true)
    let formData = new FormData()
    Object.keys(data).forEach((key) => {
      if (key === 'image' && data[key][0]) {
        formData.append(key, data[key][0])
      } else {
        formData.append(key, data[key])
      }
    })

    formData.append('role', selectedRole)

    isUpdate === ''
      ? addAdmin(formData)
          .then((res) => {
            setIsLoading(false)
            if (res.status === 200) {
              navigate('/user')
            }
          })
          .catch((error) => {
            setIsLoading(false)
            console.log(error)
            const errorMsg = error.response?.data?.message || 'Something went wrong'
            toast.error(errorMsg)
          })
      : updateAdmin(isUpdate, formData)
          .then((res) => {
            setIsLoading(false)
            if (res.status === 200) {
              navigate('/user')
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
    getRoles()

    if (state?.editData) {
      setIsUpdate(state.editData._id)
      setImage(state.imageUrl + state.editData.image)
      setValue('name', state.editData.name)
      setValue('email', state.editData.email)
      setSelectedRole(state.editData.role_name) // Assuming roleId is stored in editData
      setValue('role', state.editData.role_name) // Set the role field in the form
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
              <CCardHeader>User Form</CCardHeader>
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
                  <CCol xl={6} md={12}>
                    <CFormLabel>Role</CFormLabel>
                    <CFormSelect
                      {...register('role', { required: 'Role is required' })} // Register role as required
                      onChange={(e) => {
                        setSelectedRole(e.target.value)
                        setValue('role', e.target.value) // Update form value on change
                      }}
                      value={selectedRole} // Set selected role from state
                      invalid={!!errors.role}
                    >
                      <option value="">Select Role</option>
                      {roles.map((role) => (
                        <option key={role._id} value={role.name}>
                          {' '}
                          {/* Use role.id as value */}
                          {role.name}
                        </option>
                      ))}
                    </CFormSelect>
                    {errors.role && <CFormFeedback invalid>{errors.role.message}</CFormFeedback>}
                  </CCol>
                  <CCol xl={4} md={12}>
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
                        {isUpdate ? 'Update' : 'Add'}
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

export default Userform
