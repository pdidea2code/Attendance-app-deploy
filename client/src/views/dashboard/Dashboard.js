import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

import WidgetsBrand from '../widgets/WidgetsBrand'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import Leaverequest from './Leaverequest'
import { useDispatch, useSelector } from 'react-redux'
import { getRole } from 'src/redux/api/api'

const Dashboard = () => {
  const dispatch = useDispatch()
  const auth = useSelector((state) => state.auth)
  const [permission, setPermissions] = useState([])

  useEffect(() => {
    const fetchPermissions = async () => {
      await getRole(dispatch)
      setPermissions(auth.permission)
    }
    fetchPermissions()
  }, [])
  return (
    <>
      <ToastContainer />
      <WidgetsDropdown />
      <CRow>
        {Array.isArray(permission) && permission.includes('leave.view') && (
          <CCol md={12} xl={12}>
            <Leaverequest />
          </CCol>
        )}
      </CRow>
    </>
  )
}

export default Dashboard
