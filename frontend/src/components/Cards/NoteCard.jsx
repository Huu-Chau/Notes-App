import React, { useState } from 'react'
import { MdOutlinePushPin, MdCreate, MdDelete } from 'react-icons/md'
import moment from 'moment'
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
// parent: Home
const NoteCard = ({ id, note, tags, onEdit, onDelete, onPinToggle }) => {
    const { title, date, content, isPinned } = note
    const [editMode, setEditMode] = useState(false)

    const toggleEditMode = () => {
        setEditMode((prev) => !prev)
        setMouseIsOver(false)
    }

    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: note._id,
        data: {
            type: 'Task',
            note,
        },
        disabled: editMode,
    })
    const style = {
        transition,
        transform: CSS.Transform.toString(transform)
    }


    if (isDragging) {
        return (<div className="task-container opacity-80 border-2 cursor-grab relative" ref={setNodeRef} style={style} />)
    }
    return (
        <div
            className='border-2 rounded p-4 pt-6 bg-white hover:shadow-xl transition-all ease-in-out relative'
            // className="task-container task" 
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            style={style}
        >
            <div className="flex items-center justify-between">
                <div>
                    <h6 className="text-sm font-semibold overflow-ellipsis overflow-anywhere text-slate-800">{title}</h6>
                    <span className="text-xs text-slate-500 font-medium">{moment(date).format('Do MMM YYYY')}</span>
                </div>
                <MdOutlinePushPin className={`icon-btn ${isPinned ? 'text-primary' : 'text-slate-300'}`} onClick={(e) => { onPinToggle() }} />
            </div>
            <p className="text-xs text-slate-600 mt-2 font-semibold overflow-ellipsis break-words">{content?.slice(0, 60)}...</p>

            <div className="flex items-center justify-between mt-2">
                <div className="text-xs text-slate-500 font-medium">
                    {tags[0].map((tag,) => (
                        `#${tag} `
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    <MdCreate
                        className='icon-btn hover:text-green-600'
                        onClick={onEdit}
                    />
                    <MdDelete
                        className='icon-btn hover:text-red-600'
                        onClick={onDelete}
                    />
                </div>
            </div>
        </div >
    )
}

export default NoteCard
