import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { axiosInstance } from '../../utils/axiosInstance'
import { validateEmail } from '../../utils/helper'

function ForgottenPassword() {
    const [email, setEmail] = useState('')
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    const navigate = useNavigate()

    const handleForgetPassword = async () => {
        setError('')
        setSuccess('')

        if (!validateEmail(email)) {
            setError('Please enter a valid email address.')
            return
        }

        // axiosInstance API call
        try {
            const type = 'reset-password'
            const response = await axiosInstance.post('/api/auth/forget-password', {
                email,
                type,
            })
            // handle successful login response
            if (response.data && response.data.message) {
                localStorage.setItem("email", email)
                localStorage.setItem("type", type)

                setSuccess(response.data.message)
                setTimeout(() => {
                    navigate('/auth/verify-email')
                }, 3000);
            }
        } catch (error) {
            console.log(error?.message)
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
            <div className='w-2/5 border rounded bg-white px-8 pt-10 pb-4'>
                <h4 className='text-2xl font-medium mb-7'>Find your account</h4>
                <div className="mt-3 mb-2 border-b-[1px] border-slate-300 text-sm"></div>
                <p className='mb-3 font-normal'>Please enter your email address or mobile number to search for your account.</p>
                <div>
                    <input
                        type="text"
                        placeholder='Email address'
                        className='input-box'
                        value={email}
                        onChange={e => {
                            if (error) {
                                setError('Something went wrong when inserting email')
                            }
                            setEmail(e.target.value)
                        }}
                    />

                    {error &&
                        <p className='text-red-500 text-xs pb-1'>{error}</p>
                    }
                    {success &&
                        <p className='text-green-500 text-xs pb-1'>{success}</p>
                    }
                </div>
                <div className="mt-3 mb-4 border-b-[1px] border-slate-300 text-sm"></div>
                <div className="flex justify-end items-center gap-2">
                    <button className='btn-cancel font-medium w-24' onClick={handleCancel}>
                        Cancel
                    </button>
                    <button className='btn-primary font-medium w-24' onClick={handleForgetPassword}>
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ForgottenPassword
