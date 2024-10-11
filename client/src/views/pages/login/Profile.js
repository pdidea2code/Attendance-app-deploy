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
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Changepassword from './Changepassword'
import Profileform from './Profiefom'

const Profile = () => {
  return (
    <>
      <div className="bg-light min-vh-100">
        <ToastContainer />
        <CContainer className="mt-3">
          <CRow>
            <CCol md={6}>
              <Profileform />
            </CCol>
            <CCol md={6}>
              <Changepassword />
            </CCol>
          </CRow>
        </CContainer>
      </div>
    </>
  )
}

export default Profile
