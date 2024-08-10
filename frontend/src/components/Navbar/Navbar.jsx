import React, { useState } from 'react'
import ProfileInfo from '../Cards/ProfileInfo'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../SearchBar/SearchBar'
// Parent: Login, Home, Register
function Navbar({ userInfo, onSearchNotes, handleClearSearch }) {
  const [searchQuery, setSearchQuery] = useState('')

  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  // search input notes from database
  const handleSearch = async () => {
    if (searchQuery) {
      onSearchNotes(searchQuery)
    }
  }

  const onClearSearch = () => {
    setSearchQuery('')
    handleClearSearch()
  }

  return (
    <div className='bg-white flex items-center justify-between px-6 py-2 drop-shadow'>
      <h2 className='text-xl font-medium text-black py-2'>Notes</h2>

      <SearchBar
        value={searchQuery}
        onChange={e =>
          setSearchQuery(e.target.value)
        }
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}
      />

      <ProfileInfo onLogout={handleLogout} userInfo={userInfo} />
    </div>
  )
}

export default Navbar
