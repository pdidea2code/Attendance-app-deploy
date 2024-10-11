import React, { Component, Suspense } from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import './scss/style.scss'
import { useSelector } from 'react-redux'

import MinimalLayout from './layout/MinimalLayout'
import Cookies from 'js-cookie'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Forgotpassword = React.lazy(() => import('./views/pages/login/Forgotpassword'))
const Resetpassword = React.lazy(() => import('./views/pages/login/Resetpassword'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

export default function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)

  const PublicRoute = () => {
    return isAuthenticated || Boolean(Cookies.get('token')) ? (
      <Navigate to="/dashboard" />
    ) : (
      <MinimalLayout />
    )
  }

  const PrivateRoute = () => {
    return isAuthenticated || Boolean(Cookies.get('token')) ? (
      <DefaultLayout />
    ) : (
      <Navigate to="/" />
    )
  }
  return (
    <BrowserRouter>
      <Suspense fallback={loading}>
        <Routes>
          <Route>
            <Route path="/" element={<PublicRoute />}>
              <Route exact path="/" name="Login Page" element={<Login />} />
              {/* <Route exact path="/register" name="register" element={<Register />} /> */}
              <Route
                exact
                path="/forgotpassword"
                name="forgot password"
                element={<Forgotpassword />}
              />
              <Route
                exact
                path="/resetpassword/:resetCode/:id"
                name="Reset Password"
                element={<Resetpassword />}
              />
            </Route>
          </Route>
          <Route exact path="/404" name="Page 404" element={<Page404 />} />
          <Route exact path="/500" name="Page 500" element={<Page500 />} />
          <Route path="/" element={<PrivateRoute />}>
            <Route path="*" name="Home" element={<DefaultLayout />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
