import { useState, useEffect } from 'react'
import swal from 'sweetalert'
import { CCard, CCardBody, CCardHeader, CCol, CContainer, CRow, CSpinner } from '@coreui/react'
import { deleteRole, getallRole, getrole } from 'src/redux/api/api'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Button } from '@mui/material'

import { useNavigate } from 'react-router-dom'
import * as Icons from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'

const Role = () => {
  const [roles, setRoles] = useState([])
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [permission, setPermissions] = useState([])
  const auth = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  const getroll = async () => {
    try {
      setIsLoading(true)
      const res = await getallRole()
      setRoles(res.data.info)
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || 'Failed to fetch roles')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const fetchPermissions = async () => {
      await getrole(dispatch)
      setPermissions(auth.permission)
    }
    fetchPermissions()
  }, []) // Add auth.permission to dependency array

  useEffect(() => {
    getroll()
  }, []) // Add permission to dependency array

  return (
    <CContainer>
      <ToastContainer draggable />
      {isLoading ? (
        <div className="d-flex justify-content-center">
          <CSpinner className="theme-spinner-color" />
        </div>
      ) : (
        <CRow>
          <CCol md={12} xl={10}>
            {permission.includes('role.add') && (
              <div className="right-text">
                <Button
                  variant="contained"
                  size="medium"
                  className="AddButton"
                  onClick={() => navigate('/roleform', { state: { role: 'user' } })}
                >
                  Add
                </Button>
              </div>
            )}
            {roles.map((data) => (
              <CCard key={data._id} className="mb-2">
                <CCardHeader>
                  <CRow>
                    <CCol md={10} xl={10}>
                      {data.name}
                    </CCol>
                    <CCol md={2} xl={2}>
                      {permission.includes('role.delete') && (
                        <Icons.DeleteRounded
                          onClick={async () => {
                            const confirm = await swal({
                              title: 'Are you sure?',
                              text: 'Are you sure? Want to delete this role? All related data will also be deleted.',
                              icon: 'warning',
                              buttons: ['No, cancel it!', 'Yes, I am sure!'],
                              dangerMode: true,
                            })
                            if (confirm) {
                              try {
                                await deleteRole({ id: data._id })
                                toast.success('Deleted successfully!')
                                getroll() // Refresh the roles list
                              } catch (error) {
                                toast.error(error?.response?.data?.message || 'Error occurred')
                              }
                            }
                          }}
                        />
                      )}
                      {permission.includes('role.edit') && (
                        <Icons.EditRounded
                          className="editButton"
                          onClick={() => navigate('/roleform', { state: { editData: data } })}
                        />
                      )}
                    </CCol>
                  </CRow>
                </CCardHeader>
                <CCardBody>
                  {data.permission.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                      {data.permission
                        .sort((a, b) => a.localeCompare(b))
                        .map((perm, index) => (
                          <span
                            key={index}
                            style={{
                              backgroundColor: '#D93D4A',
                              padding: '5px',
                              color: 'white',
                              borderRadius: '20px',
                            }}
                          >
                            {perm}
                          </span>
                        ))}
                    </div>
                  ) : (
                    <h1>Permission Not Allowed</h1>
                  )}
                </CCardBody>
              </CCard>
            ))}
          </CCol>
        </CRow>
      )}
    </CContainer>
  )
}

export default Role
