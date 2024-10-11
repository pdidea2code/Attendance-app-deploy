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
import { addMonth, updateMonth } from 'src/redux/api/api'

const Monthform = () => {
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
      ? addMonth(data)
          .then((res) => {
            setIsLoading(false)
            if (res.status === 200) {
              navigate('/month')
            }
          })
          .catch((error) => {
            console.log(error)
            setIsLoading(false)
            const errorMsg = error.response?.data?.message || 'Something went wrong'
            toast.error(errorMsg)
          })
      : updateMonth(data)
          .then((res) => {
            setIsLoading(false)
            if (res.status === 200) {
              navigate('/month')
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
      setValue('day', state.editData.day)
      setValue('months', state.editData.month)
      setValue('year', state.editData.year)
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
                      <CFormLabel>Day</CFormLabel>
                      <CFormInput
                        type="number"
                        placeholder="Day"
                        {...register('day', { required: 'Day is required' })}
                        invalid={!!errors.day}
                        min="0"
                        max="31"
                      />
                      <CFormFeedback invalid>{errors.title?.message}</CFormFeedback>
                    </CCol>
                    <CCol xl={4} md={12}>
                      <CFormLabel>Month</CFormLabel>
                      <CFormInput
                        type="number"
                        placeholder="Month"
                        {...register('months', { required: 'Month is required' })}
                        invalid={!!errors.month}
                        min="1"
                        max="12"
                      />
                      <CFormFeedback invalid>{errors.month?.message}</CFormFeedback>
                    </CCol>
                    <CCol xl={4} md={12}>
                      <CFormLabel>Year</CFormLabel>
                      <CFormInput
                        type="number"
                        placeholder="Year"
                        {...register('year', { required: 'Year is required' })}
                        invalid={!!errors.year}
                        maxlength="4"
                      />
                      <CFormFeedback invalid>{errors.year?.message}</CFormFeedback>
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

export default Monthform
