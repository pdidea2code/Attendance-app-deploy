export const MAIN_URL = 'https://attendance-app-deploy.onrender.com'

/* ---------------------------- ALL Auth API ---------------------------- */
export const LOGIN_API = '/admin/login'
export const SEND_LINK_API = '/admin/checkEmailId'
export const VERIFY_LINK_API = '/admin/verifyLink'
export const RESET_PASSWORD_API = '/admin/resetPassword'
export const REGISTER_API = '/signup'
export const CHANGE_PASSWORD_API = '/admin/changePassword'
export const CHANGE_PROFILE = '/admin/changeProfile'

/* ---------------------------- END Auth API ---------------------------- */

/* ---------------------------- ALL ROLE API ---------------------------- */

export const GET_ALL_ROLE = '/admin/role/getAllRole'
export const CHANGE_PERMISSION = '/admin/role/changePermission'
export const GET_ROLE = '/admin/role/getRolle'
export const ADD_ROLE = '/admin/role/addRole'
export const DELETE_ROLE = '/admin/role/deleteRole'

/* ---------------------------- END ROLE API ---------------------------- */
/* ---------------------------- ALL Permission API ---------------------------- */

export const GET_PERMISSION = '/admin/permission/permissions'
export const DELETE_PERMISSION = '/admin/permission/deletePermission/'
export const ADD_PERMISSION = '/admin/permission/addPermission'

/* ---------------------------- END Permission API ---------------------------- */

/* ---------------------------- All Employee API ---------------------------- */

export const GET_EMPLOYEE = '/admin/employee/getAllUser'
export const ADD_EMPLOYEE = '/admin/employee/addUser'
export const UPDATE_EMPLOYEE = '/admin/employee/updateUser/'

/* ---------------------------- END Employee API ---------------------------- */

/* ---------------------------- All Admins API ---------------------------- */
export const GET_ADMINS = '/admin/admins/getAllAdmin'
export const ADD_ADMIN = '/admin/admins/addAdmin'
export const UPDATE_ADMIN = '/admin/admins/updateAdmin/'
export const DELETE_ADMIN = '/admin/admins/deleteAdmin/'
export const DELETEMULTI_ADMIN = '/admin/admins/deleteManyAdmin'

/* ---------------------------- END Admins API ---------------------------- */
/* ---------------------------- All Admins API ---------------------------- */

export const GET_ANNOUNCEMENT = '/admin/announcement/getAllAnnouncement'
export const ADD_ANNOUNCEMENT = '/admin/announcement/addAnnouncement'
export const UPDATE_ANNOUNCEMENT = '/admin/announcement/updateAnnouncement'
export const DELETE_ANNOUNCEMENT = '/admin/announcement/deleteAnnouncement/'
export const DELETEMULTI_ANNOUNCEMENT = '/admin/announcement/deleteManyAnnouncement'

/* ---------------------------- END Event API ---------------------------- */
/* ---------------------------- All Admins API ---------------------------- */
export const ADD_EVENT = '/admin/event/addEvent'
export const UPDATE_EVENT = '/admin/event/updateEvent'
export const GET_EVENT = '/admin/event/getAllEvents'
export const DELETE_EVENT = '/admin/event/deleteEvent/'
export const DELETEMULTI_EVENT = '/admin/event/deleteMultiEvent'
/* ---------------------------- END Event API ---------------------------- */

/* ---------------------------- All Holiday API ---------------------------- */
export const ADD_HOLIDAY = '/admin/holiday/addHoliday'
export const UPDATE_HOLIDAY = '/admin/holiday/updateHoliday'
export const GET_HOLIDAY = '/admin/holiday/getAllHolidays'
export const DELETE_HOLIDAY = '/admin/holiday/deleteHoliday/'
export const DELETEMULTI_HOLIDAY = '/admin/holiday/deleteMultiHoliday'
/* ---------------------------- END Admins API ---------------------------- */
/* ---------------------------- All month API ---------------------------- */
export const ADD_MONTH = '/admin/month/addMonth'
export const UPDATE_MONTH = '/admin/month/updateMonth '
export const GET_MONTH = '/admin/month/getMonth'
export const DELETE_MONTH = '/admin/month/deleteMonth/'
export const DELETEMULTI_MONTH = '/admin/month/deleteMultiMonth'
/* ---------------------------- END month API ---------------------------- */

/* ---------------------------- All Setting API ---------------------------- */

export const GET_SETTING = '/admin/setting/getSetting'
export const UPDATE_SETTING = '/admin/setting/updateSetting'

/* ---------------------------- END Setting API ---------------------------- */

/* ---------------------------- All Attendance API ---------------------------- */

export const GET_USERATTENDANCE = '/admin/attendance/getUseridAttendance'
export const GET_TOTAl_USERATTENDANCE = '/admin/attendance/getMonthAttendance'
export const GET_ATTENDANCE = '/admin/attendance/getAllAttendance'

/* ---------------------------- END Attendance API ---------------------------- */
/* ---------------------------- All leave API ---------------------------- */

export const GET_USER_LEAVE = '/admin/leave/getUserLeave'
export const CHANGE_STATUS = '/admin/leave/changeStatus'
export const GET_ALL_LEAVE = '/admin/leave/getallLeave'

/* ---------------------------- END leave API ---------------------------- */

/* ---------------------------- All GENERAL_SETTING API ---------------------------- */

export const GET_GENERAL_SETTING = '/admin/generalsetting/getGeneralsetting'
export const UPDATE_GENERAL_SETTING = '/admin/generalsetting/updateGeneralsetting'

/* ---------------------------- END GENERAL_SETTING API ---------------------------- */

/* ---------------------------- All dashbored API ---------------------------- */
export const DASHBOARD_ATTENDANCE_COUNT = '/admin/dashbord/getAttendanceCount'
export const DASHBOARD_LEAVE_REQUEST = '/admin/dashbord/leaveRequest'

/* ---------------------------- END dashbored API ---------------------------- */
