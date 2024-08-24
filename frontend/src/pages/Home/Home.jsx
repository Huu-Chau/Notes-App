import Modal from 'react-modal'
import { MdAdd } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import React, { useEffect, useState, createContext } from 'react'
import AddEditNotes from './AddEditNotes'
import { axiosInstance } from '../../utils/axiosInstance'
import { handleAxiosRequest } from '../../utils/handleAxiosRequest'
import NoteCard from '../../components/Cards/NoteCard'
import Navbar from '../../components/Navbar/Navbar'
import Toast from '../../components/ToastMessage/Toast'
import EmptyCard from '../../components/EmptyCard/EmptyCard'
import imgSrc from '../../assets/images/empty-note.png'
import AddCustomState from './AddCustomState'
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, rectSortingStrategy, SortableContext } from '@dnd-kit/sortable'
// Parent: App
export const userInfoContext = createContext()

function Home() {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: 'add',
    data: null
  })

  const [openCustomModal, setOpenCustomModal] = useState({
    isShown: false,
    type: 'add',
    data: null,
  })

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    type: 'add',
    message: ''
  })

  const [userInfo, setUserInfo] = useState(null)
  const [isSearch, setIsSearch] = useState(false)

  const [allNotes, setAllNotes] = useState([])

  const [allStates, setAllStates] = useState([])


  const navigate = useNavigate()

  ////////////     Database      ////////////

  // get all notes from database
  const getAllNotes = async () => {
    const response = await axiosInstance.get('/api/note')
    handleAxiosRequest(
      response,
      (data) => {
        if (data.notes.length > 0) return setAllNotes(data.notes);
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
    const response = await axiosInstance.get('/api/account')
    handleAxiosRequest(
      response,
      (data) => {
        if (data.user) return setUserInfo(data.user);
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
  const onEdit = (noteDetails) => {
    setOpenAddEditModal({
      isShown: true,
      type: 'edit',
      data: noteDetails
    })
  }

  // delete note in NoteCard
  const onDelete = async (id) => {
    const response = await axiosInstance.delete(`/api/note/${id}`)

    handleAxiosRequest(response, (data) => {
      handleShowToast(data.message, 'delete')
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
  const closeEditNotes = () => {
    setOpenAddEditModal(!openAddEditModal.isShown)
  }

  // show state to display 
  const getAllStates = async () => {
    const response = await axiosInstance.get(`/api/state/`)

    handleAxiosRequest(response, (data) => {
      if (data.message) return setAllStates(data);
    }, (err) => {
      console.log(err.response.data.message)
    })
  }

  // close edit state
  const closeEditState = () => {
    setOpenCustomModal(!openCustomModal.isShown)
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

  ////////////////////  DND KIT ////////////////////////////

  // handle function to drag and drop
  // const handleDragEnd = (event) => {
  //   const { active, over } = event
  //   if (over && over.id !== active.id) {
  //     setAllNotes(items => {
  //       const oldIndex = items.findIndex(item => item._id === active.id)
  //       const newIndex = items.findIndex(item => item._id === over.id)
  //       return arrayMove(items, oldIndex, newIndex)
  //     })
  //   }
  // }

  // sensor on when to click and when to drag
  // const sensors = useSensors(
  //   useSensor(PointerSensor, {
  //     activationConstraint: {
  //       distance: 5, // Prevent dragging until moved by at least 5px
  //     },
  //     // Prevent dragging when clicking on buttons
  //     eventOptions: {
  //       preventDefault: true, // Optional: prevent default events for better control
  //     },
  //     // Custom function to filter drag triggers
  //     filterTaps: (event) => {
  //       const isButtonClick = event.target.closest('button');
  //       return !isButtonClick;
  //     },
  //   })
  // );

  useEffect(() => {
    getAllNotes()
    getUserInfo()
  }, [])

  useEffect(() => {
    getAllStates()
  }, [])
  return (
    <>
      <userInfoContext.Provider value={userInfo}>
        <Navbar onSearchNotes={onSearchNotes} handleClearSearch={handleClearSearch} />
      </userInfoContext.Provider>
      {/* <DndContext
        onDragEnd={handleDragEnd}
        collisionDetection={closestCenter}
      >
        <SortableContext items={allNotes.map(note => note._id)} sensors={sensors}> */}
      <div className='container mx-auto'>
        {allNotes.length > 0 ?
          <div className='grid grid-cols-3 gap-4 m-8'>
            {allNotes.map((note) => {
              const stateMessage = note.state ? note.state.message : '';
              const stateColor = note.state ? note.state.color : '';
              return (
                <NoteCard
                  key={note._id}
                  id={note._id}
                  note={note}
                  tags={[note.tags]}
                  stateMessage={stateMessage}
                  stateColor={stateColor}
                  onEdit={() => { onEdit(note) }}
                  onDelete={() => { onDelete(note._id) }}
                  onPinToggle={() => { onPinToggle(note) }}
                />
              )
            })}
          </div> :
          <EmptyCard
            imgSrc={imgSrc}
            message={isSearch
              ? `Oops! No notes found matching your search`
              : `Start creating your first note! Click the 'ADD' button to jot down your thoughts, ideas, and reminders. Let's get started!`
            }
          />
        }
        <div className="mt-24"></div>
      </div>
      {/* </SortableContext>
      </DndContext> */}


      {/* 1st */}
      <Modal
        isOpen={openCustomModal.isShown}
        onRequestClose={() => { closeEditState() }}
        style={{
          overlay: {
            backgroundColor: 'rgba(0,0,0,0.2)'
          }
        }}
        contentLabel=''
        className='w-[40%] max-h-[80%] bg-slate-50 rounded-md mx-auto mt-14 p-5 overflow-auto'
      >
        <AddCustomState
          onClose={() => {
            setOpenCustomModal({ isShown: false, data: null })
          }}
          stateData={allStates.states}
          getAllStates={getAllStates}
        />
      </Modal>

      <button className='w-42 h-8 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 fixed right-40 bottom-10 p-1'
        onClick={() => {
          setOpenCustomModal({
            isShown: true,
            data: null
          })
        }}
      >
        <h4 className='text-xs text-slate-50'>Add Custom State</h4>
      </button>

      {/* 2nd */}
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => { closeEditNotes() }}
        style={{
          overlay: {
            backgroundColor: 'rgba(0,0,0,0.2)'
          }
        }}
        contentLabel=''
        className='w-[40%] max-h-[80%] bg-slate-50 rounded-md mx-auto mt-14 p-5 overflow-auto'
      >
        <AddEditNotes
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: 'add', data: null })
          }}
          noteData={openAddEditModal.data}
          type={openAddEditModal.type}
          stateValue={allStates.states}
          getAllNotes={getAllNotes}
          handleShowToast={handleShowToast}
        />
      </Modal>

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
