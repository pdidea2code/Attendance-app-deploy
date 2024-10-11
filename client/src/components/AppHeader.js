import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  CImage,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilBell, cilEnvelopeOpen, cilList, cilMenu } from '@coreui/icons'

import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'
import { logo } from 'src/assets/brand/logo'
import { Clock, getrole } from 'src/redux/api/api'
import Cookies from 'js-cookie'
import logoNegative from 'src/assets/brand/Group 48.svg'

const AppHeader = () => {
  const [usertype, setUserType] = useState('')
  const [username, setUsername] = useState('')
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebar.sidebarShow)
  const auth = useSelector((state) => state.auth)

  useEffect(() => {
    if (auth.admin) {
      setUserType(auth.admin.role.toUpperCase())
      setUsername(auth.admin.name)
    }
    const user = JSON.parse(Cookies.get('admin'))
    if (user) {
      setUserType(user.role.toUpperCase())
      setUsername(user.name)
    }
  }, [])

  useEffect(() => {
    if (auth.permission === null) {
      getrole(dispatch)
    }
  }, [])

  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
        <CHeaderToggler
          className="ps-1"
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderBrand className="mx-auto d-md-none" to="/">
          <CImage src={logoNegative} height={50} alt="Logo" />
        </CHeaderBrand>
        <CHeaderNav className="d-none d-md-flex me-auto">
          <CNavItem>
            <CNavLink to="/dashboard" component={NavLink}>
              {usertype} Dashboard
            </CNavLink>
          </CNavItem>
        </CHeaderNav>
        <CHeaderNav>
          <CNavItem>
            {' '}
            <CNavLink>
              <Clock />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink>
              <span>{username}</span>
            </CNavLink>
          </CNavItem>
        </CHeaderNav>
        <CHeaderNav className="ms-3">
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      <CHeaderDivider />
      <CContainer fluid>
        <AppBreadcrumb />
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
