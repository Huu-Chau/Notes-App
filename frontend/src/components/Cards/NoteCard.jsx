import React from 'react'
import { MdOutlinePushPin, MdCreate, MdDelete } from 'react-icons/md'
import moment from 'moment'
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
// parent: Home
const NoteCard = ({ id, note, tags, stateMessage, stateColor, onEdit, onDelete, onPinToggle }) => {
    const { title, date, content, isPinned } = note

    const colorNameToHex = (color) => {
        const ctx = document.createElement('canvas').getContext('2d');
        ctx.fillStyle = color;
        return ctx.fillStyle;
    }

    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: transition || 'transform 250ms ease',
    }

    return (
        <div
            // ref={setNodeRef}
            // {...attributes}
            // {...listeners}
            // style={style}
            className='border rounded p-4 pt-6 bg-white hover:shadow-xl transition-all ease-in-out relative'
        >
            <span className={`absolute w-22 top-2 right-3  text-slate-800 rounded-md text-xs px-2 bg-[${colorNameToHex(stateColor)}]`}>
                {stateMessage}
            </span>
            <div className="flex items-center justify-between">
                <div>
                    <h6 className="text-sm font-semibold">{title}</h6>
                    <span className="text-xs text-slate-500 font-medium">{moment(date).format('Do MMM YYYY')}</span>
                </div>
                <MdOutlinePushPin className={`icon-btn ${isPinned ? 'text-primary' : 'text-slate-300'}`} onClick={(e) => { onPinToggle }} />
            </div>
            <p className="text-xs text-slate-600 mt-2 font-semibold">{content?.slice(0, 60)}...</p>

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
