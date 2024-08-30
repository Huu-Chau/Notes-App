import React from 'react'
import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route } from 'react-router-dom'
import Home from "./pages/Home/Home"
import Login from "./pages/Login/Login"
import Register from "./pages/Register/Register"
import ForgottenPassword from './pages/ForgottenPassword/ForgottenPassword'
import ResetPassword from './pages/ResetPassword/ResetPassword'
import VerifyEmail from './pages/VerifyEmail/VerifyEmail'

const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route index element={<Login />} />
      <Route path='/dashboard' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/forget-password' element={<ForgottenPassword />} />
      <Route path='/auth/reset-password/:token' element={<ResetPassword />} />
      <Route path='/register' element={<Register />} />
      <Route path='/auth/verify-email' element={<VerifyEmail />} />
    </Route>
  )
)

function App() {
  return (
    <RouterProvider router={routes} />
  )
}

export default App
