import { SortableContext, useSortable } from "@dnd-kit/sortable";
import DeleteIcon from "../icons/DeleteIcon"
import { CSS } from "@dnd-kit/utilities";
import { useContext, useMemo, useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import NoteCard from "../Cards/NoteCard";
import Modal from 'react-modal'
import AddEditNotes from "../../pages/Home/AddEditNotes";
import { userInfoContext } from "../../pages/Home/Home";
import { axiosInstance } from "../../utils/axiosInstance";
import { generateId } from "../../utils/helper";

function ColumnState({
    column, deleteColumn, updateColumn,
    allNotes, onDelete, onPinToggle, getAllNotes,
}) {
    // Toast functions
    const handleShowToast = useContext(userInfoContext)


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
    // 
    const closeEditNotes = () => {
        setOpenAddEditModal(!openAddEditModal.isShown)
    }

    const addNewNote = async () => {
        console.log('here')
        try {
            const response = await axiosInstance.post('/api/note', {
                title: `Dummy Note ${allNotes.length + 1}`,
                content: 'This is a dummy note.',
                tags: [],
                columnId: column.order,
                order: generateId(),
            })

            if (response.data && response.data.note) {
                handleShowToast('Note Added Successfully', 'add')
                getAllNotes()
                onClose()
            }
        } catch (error) {
            console.error(error)
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message)
            }
        }
        console.log('there')

    }
    const [editMode, setEditMode] = useState(false)
    const taskIds = Array.isArray(allNotes) ? useMemo(() => allNotes.map((note) => note._id), [allNotes]) : [];

    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: column.order,
        data: {
            type: 'State',
            column,
        },
        disabled: editMode,
    })
    const style = {
        transition,
        transform: CSS.Transform.toString(transform)
    }

    if (isDragging) {
        return (<div className="column-container opacity-60 border-2 border-rose-500" ref={setNodeRef} style={style}></div>)
    }
    return (
        <div className="column-container" ref={setNodeRef} style={style}>
            <div className="title-container" {...attributes} {...listeners} onClick={() => { setEditMode(true) }}>
                <div className="flex gap-2">
                    {editMode ?
                        <input
                            value={column.title}
                            onChange={e => {
                                updateColumn(column._id, e.target.value)
                            }}
                            autoFocus
                            onBlur={() => { setEditMode(false) }}
                            onKeyDown={(e) => {
                                if (e.key !== 'Enter') return;
                                setEditMode(false)
                            }}
                            className="bg-black focus:border-rose-500 border-2 rounded-md outline-none px-2"
                        /> :
                        column.title
                    }
                </div>
                <button
                    className="opacity-60 hover:opacity-100"
                    onClick={() => { deleteColumn(column._id) }}
                >
                    <DeleteIcon />
                </button>
            </div>
            <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
                <SortableContext items={taskIds}>
                    {Array.isArray(allNotes) && allNotes.length > 0 && allNotes.map((note) => {
                        return (
                            <div className="flex flex-col gap-4" key={note._id}>
                                <NoteCard
                                    id={note._id}
                                    note={note}
                                    tags={[note.tags]}
                                    onEdit={() => { onEditNote(note) }}
                                    onDelete={() => { onDelete(note._id) }}
                                    onPinToggle={() => { onPinToggle(note) }}
                                />
                            </div>
                        )
                    })}
                </SortableContext>
            </div>
            <div className="flex bg-primary justify-between">
                <button
                    className="flex gap-2 w-[45%] items-center bg-primary rounded-b-sm p-4 hover:bg-primaryHover"
                    onClick={() => {
                        setOpenAddEditModal({
                            isShown: true,
                            type: 'add',
                            data: null
                        })
                    }}
                >
                    <PlusIcon />Add Task
                </button>
                <button
                    className="flex gap-2 items-center bg-primary rounded-b-sm p-4 hover:bg-primaryHover"
                    onClick={addNewNote}
                >
                    <PlusIcon />Add New Task
                </button>
            </div>

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
                    columnId={column.order}
                    onClose={() => {
                        setOpenAddEditModal({ isShown: false, type: 'add', data: null })
                    }}
                    noteData={openAddEditModal.data}
                    type={openAddEditModal.type}
                    getAllNotes={getAllNotes}
                    handleShowToast={handleShowToast}
                />
            </Modal>
        </div >
    )
}

export default ColumnState
