import Modal from 'react-modal'
import { MdAdd } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import AddEditNotes from './AddEditNotes'
import { axiosInstance } from '../../utils/axiosInstance'
import NoteCard from '../../components/Cards/NoteCard'
import Navbar from '../../components/Navbar/Navbar'
import Toast from '../../components/ToastMessage/Toast'
import EmptyCard from '../../components/EmptyCard/EmptyCard'
import imgSrc from '../../assets/images/empty-note.png'
// Parent: App
function Home() {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: 'add',
    data: null
  })

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    type: 'add',
    message: ''
  })

  const [allNotes, setAllNotes] = useState([])
  const [userInfo, setUserInfo] = useState(null)

  const [isSearch, setIsSearch] = useState(false)

  const navigate = useNavigate()

  ////////////     Database      ////////////

  // get all notes from database
  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get('/api/note')

      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes)
      }
    } catch (error) {
      console.log('An unexpected error approaches')
    }
  }

  // search notes in navbar and display to Home
  const onSearchNotes = async (query) => {
    try {
      const response = await axiosInstance.get(`/api/note/search`, {
        params: { query }
      })

      if (response.data && response.data.matchingNotes) {
        setIsSearch(true)
        setAllNotes(response.data.matchingNotes)
      }
    } catch (error) {
      setIsSearch(false)
      console.log('An unexpected error approaches')
    }
  }

  //////////     Navbar      //////////////

  // get user info in NavBar
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get('/api/account')
      // check if there's data, and user element in data
      if (response.data && response.data.user) {
        setUserInfo(response.data.user)
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear()
        navigate('/login')
      }
    }
  }

  // handle clear search

  const handleClearSearch = () => {
    setIsSearch(true)
    getAllNotes()
  }

  /////////     NoteCard     /////////////

  // edit note in NoteCard
  const onEdit = (noteDetails) => {
    setOpenAddEditModal({
      isShown: true,
      type: 'edit',
      data: noteDetails
    })
  }

  // delete note in NoteCard
  const onDelete = async (id) => {
    try {
      const response = await axiosInstance.delete(`/api/note/${id}`)

      if (response.data && !response.data.error) {
        handleShowToast('Note deleted successfully', 'delete')
        getAllNotes()
      }
    }
    catch (error) {
      console.log(error.message)
    }

  }
  // pin note in NoteCard
  const onPinNote = async (data) => {
    const noteId = data._id
    try {
      const response = await axiosInstance.put(`/api/note/${noteId}/pin`, {
        "isPinned": !data.isPinned
      })

      if (response.data && response.data.message) {
        handleShowToast('Note update successfully!')
        getAllNotes()
        onClose()
      }
    } catch (error) {
      console.log(error.response.data.message)
    }
  }

  // close edit note in NoteCard
  const closeEditNotes = () => {
    setOpenAddEditModal(!openAddEditModal.isShown)
  }

  //////////     Toast      ///////////////

  // show toast message in Toast
  const handleShowToast = (message, type) => {
    setShowToastMsg({
      isShown: true,
      message,
      type
    })
  }

  // close toast message in Toast
  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: ''
    })
  }


  useEffect(() => {
    getAllNotes()
    getUserInfo()
    return () => { }
  }, [])

  return (
    <>
      <Navbar userInfo={userInfo} onSearchNotes={onSearchNotes} handleClearSearch={handleClearSearch} />
      <div className='container mx-auto'>
        {allNotes.length > 0 ?
          <div className='grid grid-cols-3 gap-4 mt-8'>
            {allNotes.map((note, index) => (
              <NoteCard
                key={index}
                title={note.title}
                date={note.createOn}
                content={note.content}
                tags={[note.tags]}
                isPinned={note.isPinned}
                onEdit={() => { onEdit(note) }}
                onDelete={() => { onDelete(note._id) }}
                onPinNote={() => { onPinNote(note) }}
              />
            ))}
          </div> :
          <EmptyCard
            imgSrc={imgSrc}
            message={isSearch
              ? `Oops! No notes found matching your search`
              : `Start creating your first note! Click the 'ADD' button to jot down your thoughts, ideas, and reminders. Let's get started!`
            }
          />
        }
      </div>

      <button className='w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 fixed right-10 bottom-10'
        onClick={() => {
          setOpenAddEditModal({
            isShown: true,
            type: 'add',
            data: null
          })
        }}

      >
        <MdAdd className='text-[32px] text-slate-50' />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => { closeEditNotes() }}
        style={{
          overlay: {
            backgroundColor: 'rgba(0,0,0,0.2)'
          }
        }}
        contentLabel=''
        className='w-[40%] max-h-[75%] bg-slate-50 rounded-md mx-auto mt-14 p-5'
      >
        <AddEditNotes
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: 'add', data: null })
          }}
          noteData={openAddEditModal.data}
          type={openAddEditModal.type}
          getAllNotes={getAllNotes}
          handleShowToast={handleShowToast}
        />
      </Modal>

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
