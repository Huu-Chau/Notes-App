import React from 'react'
import { MdClose } from 'react-icons/md'
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"


function StateCard({ title, onDelete, id }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: transition,
    }
    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            style={style}
            className='flex justify-between items-center border px-2 py-1'
        >
            <p>{title}</p>
            <MdClose className='cursor-pointer hover:text-red-500' onClick={onDelete} />
        </div>
    )
}

export default StateCard
