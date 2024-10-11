import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSettings,
  cilSpeedometer,
  cilStar,
  cilUser,
} from '@coreui/icons'
import { CImage, CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import Cookies from 'js-cookie'
import { getRole } from './redux/api/api'
import Announcement from './assets/images/icon/announcement.svg'
import event from './assets/images/icon/event.svg'
import employee from './assets/images/icon/employee.svg'
import holiday from './assets/images/icon/holiday.svg'
import role from './assets/images/icon/role.svg'
import permission from './assets/images/icon/permission.svg'
import month from './assets/images/icon/month.svg'
import attendance from './assets/images/icon/attendance.svg'
import leave from './assets/images/icon/leave.svg'
import setting from './assets/images/icon/setting.svg'

const getrole = async () => {
  try {
    const role = await getRole()
    const data = role.data.info

    Cookies.set('role', JSON.stringify(data.role))
    Cookies.set('permission', JSON.stringify(data.permissions)) // Ensure permissions are stored as a JSON string
  } catch (error) {
    console.error('Error fetching role data:', error)
  }
}

// Fetch role data if cookies don't exist
setTimeout(() => {
  getrole()
}, 0)

// Helper function to safely parse cookies
const safeParse = (value, defaultValue) => {
  try {
    return JSON.parse(value)
  } catch (e) {
    console.error('Error parsing JSON:', e)
    return defaultValue
  }
}

// Helper function to clean and parse permissions
export const cleanPermissions = (permissionsString) => {
  try {
    return JSON.parse(permissionsString.replace(/\\/g, ''))
  } catch (e) {
    console.error('Error parsing permissions:', e)
    return []
  }
}

const permissionsString = Cookies.get('permission') || '[]' // Default to empty array if cookie is not set
const permissions = cleanPermissions(permissionsString)

const _nav = [
  // {
  //   component: CNavItem,
  //   name: 'Dashboard',
  //   to: '/dashboard',
  //   icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavItem,
  //   name: 'Employee',
  //   to: '/employee',
  //   icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavItem,
  //   name: 'Role',
  //   to: '/role',
  //   icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavItem,
  //   name: 'Permission',
  //   to: '/permission',
  //   icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavItem,
  //   name: 'Docs',
  //   href: 'https://coreui.io/react/docs/templates/installation/',
  //   icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  // },
]

const dropdwon = {
  component: CNavGroup,
  name: 'Settings',
  to: '/setting',
  icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
  items: [],
}

if (permissions.includes('dashboard.view')) {
  _nav.push({
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  })
}
if (permissions.includes('employee.view')) {
  _nav.push({
    component: CNavItem,
    name: 'Employee',
    to: '/employee',
    icon: <CImage src={employee} alt="employee" className="nav-icon" />,
  })
}
if (permissions.includes('admin.view')) {
  _nav.push({
    component: CNavItem,
    name: 'User',
    to: '/user',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  })
}
if (permissions.includes('announcement.view')) {
  _nav.push({
    component: CNavItem,
    name: 'Announcement',
    to: '/announcement',
    icon: <CImage src={Announcement} alt="Announcement" className="nav-icon" />,
  })
}
if (permissions.includes('event.view')) {
  _nav.push({
    component: CNavItem,
    name: 'Event',
    to: '/event',
    icon: <CImage src={event} alt="event" className="nav-icon" />,
  })
}
if (permissions.includes('holiday.view')) {
  _nav.push({
    component: CNavItem,
    name: 'Holiday',
    to: '/holiday',
    icon: <CImage src={holiday} alt="holiday" className="nav-icon" />,
  })
}

if (permissions.includes('attendance.view')) {
  _nav.push({
    component: CNavItem,
    name: 'Attendance',
    to: '/attendance',
    icon: <CImage src={attendance} alt="holiday" className="nav-icon" />,
  })
}
if (permissions.includes('leave.view')) {
  _nav.push({
    component: CNavItem,
    name: 'Leave',
    to: '/leave',
    icon: <CImage src={leave} alt="holiday" className="nav-icon" />,
  })
}

if (permissions.includes('role.view')) {
  dropdwon.items.push({
    component: CNavItem,
    name: 'Role',
    to: '/role',
    icon: <CImage src={role} alt="role" className="nav-icon" />,
  })
}

if (permissions.includes('permission.view')) {
  dropdwon.items.push({
    component: CNavItem,
    name: 'Permission',
    to: '/permission',
    icon: <CImage src={permission} alt="permission" className="nav-icon" />,
  })
}
if (permissions.includes('setting.view')) {
  dropdwon.items.push({
    component: CNavItem,
    name: 'Setting',
    to: '/setting',
    icon: <CImage src={setting} alt="permission" className="nav-icon" />,
  })
}
if (permissions.includes('month.view')) {
  dropdwon.items.push({
    component: CNavItem,
    name: 'Month Setting',
    to: '/month',
    icon: <CImage src={month} alt="month" className="nav-icon" />,
  })
}
if (permissions.includes('generalsetting.view')) {
  dropdwon.items.push({
    component: CNavItem,
    name: 'Genetral Setting',
    to: '/generalsetting',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
  })
}

if (
  permissions.includes('role.view') ||
  permissions.includes('permission.view') ||
  permissions.includes('setting.view') ||
  permissions.includes('month.view') ||
  permissions.includes('generalsetting.view')
) {
  _nav.push(dropdwon)
}

export default _nav
