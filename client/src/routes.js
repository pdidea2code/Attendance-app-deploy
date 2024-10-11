import Cookies from 'js-cookie'
import React from 'react'
import { getRole } from './redux/api/api'

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

const permissionsString = Cookies.get('permission') || '[]'
const permissions = cleanPermissions(permissionsString)

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Employee = React.lazy(() => import('./views/employee/Employee'))
const Employeeform = React.lazy(() => import('./views/employee/Employeeform'))
const Employeeprofile = React.lazy(() => import('./views/employee/Employeeprofile'))
const Permission = React.lazy(() => import('./views/permission/Permission'))
const Permissionform = React.lazy(() => import('./views/permission/Permissionform'))
const Role = React.lazy(() => import('./views/role/Role'))
const Roleform = React.lazy(() => import('./views/role/Roleform'))
const User = React.lazy(() => import('./views/user/User'))
const Userform = React.lazy(() => import('./views/user/Userform'))
const Announcement = React.lazy(() => import('./views/Announcement/Announcement'))
const Announcementform = React.lazy(() => import('./views/Announcement/Announcementfrom'))
const Event = React.lazy(() => import('./views/Event/Event'))
const Eventform = React.lazy(() => import('./views/Event/Eventform'))
const Holiday = React.lazy(() => import('./views/Holiday/Holiday'))
const Holidayform = React.lazy(() => import('./views/Holiday/Holidayform'))
const Setting = React.lazy(() => import('./views/Settings/Setting'))
const Month = React.lazy(() => import('./views/Month/Month'))
const Monthform = React.lazy(() => import('./views/Month/Monthform'))
const Attendance = React.lazy(() => import('./views/Attendance/Attendance'))
const Leave = React.lazy(() => import('./views/Leave/Leave'))
const Generalsetting = React.lazy(() => import('./views/Settings/Generalsetting'))
const Profile = React.lazy(() => import('./views/pages/login/Profile'))

const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography'))

// Base
const Accordion = React.lazy(() => import('./views/base/accordion/Accordion'))
const Breadcrumbs = React.lazy(() => import('./views/base/breadcrumbs/Breadcrumbs'))
const Cards = React.lazy(() => import('./views/base/cards/Cards'))
const Carousels = React.lazy(() => import('./views/base/carousels/Carousels'))
const Collapses = React.lazy(() => import('./views/base/collapses/Collapses'))
const ListGroups = React.lazy(() => import('./views/base/list-groups/ListGroups'))
const Navs = React.lazy(() => import('./views/base/navs/Navs'))
const Paginations = React.lazy(() => import('./views/base/paginations/Paginations'))
const Placeholders = React.lazy(() => import('./views/base/placeholders/Placeholders'))
const Popovers = React.lazy(() => import('./views/base/popovers/Popovers'))
const Progress = React.lazy(() => import('./views/base/progress/Progress'))
const Spinners = React.lazy(() => import('./views/base/spinners/Spinners'))
const Tables = React.lazy(() => import('./views/base/tables/Tables'))
const Tooltips = React.lazy(() => import('./views/base/tooltips/Tooltips'))

// Buttons
const Buttons = React.lazy(() => import('./views/buttons/buttons/Buttons'))
const ButtonGroups = React.lazy(() => import('./views/buttons/button-groups/ButtonGroups'))
const Dropdowns = React.lazy(() => import('./views/buttons/dropdowns/Dropdowns'))

//Forms
const ChecksRadios = React.lazy(() => import('./views/forms/checks-radios/ChecksRadios'))
const FloatingLabels = React.lazy(() => import('./views/forms/floating-labels/FloatingLabels'))
const FormControl = React.lazy(() => import('./views/forms/form-control/FormControl'))
const InputGroup = React.lazy(() => import('./views/forms/input-group/InputGroup'))
const Layout = React.lazy(() => import('./views/forms/layout/Layout'))
const Range = React.lazy(() => import('./views/forms/range/Range'))
const Select = React.lazy(() => import('./views/forms/select/Select'))
const Validation = React.lazy(() => import('./views/forms/validation/Validation'))

const Charts = React.lazy(() => import('./views/charts/Charts'))

// Icons
const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'))
const Flags = React.lazy(() => import('./views/icons/flags/Flags'))
const Brands = React.lazy(() => import('./views/icons/brands/Brands'))

// Notifications
const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'))
const Badges = React.lazy(() => import('./views/notifications/badges/Badges'))
const Modals = React.lazy(() => import('./views/notifications/modals/Modals'))
const Toasts = React.lazy(() => import('./views/notifications/toasts/Toasts'))

const Widgets = React.lazy(() => import('./views/widgets/Widgets'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  // { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  // { path: '/employee', name: 'Employee', element: Employee },
  // { path: '/permission', name: 'Permission', element: Permission },
  // { path: '/permissionform', name: 'Permission Form', element: Permissionform },
  // { path: '/role', name: 'Role', element: Role },
  // { path: '/roleform', name: 'Roleform', element: Roleform },
  // { path: '/roleform', name: 'Roleform', element: Roleform },

  { path: '/theme', name: 'Theme', element: Colors, exact: true },
  { path: '/theme/colors', name: 'Colors', element: Colors },
  { path: '/theme/typography', name: 'Typography', element: Typography },
  { path: '/base', name: 'Base', element: Cards, exact: true },
  { path: '/base/accordion', name: 'Accordion', element: Accordion },
  { path: '/base/breadcrumbs', name: 'Breadcrumbs', element: Breadcrumbs },
  { path: '/base/cards', name: 'Cards', element: Cards },
  { path: '/base/carousels', name: 'Carousel', element: Carousels },
  { path: '/base/collapses', name: 'Collapse', element: Collapses },
  { path: '/base/list-groups', name: 'List Groups', element: ListGroups },
  { path: '/base/navs', name: 'Navs', element: Navs },
  { path: '/base/paginations', name: 'Paginations', element: Paginations },
  { path: '/base/placeholders', name: 'Placeholders', element: Placeholders },
  { path: '/base/popovers', name: 'Popovers', element: Popovers },
  { path: '/base/progress', name: 'Progress', element: Progress },
  { path: '/base/spinners', name: 'Spinners', element: Spinners },
  { path: '/base/tables', name: 'Tables', element: Tables },
  { path: '/base/tooltips', name: 'Tooltips', element: Tooltips },
  { path: '/buttons', name: 'Buttons', element: Buttons, exact: true },
  { path: '/buttons/buttons', name: 'Buttons', element: Buttons },
  { path: '/buttons/dropdowns', name: 'Dropdowns', element: Dropdowns },
  { path: '/buttons/button-groups', name: 'Button Groups', element: ButtonGroups },
  { path: '/charts', name: 'Charts', element: Charts },
  { path: '/forms', name: 'Forms', element: FormControl, exact: true },
  { path: '/forms/form-control', name: 'Form Control', element: FormControl },
  { path: '/forms/select', name: 'Select', element: Select },
  { path: '/forms/checks-radios', name: 'Checks & Radios', element: ChecksRadios },
  { path: '/forms/range', name: 'Range', element: Range },
  { path: '/forms/input-group', name: 'Input Group', element: InputGroup },
  { path: '/forms/floating-labels', name: 'Floating Labels', element: FloatingLabels },
  { path: '/forms/layout', name: 'Layout', element: Layout },
  { path: '/forms/validation', name: 'Validation', element: Validation },
  { path: '/icons', exact: true, name: 'Icons', element: CoreUIIcons },
  { path: '/icons/coreui-icons', name: 'CoreUI Icons', element: CoreUIIcons },
  { path: '/icons/flags', name: 'Flags', element: Flags },
  { path: '/icons/brands', name: 'Brands', element: Brands },
  { path: '/notifications', name: 'Notifications', element: Alerts, exact: true },
  { path: '/notifications/alerts', name: 'Alerts', element: Alerts },
  { path: '/notifications/badges', name: 'Badges', element: Badges },
  { path: '/notifications/modals', name: 'Modals', element: Modals },
  { path: '/notifications/toasts', name: 'Toasts', element: Toasts },
  { path: '/widgets', name: 'Widgets', element: Widgets },
]

const userdetail = safeParse(Cookies.get('admin'), {})

if (permissions.includes('dashboard.view')) {
  routes.push({ path: '/dashboard', name: 'Dashboard', element: Dashboard })
}
if (permissions.includes('dashboard.view')) {
  routes.push({ path: '/profile', name: 'Profile', element: Profile })
}
if (permissions.includes('employee.view')) {
  routes.push({ path: '/employee', name: 'Employee', element: Employee })
}
if (permissions.includes('employee.add') || permissions.includes('employee.edit')) {
  routes.push({ path: '/employeeform', name: 'Employee form', element: Employeeform })
}
if (permissions.includes('employee.profile')) {
  routes.push({ path: '/employeeprofile', name: 'Employee profile', element: Employeeprofile })
}
if (permissions.includes('permission.view')) {
  routes.push({ path: '/permission', name: 'Permission', element: Permission })
}
if (permissions.includes('permission.add') || permissions.includes('permission.edit')) {
  routes.push({ path: '/permissionform', name: 'Permission Form', element: Permissionform })
}
if (permissions.includes('role.view')) {
  routes.push({ path: '/role', name: 'Role', element: Role })
}
if (permissions.includes('role.add') || permissions.includes('role.edit')) {
  routes.push({ path: '/roleform', name: 'Roleform', element: Roleform })
}
if (permissions.includes('admin.view')) {
  routes.push({ path: '/user', name: 'User', element: User })
}
if (permissions.includes('admin.add') || permissions.includes('admin.edit')) {
  routes.push({ path: '/userform', name: 'User form', element: Userform })
}
if (permissions.includes('announcement.view')) {
  routes.push({ path: '/announcement', name: 'Announcement', element: Announcement })
}
if (permissions.includes('announcement.add') || permissions.includes('announcement.edit')) {
  routes.push({ path: '/announcementform', name: 'Announcement form', element: Announcementform })
}

if (permissions.includes('event.view')) {
  routes.push({ path: '/event', name: 'Event', element: Event })
}

if (permissions.includes('event.add') || permissions.includes('event.edit')) {
  routes.push({ path: '/eventform', name: 'Event form', element: Eventform })
}

if (permissions.includes('holiday.view')) {
  routes.push({ path: '/holiday', name: 'Holiday', element: Holiday })
}

if (permissions.includes('holiday.add') || permissions.includes('holiday.edit')) {
  routes.push({ path: '/holidayform', name: 'Holiday form', element: Holidayform })
}

if (permissions.includes('setting.view')) {
  routes.push({ path: '/setting', name: 'Setting', element: Setting })
}
if (permissions.includes('month.view')) {
  routes.push({ path: '/month', name: 'Month', element: Month })
}
if (permissions.includes('month.add') || permissions.includes('month.edit')) {
  routes.push({ path: '/monthform', name: 'Month form', element: Monthform })
}
if (permissions.includes('attendance.view')) {
  routes.push({ path: '/attendance', name: 'Attendance', element: Attendance })
}
if (permissions.includes('leave.view')) {
  routes.push({ path: '/leave', name: 'Leave', element: Leave })
}
if (permissions.includes('generalsetting.view')) {
  routes.push({ path: '/generalsetting', name: 'General Setting', element: Generalsetting })
}
export default routes
