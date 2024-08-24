import React, { useState } from 'react'
import PasswordInput from '../../components/Input/PasswordInput'
import { Link } from 'react-router-dom'
import { validateEmail } from '../../utils/helper'
import { axiosInstance } from '../../utils/axiosInstance'

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const handleRegister = async (e) => {
    e.preventDefault()

    if (!name) {
      setError('Please enter your name.')
      return
    } else if (name.length < 8) {
      setError('The username should be at least 8 charaters long.')
      return
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.')
      return
    }

    if (!password) {
      setError('Please enter your password.')
      return
    } else if (password.length < 8) {
      setError('The password should be at least 8 charaters long.')
      return
    }

    setError('')
    setSuccess('')

    // axiosInstance API call
    try {
      const response = await axiosInstance.post('/api/auth/register', {
        fullName: name,
        email: email,
        password: password
      })

      // handle successful register response
      if (response?.data?.message && response?.data?.accessToken) {
        localStorage.setItem("token", response.data.accessToken)

        setSuccess(response.data.message)

        setTimeout(() => {
          navigate('/login')
        }, 1000);
      }
    } catch (error) {
      // handle register error
      console.log(error)
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
          <form onSubmit={handleRegister}>
            <h4 className='text-2xl font-medium mb-7'>Register</h4>
            <input
              type="text"
              placeholder='Name'
              className='input-box'
              value={name}
              onChange={e => { setName(e.target.value) }}
            />

            <input
              type="text"
              placeholder='Email'
              className='input-box'
              value={email}
              onChange={e => { setEmail(e.target.value) }}
            />

            <PasswordInput
              value={password}
              onChange={e => setPassword(e.target.value)}
            />

            {error &&
              <p className='text-red-500 text-xs pb-1'>{error}</p>
            }

            {success &&
              <p className='text-green-500 text-xs pb-1'>{success}</p>
            }

            <button type='submit' className='btn-primary font-medium'>
              Register
            </button>

            <p className='font-medium text-sm text-center mt-4'>
              Already have an account?{" "}
              <Link to="/login" className='text-primary underline'>
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  )
}

export default Register
