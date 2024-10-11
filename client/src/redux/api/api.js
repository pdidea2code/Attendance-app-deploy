import axios from 'axios'
import Cookies from 'js-cookie'
import React, { useState, useEffect } from 'react'
import {
  ADD_ADMIN,
  ADD_ANNOUNCEMENT,
  ADD_EMPLOYEE,
  ADD_EVENT,
  ADD_HOLIDAY,
  ADD_MONTH,
  ADD_PERMISSION,
  ADD_ROLE,
  CHANGE_PASSWORD_API,
  CHANGE_PERMISSION,
  CHANGE_PROFILE,
  CHANGE_STATUS,
  DASHBOARD_ATTENDANCE_COUNT,
  DASHBOARD_LEAVE_REQUEST,
  DELETE_ADMIN,
  DELETE_ANNOUNCEMENT,
  DELETE_EVENT,
  DELETE_HOLIDAY,
  DELETE_MONTH,
  DELETE_PERMISSION,
  DELETE_ROLE,
  DELETEMULTI_ADMIN,
  DELETEMULTI_ANNOUNCEMENT,
  DELETEMULTI_EVENT,
  DELETEMULTI_HOLIDAY,
  DELETEMULTI_MONTH,
  GET_ADMINS,
  GET_ALL_LEAVE,
  GET_ALL_ROLE,
  GET_ANNOUNCEMENT,
  GET_ATTENDANCE,
  GET_EMPLOYEE,
  GET_EVENT,
  GET_GENERAL_SETTING,
  GET_HOLIDAY,
  GET_MONTH,
  GET_PERMISSION,
  GET_ROLE,
  GET_SETTING,
  GET_TOTAl_USERATTENDANCE,
  GET_USER_LEAVE,
  GET_USERATTENDANCE,
  LOGIN_API,
  MAIN_URL,
  RESET_PASSWORD_API,
  SEND_LINK_API,
  UPDATE_ADMIN,
  UPDATE_ANNOUNCEMENT,
  UPDATE_EMPLOYEE,
  UPDATE_EVENT,
  UPDATE_GENERAL_SETTING,
  UPDATE_HOLIDAY,
  UPDATE_MONTH,
  UPDATE_SETTING,
  VERIFY_LINK_API,
} from 'src/constant'
import { PERMISSION } from '../actions/action'
import { useDispatch } from 'react-redux'

axios.interceptors.response.use(
  (response) => response,
  async (err) => {
    console.log(err)
    const originalRequest = err.config

    if (err.status == 402 && !originalRequest._retry) {
      originalRequest._retry = true

      // Cookies.remove('accessToken')
      // Cookies.remove('refreshToken')
      // Cookies.remove('permission')
      // window.location.reload()
      try {
        const refreshToken = Cookies.get('refreshToken')

        const res = await axios.post(`${MAIN_URL}/admin/refreshToken`, { refreshToken })

        const accessToken = res.data.info

        Cookies.set('token', accessToken, { sameSite: 'Strict', secure: true })

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`

        return axios(originalRequest)
      } catch (refresherr) {
        console.log('err refreshing token:', refresherr)
        // You might want to redirect to login or handle the err in another way
      }
    }

    if (err.response.status === 405) {
      Cookies.remove('accessToken')
      // window.location.reload()
    }
    return Promise.reject(err)
  },
)

// /* Get All General Seetings  */
// export const getGeneralSettings = () =>
//   axios.get(MAIN_URL + GET_GENERAL_SETTINGS_API, {
//     headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
//   })

/* ---------------------------- ALL GENERAL SETTINGS API ---------------------------- */

export const login = (data) => axios.post(MAIN_URL + LOGIN_API, data)
export const sendLink = (data) => axios.post(MAIN_URL + SEND_LINK_API, data)
export const verifyLink = (data) => axios.post(MAIN_URL + VERIFY_LINK_API, data)
export const resetPassword = (data) => axios.post(MAIN_URL + RESET_PASSWORD_API, data)
export const changePassword = (data) =>
  axios.post(MAIN_URL + CHANGE_PASSWORD_API, data, {
    headers: { Authorization: `Bearer ${Cookies.get('token')}` },
  })
export const changeProfile = (data) =>
  axios.post(MAIN_URL + CHANGE_PROFILE, data, {
    headers: { Authorization: `Bearer ${Cookies.get('token')}` },
  })
/* ---------------------------- END COMMENTS API ---------------------------- */
/* ------------------------------ ALL Role API ----------------------------- */
export const getallRole = () =>
  axios.get(MAIN_URL + GET_ALL_ROLE, {
    headers: { Authorization: `Bearer ${Cookies.get('token')}` },
  })

export const addRole = (data) =>
  axios.post(MAIN_URL + ADD_ROLE, data, {
    headers: { Authorization: `Bearer ${Cookies.get('token')}` },
  })

export const getRole = () =>
  axios.get(MAIN_URL + GET_ROLE, {
    headers: { Authorization: `Bearer ${Cookies.get('token')}` },
  })

export const changepermission = (data) =>
  axios.post(MAIN_URL + CHANGE_PERMISSION, data, {
    headers: { Authorization: `Bearer ${Cookies.get('token')}` },
  })
export const deleteRole = (data) =>
  axios.post(MAIN_URL + DELETE_ROLE, data, {
    headers: { Authorization: `Bearer ${Cookies.get('token')}` },
  })
/* ------------------------------ End Role API ----------------------------- */

/* ------------------------------ ALL Permission API ----------------------------- */

export const getPermission = (data) =>
  axios.get(MAIN_URL + GET_PERMISSION, {
    headers: { Authorization: `Bearer ${Cookies.get('token')}` },
  })
export const deletePermission = (id) =>
  axios.delete(MAIN_URL + DELETE_PERMISSION + id, {
    headers: { Authorization: `Bearer ${Cookies.get('token')}` },
  })
export const addPermission = (data) =>
  axios.post(MAIN_URL + ADD_PERMISSION, data, {
    headers: { Authorization: `Bearer ${Cookies.get('token')}` },
  })
/* ------------------------------ End Permission API ----------------------------- */

/* ------------------------------ ALL Employee API ----------------------------- */

export const getAllEmplloyee = () =>
  axios.get(MAIN_URL + GET_EMPLOYEE, {
    headers: { Authorization: `Bearer ${Cookies.get('token')}` },
  })

export const addEmplloyee = (data) =>
  axios.post(MAIN_URL + ADD_EMPLOYEE, data, {
    headers: { Authorization: `Bearer ${Cookies.get('token')}` },
  })
export const updateEmplloyee = (id, data) =>
  axios.post(MAIN_URL + UPDATE_EMPLOYEE + id, data, {
    headers: { Authorization: `Bearer ${Cookies.get('token')}` },
  })
/* ------------------------------ End Employee API ----------------------------- */

/* ------------------------------ ALL ADMIN API ----------------------------- */

export const getAllAdmins = () =>
  axios.get(MAIN_URL + GET_ADMINS, {
    headers: { Authorization: `Bearer ${Cookies.get('token')}` },
  })

export const addAdmin = (data) =>
  axios.post(MAIN_URL + ADD_ADMIN, data, {
    headers: { Authorization: `Bearer ${Cookies.get('token')}` },
  })

export const updateAdmin = (id, data) =>
  axios.post(MAIN_URL + UPDATE_ADMIN + id, data, {
    headers: { Authorization: `Bearer ${Cookies.get('token')}` },
  })

export const deleteAdmin = (id) =>
  axios.get(MAIN_URL + DELETE_ADMIN + id, {
    headers: { Authorization: `Bearer ${Cookies.get('token')}` },
  })
export const deleteMultiAdmin = (ids) =>
  axios.post(MAIN_URL + DELETEMULTI_ADMIN, ids, {
    headers: { Authorization: `Bearer ${Cookies.get('token')}` },
  })
/* ------------------------------ End ADMIN API ----------------------------- */

/* ------------------------------ ALL ANNOUNCEMENT API ----------------------------- */

export const getAnnouncement = (id) =>
  axios.get(MAIN_URL + GET_ANNOUNCEMENT, {
    headers: { Authorization: `Bearer ${Cookies.get('token')}` },
  })

export const addAnnouncement = (data) =>
  axios.post(MAIN_URL + ADD_ANNOUNCEMENT, data, {
    headers: { Authorization: `Bearer ${Cookies.get('token')}` },
  })
export const updateAnnouncement = (data) =>
  axios.post(MAIN_URL + UPDATE_ANNOUNCEMENT, data, {
    headers: { Authorization: `Bearer ${Cookies.get('token')}` },
  })
export const deleteAnnouncement = (id) =>
  axios.get(MAIN_URL + DELETE_ANNOUNCEMENT + id, {
    headers: { Authorization: `Bearer ${Cookies.get('token')}` },
  })
export const deleteMultiAnnouncement = (ids) =>
  axios.post(MAIN_URL + DELETEMULTI_ANNOUNCEMENT, ids, {
    headers: { Authorization: `Bearer ${Cookies.get('token')}` },
  })

/* ------------------------------ End ANNOUNCEMENT API ----------------------------- */
/* ------------------------------ ALL Holiday API ----------------------------- */
export const getHoliday = () =>
  axios.get(MAIN_URL + GET_HOLIDAY, {
    headers: { Authorization: `Bearer ${Cookies.get('token')}` },
  })
export const addHoliday = (data) =>
  axios.post(MAIN_URL + ADD_HOLIDAY, data, {
    headers: { Authorization: `Bearer ${Cookies.get('token')}` },
  })
export const updateHoliday = (data) =>
  axios.post(MAIN_URL + UPDATE_HOLIDAY, data, {
    headers: { Authorization: `Bearer ${Cookies.get('token')}` },
  })
export const deleteHoliday = (id) =>
  axios.post(MAIN_URL + DELETE_HOLIDAY + id, {
    headers: { Authorization: `Bearer ${Cookies.get('token')}` },
  })
export const deleteMultiHoliday = (ids) =>
  axios.post(MAIN_URL + DELETEMULTI_HOLIDAY, ids, {
    headers: { Authorization: `Bearer ${Cookies.get('token')}` },
  })
/* ------------------------------ End Holiday API ----------------------------- */
/* ------------------------------ ALL Event API ----------------------------- */
export const getEvent = () =>
  axios.get(MAIN_URL + GET_EVENT, {
    headers: { Authorization: `Bearer ${Cookies.get('token')}` },
  })
export const addEvent = (data) =>
  axios.post(MAIN_URL + ADD_EVENT, data, {
    headers: { Authorization: `Bearer ${Cookies.get('token')}` },
  })
export const updateEvent = (data) =>
  axios.post(MAIN_URL + UPDATE_EVENT, data, {
    headers: { Authorization: `Bearer ${Cookies.get('token')}` },
  })
export const deleteEvent = (id) =>
  axios.post(MAIN_URL + DELETE_EVENT + id, {
    headers: { Authorization: `Bearer ${Cookies.get('token')}` },
  })
export const deleteMultiEvent = (ids) =>
  axios.post(MAIN_URL + DELETEMULTI_EVENT, ids, {
    headers: { Authorization: `Bearer ${Cookies.get('token')}` },
  })
/* ------------------------------ End Event API ----------------------------- */
/* ------------------------------ ALL Month API ----------------------------- */
export const getMonth = () =>
  axios.get(MAIN_URL + GET_MONTH, {
    headers: { Authorization: `Bearer ${Cookies.get('token')}` },
  })
export const addMonth = (data) =>
  axios.post(MAIN_URL + ADD_MONTH, data, {
    headers: { Authorization: `Bearer ${Cookies.get('token')}` },
  })
export const updateMonth = (data) =>
  axios.post(MAIN_URL + UPDATE_MONTH, data, {
    headers: { Authorization: `Bearer ${Cookies.get('token')}` },
  })
export const deleteMonth = (id) =>
  axios.post(MAIN_URL + DELETE_MONTH + id, {
    headers: { Authorization: `Bearer ${Cookies.get('token')}` },
  })
export const deleteMultiMonth = (ids) =>
  axios.post(MAIN_URL + DELETEMULTI_MONTH, ids, {
    headers: { Authorization: `Bearer ${Cookies.get('token')}` },
  })
/* ------------------------------ End Event API ----------------------------- */
/* ------------------------------ ALL Setting API ----------------------------- */

export const getSetting = () =>
  axios.get(MAIN_URL + GET_SETTING, {
    headers: { Authorization: `Bearer ${Cookies.get('token')}` },
  })
export const updateSetting = (data) =>
  axios.post(MAIN_URL + UPDATE_SETTING, data, {
    headers: { Authorization: `Bearer ${Cookies.get('token')}` },
  })
/* ------------------------------ End Setting API ----------------------------- */
/* ------------------------------ ALL Setting API ----------------------------- */

export const getUserAttendance = (data) =>
  axios.post(MAIN_URL + GET_USERATTENDANCE, data, {
    headers: { Authorization: `Bearer ${Cookies.get('token')}` },
  })
export const getTotalAttendance = (data) =>
  axios.post(MAIN_URL + GET_TOTAl_USERATTENDANCE, data, {
    headers: { Authorization: `Bearer ${Cookies.get('token')}` },
  })
export const getAttendance = (data) =>
  axios.post(MAIN_URL + GET_ATTENDANCE, data, {
    headers: { Authorization: `Bearer ${Cookies.get('token')}` },
  })

/* ------------------------------ End Setting API ----------------------------- */
/* ------------------------------ ALL Setting API ----------------------------- */

export const getUserLeave = (data) =>
  axios.post(MAIN_URL + GET_USER_LEAVE, data, {
    headers: { Authorization: `Bearer ${Cookies.get('token')}` },
  })
export const changeStatus = (data) =>
  axios.post(MAIN_URL + CHANGE_STATUS, data, {
    headers: { Authorization: `Bearer ${Cookies.get('token')}` },
  })
export const getallLeave = () =>
  axios.post(MAIN_URL + GET_ALL_LEAVE, {
    headers: { Authorization: `Bearer ${Cookies.get('token')}` },
  })

/* ------------------------------ End Setting API ----------------------------- */

/* ------------------------------ ALL general Setting API ----------------------------- */

export const getGeneralSettintg = () =>
  axios.get(MAIN_URL + GET_GENERAL_SETTING, {
    headers: { Authorization: `Bearer ${Cookies.get('token')}` },
  })
export const updateGeneralSettintg = (data) =>
  axios.post(MAIN_URL + UPDATE_GENERAL_SETTING, data, {
    headers: { Authorization: `Bearer ${Cookies.get('token')}` },
  })

/* ------------------------------ End general Setting API ----------------------------- */

/* ------------------------------ ALL Dashboard API ----------------------------- */

export const getAttendanceCount = () =>
  axios.get(MAIN_URL + DASHBOARD_ATTENDANCE_COUNT, {
    headers: { Authorization: `Bearer ${Cookies.get('token')}` },
  })
  
export const getLeaveRequest = () =>
  axios.get(MAIN_URL + DASHBOARD_LEAVE_REQUEST, {
    headers: { Authorization: `Bearer ${Cookies.get('token')}` },
  })

/* ------------------------------ End Dashboard API ----------------------------- */
































































export function convertToDDMMYYYY(isoDateString) {
  const date = new Date(isoDateString)

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  return `${day}/${month}/${year}`
}

export const getrole = async (dispatch) => {
  //   const dispatch = useDispatch()
  try {
    const role = await getRole()
    const data = role.data.info

    Cookies.set('role', JSON.stringify(data.role))
    Cookies.set('permission', JSON.stringify(data.permissions))

    dispatch({
      type: PERMISSION,
      role: data.role,
      permission: data.permissions,
    })
  } catch (error) {
    console.log(error)
  }
}

export const minutesToHHMM = (minutes) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
}

export const Clock = () => {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date())
    }, 1000)

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId)
  }, [])

  const formatTime = (date) => {
    let hours = date.getHours()
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    const ampm = hours >= 12 ? 'PM' : 'AM'

    hours = hours % 12
    hours = hours ? hours : 12 // if hour is 0, set it to 12
    hours = String(hours).padStart(2, '0') // Format to always show two digits

    return `${hours}:${minutes}:${seconds} ${ampm}`
  }

  return (
    <div
      style={{
        fontSize: '16px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: 'gray',
        color: 'white',
        padding: '5px',
        borderRadius: '20px',
      }}
    >
      {formatTime(time)}
    </div>
  )
}
