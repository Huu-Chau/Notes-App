import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { axiosInstance } from '../../utils/axiosInstance'

function VerifyEmail() {
    const [validate, setValidate] = useState('')
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    const navigate = useNavigate()

    const handleVerify = async () => {
        const email = localStorage.getItem('email')
        const type = localStorage.getItem('type')
        setError('')
        setSuccess('')
        try {
            const response = await axiosInstance.post(`/api/auth/verify-email`, {
                email,
                type,
                otp: validate,
            })
            if (response?.data?.message && response?.data?.type == 'verify-email') {
                setSuccess(response.data.message)

                return setTimeout(() => {
                    navigate('/login')
                }, 2000);
            }
            if (response?.data?.message && response?.data?.type == 'reset-password') {
                setSuccess(response.data.message)

                return setTimeout(() => {
                    navigate('/auth/reset-password')
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
