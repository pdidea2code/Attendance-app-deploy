import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter>
      <div>
        <span className="ms-1">&copy; 2024 </span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        Dashboard
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
