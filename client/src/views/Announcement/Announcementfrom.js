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
import { addAnnouncement, updateAnnouncement } from 'src/redux/api/api'

const Announcementform = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
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

  const formatDateToYMD = (date) => {
    if (!date) return ''
    const parts = date.split('/')

    if (parts.length === 3) {
      const [day, month, year] = parts
      return `${year}-${month}-${day}`
    }
    return ''
  }
  const formatDateToDMY = (date) => {
    if (!date) return ''
    const parts = date.split('-')
    if (parts.length === 3) {
      const [year, month, day] = parts
      return `${day}/${month}/${year}`
    }
    return ''
  }

  const onSubmit = (data) => {
    setIsLoading(true)
    const formattedDate = formatDateToDMY(data.date)
    data.date = formattedDate

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
    if (isUpdate !== '') {
      formData.append('id', isUpdate)
    }
    isUpdate === ''
      ? addAnnouncement(formData)
          .then((res) => {
            setIsLoading(false)
            if (res.status === 200) {
              navigate('/announcement')
            }
          })
          .catch((error) => {
            console.log(error)
            setIsLoading(false)
            const errorMsg = error.response?.data?.message || 'Something went wrong'
            toast.error(errorMsg)
          })
      : updateAnnouncement(formData)
          .then((res) => {
            setIsLoading(false)
            if (res.status === 200) {
              navigate('/announcement')
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
      state.editData.image && setImage(state.imageUrl + state.editData.image)
      setValue('title', state.editData.title)
      setValue('description', state.editData.description)
      setValue('date', formatDateToYMD(state.editData.date))
    }
  }, [state, setValue])

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
                    <CFormLabel>Title</CFormLabel>
                    <CFormInput
                      type="text"
                      placeholder="Title"
                      {...register('title', { required: 'Title is required' })}
                      invalid={!!errors.title}
                    />
                    <CFormFeedback invalid>{errors.title?.message}</CFormFeedback>
                  </CCol>
                  <CCol xl={6} md={12}>
                    <CFormLabel>Description</CFormLabel>
                    <CFormInput
                      type="text"
                      placeholder="Description"
                      {...register('description', { required: 'Description is required' })}
                      invalid={!!errors.description}
                    />
                    <CFormFeedback invalid>{errors.description?.message}</CFormFeedback>
                  </CCol>
                  <CCol xl={6} md={12}>
                    <CFormLabel>Date</CFormLabel>
                    <CFormInput
                      type="date"
                      {...register('date', { required: 'Date is required' })}
                      invalid={!!errors.date}
                      value={getValues('data')}
                    />
                    <CFormFeedback invalid>{errors.date?.message}</CFormFeedback>
                  </CCol>
                  <CCol xl={4} md={12}>
                    <CFormLabel>Image</CFormLabel>
                    <CFormInput
                      type="file"
                      {...register('image')}
                      accept="image/*"
                      name="image"
                      onChange={handleFileChange}
                    />
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
                              borderRadius: '5px',
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

export default Announcementform
