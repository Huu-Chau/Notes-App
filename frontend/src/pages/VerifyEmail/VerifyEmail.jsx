import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { axiosInstance } from '../../utils/axiosInstance'

function VerifyEmail() {
    const [validate, setValidate] = useState('')
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    const navigate = useNavigate()
    const { search } = useLocation()

    const handleVerify = async () => {
        try {
            const response = await axiosInstance.post(`/api/auth/verify-email${search}`, {
                otp: validate,
            })
            if (response?.data?.message) {
                setSuccess(response.data.message)
                setTimeout(() => {
                    navigate('/login')
                }, 2000);
            }
        } catch (error) {
            console.log(error)
            setError(error?.response?.data?.message)
        }
    }

    const handleCancel = () => {
        navigate('/login')
    }

    return (
        <div className='flex items-center justify-center mt-28 '>
            <div className='w-1/4 border rounded bg-white px-8 pt-10 pb-4'>
                <h4 className='text-2xl font-medium mb-7'>OTP verification</h4>
                <div>
                    <input type="text" value={validate} onChange={e => setValidate(e.target.value)} placeholder='Enter your OTP here' className='input-box' />

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
                    <button className='btn-primary font-medium w-24' onClick={handleVerify}>
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    )
}

export default VerifyEmail
