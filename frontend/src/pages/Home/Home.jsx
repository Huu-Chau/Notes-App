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
  const onEditNote = (noteDetails) => {
    setOpenAddEditModal({
      isShown: true,
      type: 'edit',
      data: noteDetails
    })
  }
  const closeEditNotes = () => {
    setOpenAddEditModal(!openAddEditModal.isShown)
  }

  // State edit value
  const [openCustomModal, setOpenCustomModal] = useState({
    isShown: false,
    type: 'add',
    data: null,
  })
  // State edit functions
  const onEditState = () => {
    setOpenCustomModal({
      isShown: true,
      data: null
    })
  }
  const closeEditState = () => {
    setOpenCustomModal(!openCustomModal.isShown)
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

  //////////      Kanban board       ///////////

  // Value
  const [columns, setColumns] = useState([])
  const [activeColumn, setActiveColumn] = useState(null)
  const [tasks, setTasks] = useState([])
  const [activeTask, setActiveTask] = useState(null)

  // Functions
  function createNewColumn() {
    const columnToAdd = {
      id: generateId(),
      title: `Column ${columns.length + 1}`
    }
    setColumns([...columns, columnToAdd])
  }

  function deleteColumn(id) {
    const filteredColumns = columns.filter(column => column.id !== id)
    setColumns(filteredColumns)

    const filteredTasks = tasks.filter(task => task.columnId !== id)
    setTasks(filteredTasks)
  }
  function updateColumn(id, title) {
    const newColumns = columns.map(column => {
      if (column.id !== id) return column;
      return { ...column, title }
    })
    setColumns(newColumns)
  }

  function createTask(columnId) {
    const newTask = {
      id: generateId(),
      columnId,
      content: `Task ${tasks.length + 1}`,
    }

    setTasks([...tasks, newTask])
  }
  function deleteTask(taskId) {
    const newTask = tasks.filter(task => task.id !== taskId)

    setTasks(newTask)
  }
  function updateTask(taskId, content) {
    const newTasks = tasks.map(task => {
      if (task.id !== taskId) return task;
      return { ...task, content }
    })
    setTasks(newTasks)
  }
  // 
  const [userInfo, setUserInfo] = useState(null)
  const [isSearch, setIsSearch] = useState(false)

  const [allNotes, setAllNotes] = useState([])

  const [allStates, setAllStates] = useState([])

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


  // show state to display 
  const getAllStates = async () => {
    const response = await axiosInstance.get(`/api/state/`)

    handleAxiosRequest(response, (data) => {
      if (data.message) return setAllStates(data);
    }, (err) => {
      console.log(err.response.data.message)
    })
  }

  useEffect(() => {
    getAllNotes()
    getAllStates()
    getUserInfo()
  }, [])

  return (
    <>
      <userInfoContext.Provider value={userInfo}>
        <Navbar onSearchNotes={onSearchNotes} handleClearSearch={handleClearSearch} />
      </userInfoContext.Provider>

      <KanbanBoard
        allNotes={allNotes}
        isSearch={isSearch}
        onEdit={onEditNote}
        onDelete={onDelete}
        onPinToggle={onPinToggle}
      />

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
