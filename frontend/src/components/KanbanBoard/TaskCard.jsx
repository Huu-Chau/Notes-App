import { useState } from "react";
import DeleteIcon from "../icons/DeleteIcon"
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

export default function TaskCard({ task, deleteTask, updateTask }) {
    const [mouseIsOver, setMouseIsOver] = useState(false);

    const [editMode, setEditMode] = useState(false)

    const toggleEditMode = () => {
        setEditMode((prev) => !prev)
        setMouseIsOver(false)
    }

    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: task.id,
        data: {
            type: 'Task',
            task,
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

    if (editMode) {
        return (
            <div
                className="task-container task"
                ref={setNodeRef}
                {...listeners}
                {...attributes}
                style={style}
            >
                <textarea
                    className="h-[90%] w-full resize-none border-none rounded-lg bg-blue-600 text-white focus:outline-none"
                    value={task.content}
                    autoFocus
                    placeholder="Task content here"
                    onBlur={toggleEditMode}
                    onKeyDown={e => {
                        if (e.key === 'Enter' && e.shiftKey) {
                            e.preventDefault();
                            toggleEditMode();
                        }
                    }}
                    onChange={e => updateTask(task.id, e.target.value)}
                />
            </div>
        )
    }

    return (
        <div
            className="task-container task"
            onMouseEnter={() => { setMouseIsOver(true) }}
            onMouseLeave={() => { setMouseIsOver(false) }}
            onClick={toggleEditMode}
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            style={style}
        >
            <p className="my-auto h-[90%] w-full overflow-y-auto overflow-x-auto whitespace-pre">
                {task.content}
            </p>
            {mouseIsOver &&
                <button
                    className="stroke-white absolute right-4 top-1/2 -translate-y-1/2 bg-stone-800 p-2 rounded opacity-60 hover:opacity-100"
                    onClick={() => { deleteTask(task.id) }}
                >
                    <DeleteIcon />
                </button>
            }
        </div>
    )
}
