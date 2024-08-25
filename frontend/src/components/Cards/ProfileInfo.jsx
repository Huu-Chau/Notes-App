import React, { useContext } from 'react'
import { getInitials } from '../../utils/helper'
import { userInfoContext } from '../../pages/Home/Home'
// Parent Navbar
const ProfileInfo = ({ onLogout }) => {
    const userInfo = useContext(userInfoContext)
    return (
        <div className='flex items-center gap-3'>
            <div className='w-12 h-12 flex items-center justify-center bg-slate-100 font-bold text-slate-950 rounded-full cursor-pointer'>
                {getInitials(userInfo?.fullName)}
            </div>

            <div className='text-sm'>
                <p className='font-bold'>{userInfo?.fullName}</p>
                <button
                    className='font-semibold text-slate-700 underline'
                    onClick={onLogout}
                >
                    Log out
                </button>
            </div>
        </div>
    )
}

export default ProfileInfo
