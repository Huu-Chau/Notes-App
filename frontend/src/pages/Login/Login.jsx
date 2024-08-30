import React, { useState } from 'react'
import PasswordInput from '../../components/Input/PasswordInput'
import { Link, useNavigate } from 'react-router-dom'
import { validateEmail } from '../../utils/helper'
import { axiosInstance } from '../../utils/axiosInstance'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.')
      return
    }

    if (!password) {
      setError('Please enter the password.')
      return
    }

    setError('')

    // axiosInstance API call
    try {
      const response = await axiosInstance.post('/api/auth/login', {
        email,
        password,
      })

      // if(response?.data?.status === 'unverified'){
      //   setError('User must verify before login')
      //   setTimeout(() => {

      //   }, 2000);
      // }

      // handle successful login response
      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken)
        navigate('/dashboard')
      }

    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message)
      } else {
        setError('An unexpected error ocurred. Please try again!')
      }
    }
  }
  return (
    <>
      <div className='flex items-center justify-center mt-28 '>
        <div className='w-96 border rounded bg-white px-8 py-10'>
          <form onSubmit={handleLogin}>
            <h4 className='text-2xl font-medium mb-7'>Log in</h4>
            <input
              type="text"
              placeholder='Email'
              className='input-box'
              value={email}
              onChange={e => {
                if (error) {
                  setError(null)
                }
                setEmail(e.target.value)
              }}
            />
            <PasswordInput
              value={password}
              onChange={e => setPassword(e.target.value)}
            />

            {error &&
              <p className='text-red-500 text-xs pb-1'>{error}</p>
            }

            <button type='submit' className='btn-primary font-medium'>
              Login
            </button>

          </form>

          <p className='font-medium flex justify-center text-sm text-center mt-3'>
            <Link to="/forget-password" className='text-primary hover:underline'>
              Forgotten password?
            </Link>
          </p>

          <div className="mt-5 mb-4 border-b-[1px] border-slate-300 text-sm"> </div>
          <p className='h-1 font-medium text-sm text-center mt-4'>
            Not registered yet?{" "}
            <Link to="/register" className='text-primary'>
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}

export default Login
