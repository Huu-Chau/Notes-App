import Modal from 'react-modal'
import { MdAdd } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import React, { useEffect, useState, createContext } from 'react'
import AddEditNotes from './AddEditNotes'
import { axiosInstance } from '../../utils/axiosInstance'
import { handleAxiosRequest } from '../../utils/handleAxiosRequest'
import Navbar from '../../components/Navbar/Navbar'
import Toast from '../../components/ToastMessage/Toast'
import AddCustomState from './AddCustomState'
import KanbanBoard from '../../components/KanbanBoard/KanbanBoard'
import { generateId } from '../../utils/helper'
// Parent: App
export const userInfoContext = createContext()

function Home() {

  // Note edit value
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: 'add',
    data: null
  })
  // Note edit functions
  const onEdit = (noteDetails) => {
    setOpenAddEditModal({
      isShown: true,
      type: 'edit',
      data: noteDetails
    })
  }
  // 
  const closeEditNotes = () => {
    setOpenAddEditModal(!openAddEditModal.isShown)
  }

  //////////     Toast      ///////////////

  // Value
  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    type: 'add',
    message: ''
  })
  // Functions
  const handleShowToast = (message, type) => {
    setShowToastMsg({
      isShown: true,
      message,
      type
    })
  }
  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: ''
    })
  }


  // 
  const [userInfo, setUserInfo] = useState(null)
  const [isSearch, setIsSearch] = useState(false)

  const [allNotes, setAllNotes] = useState([])


  ////////////     Database      ////////////

  // get all notes from database
  const getAllNotes = async () => {
    const response = await axiosInstance.get('/api/note')
    handleAxiosRequest(
      response,
      (data) => {
        if (data.notes.length > 0) {
          return setAllNotes(data.notes)
        } else {
          setAllNotes([])
        }
      },
      () => {
        console.log('An unexpected error approaches')
      }
    )
  }

  // search notes in navbar and display to Home
  const onSearchNotes = async (query) => {
    const response = await axiosInstance.get(`/api/note/search`, {
      params: { query }
    })
    handleAxiosRequest(
      response,
      (data) => {
        if (data.matchingNotes) {
          setIsSearch(true);
          handleShowToast(`Found ${data.matchingNotes.length} notes that match your search`, 'search');
          setAllNotes(data.matchingNotes);
        }
      },
      () => {
        setIsSearch(false);
        console.log('An unexpected error approaches');
      }
    );
  }

  //////////     Navbar      //////////////

  // get user info in NavBar
  const getUserInfo = async () => {
    const response = await axiosInstance.get('/api/user')
    handleAxiosRequest(response,
      (data) => {
        if (data.user) {
          return setUserInfo(data.user)
        }
      },
      () => {
        console.log('Something wrong happened')
      }
    )
  }

  // handle clear search
  const handleClearSearch = () => {
    setIsSearch(true)
    getAllNotes()
  }

  /////////     NoteCard     /////////////

  // edit note in NoteCard


  // delete note in NoteCard
  const onDelete = async (id) => {
    const response = await axiosInstance.delete(`/api/note/${id}`)

    handleAxiosRequest(response, (data) => {
      handleShowToast(data.message, 'delete')
      console.log('here')
      getAllNotes()
    },
      (error) => {
        console.log(error.message)
      }
    )
  }

  // pin note in NoteCard
  const onPinToggle = async (data) => {
    const noteId = data._id

    const response = await axiosInstance.patch(`/api/note/${noteId}`, {
      isPinned: !data.isPinned,
    })

    handleAxiosRequest(response, (data) => {
      if (data.message) return getAllNotes()
    }, (err) => {
      console.log(err?.response?.data?.message || 'Something is wrong in the Pin toggle')
    })
  }

  // close edit note in NoteCard

  useEffect(() => {
    getAllNotes()
    getUserInfo()
    console.log(allNotes)
  }, [])
  return (
    <>
      <userInfoContext.Provider value={userInfo}>
        <Navbar onSearchNotes={onSearchNotes} handleClearSearch={handleClearSearch} />
      </userInfoContext.Provider>

      <userInfoContext.Provider value={handleShowToast}>
        <KanbanBoard
          allNotes={allNotes}
          getAllNotes={getAllNotes}
          onEdit={onEdit}
          onDelete={onDelete}
          onPinToggle={onPinToggle}
          handleShowToast={handleShowToast}
        />
      </userInfoContext.Provider>

      <Toast
        isShown={showToastMsg.isShown}
        type={showToastMsg.type}
        message={showToastMsg.message}
        onClose={handleCloseToast}
      />
    </>
  )
}

export default Home
