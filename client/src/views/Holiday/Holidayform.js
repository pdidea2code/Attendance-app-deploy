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
import { addHoliday, updateHoliday } from 'src/redux/api/api'
import { format } from 'date-fns'

const Holidayform = () => {
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

  const onSubmit = (data) => {
    if (isUpdate !== '') {
      data.id = isUpdate
    }
    isUpdate === ''
      ? addHoliday(data)
          .then((res) => {
            setIsLoading(false)
            if (res.status === 200) {
              navigate('/holiday')
            }
          })
          .catch((error) => {
            console.log(error)
            setIsLoading(false)
            const errorMsg = error.response?.data?.message || 'Something went wrong'
            toast.error(errorMsg)
          })
      : updateHoliday(data)
          .then((res) => {
            setIsLoading(false)
            if (res.status === 200) {
              navigate('/holiday')
            }
          })
          .catch((error) => {
            setIsLoading(false)
            console.log(error)
            const errorMsg = error.response?.data?.message || 'Something went wrong'
            toast.error(errorMsg)
          })
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
    if (state?.editData) {
      setIsUpdate(state.editData._id)
      setValue('title', state.editData.title)
      setValue('date', formatDateToYMD(state.editData.modifydate))
      setValue('day', state.editData.day)
    }
  }, [state, setValue])

  const navigate = useNavigate()
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
                  <CForm className="row g-3" onSubmit={handleSubmit(onSubmit)}>
                    <CCol xl={4} md={12}>
                      <CFormLabel>Title</CFormLabel>
                      <CFormInput
                        type="text"
                        placeholder="Title"
                        {...register('title', { required: 'Title is required' })}
                        invalid={!!errors.title}
                      />
                      <CFormFeedback invalid>{errors.title?.message}</CFormFeedback>
                    </CCol>
                    <CCol xl={4} md={12}>
                      <CFormLabel>Date</CFormLabel>
                      <CFormInput
                        type="date"
                        {...register('date', { required: 'Date is required' })}
                        invalid={!!errors.date}
                        value={getValues('data')}
                        min={format(new Date(), 'yyyy-MM-dd')}
                      />
                      <CFormFeedback invalid>{errors.date?.message}</CFormFeedback>
                    </CCol>
                    <CCol xl={4} md={12}>
                      <CFormLabel>Day</CFormLabel>
                      <CFormInput
                        type="text"
                        {...register('day', { required: 'Day is required' })}
                        invalid={!!errors.day}
                      />
                      <CFormFeedback invalid>{errors.day?.message}</CFormFeedback>
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

export default Holidayform
