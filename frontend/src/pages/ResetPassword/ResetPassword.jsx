import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { axiosInstance } from '../../utils/axiosInstance'
import PasswordInput from '../../components/Input/PasswordInput'

function ResetPassword() {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    const { token } = useParams()
    const navigate = useNavigate()

    const handleResetPassword = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        if (!password || !confirmPassword) {
            return setError('Please enter your password')
        }

        if (password !== confirmPassword) {
            return setError('Passwords did not match')
        }

        // axiosInstance API call
        try {
            const response = await axiosInstance.post(`/api/auth/reset-password/${token}`, {
                password,
            })

            // handle successful login response
            if (response.data && response.data.message) {
                setSuccess(response.data.message)
                setTimeout(() => {
                    navigate('/login')
                }, 2000)
            }
        } catch (error) {
            console.log(error)
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message)
            } else {
                setError(error?.message)
            }
        }
    }

    const handleCancel = () => {
        navigate('/login')
    }

    return (
        <div className='flex items-center justify-center mt-28 '>
            <div className='w-1/4 border rounded bg-white px-8 pt-10 pb-4'>
                <h4 className='text-2xl font-medium mb-7'>Reset your Password</h4>
                <div className="mt-3 mb-2 border-b-[1px] border-slate-300 text-sm"></div>
                <p className='mb-3 font-normal text-sm'>Please enter your password</p>
                <div>
                    <PasswordInput
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <PasswordInput placeholder='Confirm your password'
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                    />

                    {error &&
                        <p className='text-red-500 text-xs pb-1'>{error}</p>
                    }
                    {success &&
                        <p className='text-green-500 text-xs pb-1'>{success}</p>
                    }
                </div>
                <div className="flex justify-end items-center gap-2">
                    <button className='btn-cancel font-medium w-24' onClick={handleCancel}>
                        Cancel
                    </button>
                    <button className='btn-primary font-medium w-36' onClick={handleResetPassword}>
                        Reset Password
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword
