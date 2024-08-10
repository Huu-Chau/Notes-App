import React from 'react'
import { getInitials } from '../../utils/helper'
// Parent Navbar
const ProfileInfo = ({onLogout, userInfo}) => {
    return (
    <div className='flex items-center gap-3'>
        <div className='w-12 h-12 flex items-center justify-center bg-slate-100 font-bold text-slate-950 rounded-full cursor-pointer'>
            {getInitials(userInfo?.FullName)}
        </div>
        
        <div className='text-sm'>
            <p className='font-bold'>{userInfo?.FullName    }</p>
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
