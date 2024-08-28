import { SortableContext, useSortable } from "@dnd-kit/sortable";
import DeleteIcon from "../icons/DeleteIcon"
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import TaskCard from "./TaskCard";

function ColumnState({ column, deleteColumn, updateColumn, tasks, createTask, deleteTask, updateTask }) {

    const [editMode, setEditMode] = useState(false)

    const taskIds = useMemo(() => (
        tasks.map((task) => task.id)
    ), [tasks])

    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: column.id,
        data: {
            type: 'Column',
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
                                updateColumn(column.id, e.target.value)
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
                    onClick={() => { deleteColumn(column.id) }}
                >
                    <DeleteIcon />
                </button>
            </div>
            <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
                <SortableContext items={taskIds}>
                    {tasks.map(task => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            deleteTask={deleteTask}
                            updateTask={updateTask}
                        />
                    ))}
                </SortableContext>
            </div>
            <button
                className="flex gap-2 items-center bg-primary rounded-b-sm p-4 hover:bg-blue-600"
                onClick={() => { createTask(column.id) }}
            >
                <PlusIcon />Add Task
            </button>
        </div>
    )
}

export default ColumnState
