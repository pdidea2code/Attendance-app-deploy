import { useEffect, useState } from 'react'
import {
  deleteAnnouncement,
  deleteMultiAnnouncement,
  getAllEmplloyee,
  getAnnouncement,
  getrole,
} from 'src/redux/api/api'
import * as Icons from '@mui/icons-material'
import swal from 'sweetalert'
import Cookies from 'js-cookie'
import { CSpinner } from '@coreui/react'
import { Button, IconButton } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import MUIDataTable from 'mui-datatables'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Announcement = () => {
  const [dataTableData, setDataTabledata] = useState([])
  const [baseUrl, setBaseUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const auth = useSelector((state) => state.auth)
  const [permission, setPermissions] = useState([])

  const getannouncement = async () => {
    try {
      setIsLoading(true)
      const res = await getAnnouncement()
      const data = res.data.info
      setDataTabledata(data)
      setBaseUrl(res.data.baseUrl)
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
  }, [])

  useEffect(() => {
    getannouncement()
  }, [])
  const columns = [
    {
      name: 'title',
      label: 'title',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'description',
      label: 'description',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'date',
      label: 'date',
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: 'image',
      label: 'image',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (image) =>
          image ? (
            <img
              src={`${baseUrl}${image}`}
              alt={image}
              style={{ height: '60px', width: '60px', borderRadius: '10px' }}
            />
          ) : (
            <span>Not Image</span>
          ),
      },
    },
  ]

  if (
    (Array.isArray(permission) && permission.includes('announcement.delete')) ||
    permission.includes('announcement.edit')
  ) {
    columns.push({
      name: '_id',
      label: 'Action',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value) => {
          return (
            <>
              {Array.isArray(permission) && permission.includes('announcement.edit') && (
                <Icons.EditRounded
                  className="editButton"
                  onClick={() => {
                    const editData = dataTableData.find((data) => data._id === value)
                    navigate('/announcementform', {
                      state: { editData: editData, imageUrl: baseUrl },
                    })
                  }}
                ></Icons.EditRounded>
              )}
              {Array.isArray(permission) && permission.includes('announcement.delete') && (
                <Icons.DeleteRounded
                  className="deleteButton"
                  onClick={async () => {
                    const confirm = await swal({
                      title: 'Are you sure?',
                      text: 'Are you sure? Want to delete announcement?',
                      icon: 'warning',
                      buttons: ['No, cancel it!', 'Yes, I am sure!'],
                      dangerMode: true,
                    })
                    if (confirm) {
                      deleteAnnouncement(value)
                        .then(() => {
                          getannouncement()
                          toast.success('Deleted successfully!')
                          swal({
                            title: 'Deleted successfully!',
                            icon: 'success',
                            button: 'close',
                          })
                        })
                        .catch((error) => {
                          console.log(error)
                          const errorMsg = error.response?.data?.message || 'Something went wrong'
                          toast.error(errorMsg)
                        })
                    }
                  }}
                />
              )}
            </>
          )
        },
      },
    })
  }

  const deleteMultiple = async (selectedRows) => {
    const ids = selectedRows.data.map((row) => dataTableData[row.dataIndex]._id)
    const confirm = await swal({
      title: 'Are you sure?',
      text: 'Are you sure that you want to delete selected Announcement?',
      icon: 'warning',
      buttons: ['No, cancel it!', 'Yes, I am sure!'],
      dangerMode: true,
    })

    if (confirm) {
      // console.log(ids)
      const data = {
        ids: ids,
      }
      deleteMultiAnnouncement(data)
        .then(() => {
          getannouncement()
          toast.success('Deleted successfully!', {
            key: ids.join(','),
          })
        })
        .catch((error) => {
          toast.error(error.response?.data?.message || 'Something went wrong')
        })
    }
  }

  const SelectedRowsToolbar = ({ selectedRows }) => {
    return (
      <div>
        <IconButton onClick={() => deleteMultiple(selectedRows)}>
          <Icons.Delete />
        </IconButton>
      </div>
    )
  }

  const options = {
    customToolbarSelect: (selectedRows) =>
      Array.isArray(permission) &&
      permission.includes('announcement.delete') && (
        <SelectedRowsToolbar selectedRows={selectedRows} />
      ),
  }

  return (
    <>
      {isLoading ? (
        <div className="d-flex justify-content-center">
          <CSpinner className="theme-spinner-color" />
        </div>
      ) : (
        <>
          <ToastContainer />
          {Array.isArray(permission) && permission.includes('announcement.add') && (
            <div className="right-text">
              <Button
                variant="contained"
                size="medium"
                className="AddButton"
                onClick={() => navigate('/announcementform')}
              >
                Add
              </Button>
            </div>
          )}
          <MUIDataTable
            title={'announcement'}
            data={dataTableData}
            columns={columns}
            options={options}
          />
        </>
      )}
    </>
  )
}

export default Announcement
