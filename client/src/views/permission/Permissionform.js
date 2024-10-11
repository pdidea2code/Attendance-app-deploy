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
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { addPermission } from 'src/redux/api/api'
const Permissionfrom = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm()
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const res = await addPermission(data)
      if (res.data.info) {
        navigate('/permission')
      }
    } catch (error) {
      console.log(error)
      setIsLoading(false)
      toast.error(error?.response?.data?.message || 'Error occurred')
    }
  }

  return (
    <>
      <div className="bg-light min-vh-100">
        <ToastContainer />
        <CContainer className="mt-3">
          <CRow>
            <CCol md={6}>
              <CCard>
                <CCardHeader>Permission Form</CCardHeader>
                <CCardBody>
                  <CForm className="row g-3" onSubmit={handleSubmit(onSubmit)}>
                    <CCol xl={12} md={12}>
                      <CFormLabel> Name</CFormLabel>
                      <CFormInput
                        type="text"
                        placeholder="Permission Name"
                        {...register('name', { required: 'Permission Name is required' })}
                        invalid={!!errors.name}
                      />
                      <CFormFeedback invalid> Name is required</CFormFeedback>
                    </CCol>
                    <CCol md={12} className="text-center submitButton">
                      {isLoading ? (
                        <CButton disabled>
                          <CSpinner component="span" size="sm" aria-hidden="true" />
                          Loading...
                        </CButton>
                      ) : (
                        <CButton type="submit" className="AddButton">
                          Add
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

export default Permissionfrom
