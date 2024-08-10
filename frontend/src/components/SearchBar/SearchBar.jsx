import React from 'react'
import { FaMagnifyingGlass } from 'react-icons/fa6'
import { IoMdClose } from 'react-icons/io'
// parent: Navbar
function SearchBar({ value, onChange, handleSearch, onClearSearch }) {
  const handleSearchKeyDown = (key) => {
    if (key.code === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className='w-80 flex items-center px-4 bg-slate-100 rounded-full'>
      <input
        type="text"
        placeholder='Search Notes'
        className='search-box'
        value={value}
        onChange={onChange}
        onKeyDown={handleSearchKeyDown}
      />
      {value && <IoMdClose
        className='search-icon text-xl mr-3'
        onClick={onClearSearch}
      />}
      <FaMagnifyingGlass
        className='search-icon'
        onClick={handleSearch}
      />
    </div>
  )
}

export default SearchBar
