import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
  CSpinner,
} from '@coreui/react'
import { useForm, Controller } from 'react-hook-form'
import ReactQuill from 'react-quill'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'react-quill/dist/quill.snow.css'
import { getGeneralSettintg, getrole, updateGeneralSettintg } from 'src/redux/api/api'
import { useDispatch, useSelector } from 'react-redux'

const Generalsetting = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [setting, setSetting] = useState({})
  const dispatch = useDispatch()
  const auth = useSelector((state) => state.auth)
  const [permission, setPermissions] = useState([])

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm()

  const getgeneralsetting = async () => {
    try {
      const res = await getGeneralSettintg()
      const data = res.data.info
      setSetting(data)
      setValue('mapapikey', data.mapapikey)
      setValue('email', data.email)
      setValue('password', data.password)
      setValue('privacypolicy', data.privacypolicy)
      setValue('termsandcondition', data.termsandcondition)
    } catch (error) {
      console.log(error)
      setIsLoading(false)
      toast.error(error.response?.data?.message || 'Error occurred')
    }
  }

  const onSubmit = async (data) => {
    setIsLoading(true)

    try {
      const res = await updateGeneralSettintg(data)

      const datas = res.data.info
      setSetting(datas)
      if (res.status === 200) {
        toast.success('Update Successfully')
      }
    } catch (error) {
      console.log(error)

      toast.error(error.response?.data?.message || 'Error occurred')
    } finally {
      getGeneralSettintg()
      setIsLoading(false)
    }
  }
  useEffect(() => {
    const fetchPermissions = async () => {
      await getrole(dispatch)
      setPermissions(auth.permission)
    }
    fetchPermissions()
  }, [])

  useEffect(() => {
    getgeneralsetting()
  }, [])

  return (
    <>
      <ToastContainer />

      <CRow>
        <CCol xs={12} md={12}>
          <CCard className="mb-4">
            <CCardBody>
              <CForm className="row g-3" onSubmit={handleSubmit(onSubmit)}>
                <CCol md={6}>
                  <CFormLabel>Google Map API key</CFormLabel>
                  <CFormInput
                    type="text"
                    {...register('mapapikey', { required: 'Google Map API key Id is required' })}
                    invalid={!!errors.mapapikey}
                  />
                  {errors.mapapikey && (
                    <small className="text-danger">{errors.mapapikey.message}</small>
                  )}
                </CCol>
                {/* Email Settings */}
                <CCol md={12} className="form-header">
                  <div>SMTP Email Setting</div>
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    name="email"
                    type="text"
                    label="Email Id"
                    {...register('email', { required: 'Email Id is required' })}
                    invalid={!!errors.email}
                  />
                  {errors.email && <small className="text-danger">{errors.email.message}</small>}
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    name="password"
                    type="password"
                    label="Password"
                    {...register('password', { required: 'Password is required' })}
                    invalid={!!errors.password}
                  />
                  {errors.password && (
                    <small className="text-danger">{errors.password.message}</small>
                  )}
                </CCol>

                {/* Privacy Policy */}
                <CCol md={12} className="form-header">
                  <div>Privacy Policy</div>
                </CCol>
                <CCol md={12} className="mb-5">
                  <Controller
                    name="privacypolicy"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <ReactQuill
                        value={field.value || ''}
                        onChange={field.onChange}
                        style={{ height: '200px', border: 'none' }}
                      />
                    )}
                  />
                </CCol>

                {/* Terms & Condition */}
                <CCol md={12} className="form-header">
                  <div>Terms & Condition</div>
                </CCol>

                <CCol md={12} className="mb-5">
                  <Controller
                    name="termsandcondition"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <ReactQuill
                        value={field.value || ''}
                        onChange={field.onChange}
                        style={{ height: '200px', border: 'none' }}
                      />
                    )}
                  />
                </CCol>

                {/* Submit Button */}
                <CCol xs={12} className="mt-5">
                  {isLoading ? (
                    <CSpinner />
                  ) : (
                    <CButton color="primary" type="submit">
                      Submit
                    </CButton>
                  )}
                </CCol>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Generalsetting
