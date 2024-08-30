import { useEffect, useState } from 'react'
import NoteCard from '../Cards/NoteCard';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { arrayMove, SortableContext } from "@dnd-kit/sortable"
import PlusIcon from '../icons/PlusIcon';
import ColumnState from './ColumnState';
import TaskCard from './TaskCard';
import { generateId } from '../../utils/helper';
import { axiosInstance } from '../../utils/axiosInstance'
import { handleAxiosRequest } from '../../utils/handleAxiosRequest'

function KanbanBoard(
    // { allNotes, isSearch, onEdit, onDelete, onPinToggle }    
) {
    const [columns, setColumns] = useState([])
    const [activeColumn, setActiveColumn] = useState(null)
    const [tasks, setTasks] = useState([])
    const [activeTask, setActiveTask] = useState(null)

    const sensors = useSensors(useSensor(PointerSensor, {
        activationConstraint: {
            distance: 3, //300px
        }
    }))
    const [allStates, setAllStates] = useState([])

    // show state to display 
    const getAllStates = async () => {
        const response = await axiosInstance.get(`/api/state/`)

        handleAxiosRequest(response, (data) => {
            if (data.message) return setAllStates(data);
        }, (err) => {
            console.log(err.response.data.message)
        })
    }


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

    function onDragStart(event) {
        if (event.active.data.current?.type === 'Column') {
            setActiveColumn(event.active.data.current.column)
            return;
        }
        if (event.active.data.current?.type === 'Task') {
            setActiveTask(event.active.data.current.task)
            return;
        }
    }
    function onDragEnd(event) {
        setActiveColumn(null)
        setActiveTask(null)

        const { active, over } = event
        if (!over) return;

        const activeColumnId = active.id
        const overColumnId = over.id

        if (activeColumnId === overColumnId) return;

        setColumns(columns => {
            const activeColumnIndex = columns.findIndex(col => col.id === activeColumnId)
            const overColumnIndex = columns.findIndex(col => col.id === overColumnId)

            return arrayMove(columns, activeColumnIndex, overColumnIndex)
        })
    }
    function onDragOver(event) {
        const { active, over } = event
        if (!over) return;

        const activeId = active.id
        const overId = over.id

        if (activeId === overId) return;

        // I'm dropping a task over an another task
        const isActiveATask = active.data.current?.type === 'Task'
        const isOverATask = over.data.current?.type === 'Task'

        if (!isActiveATask) return;
        console.log(tasks)

        if (isActiveATask && isOverATask) {
            setTasks(tasks => {
                const activeIndex = tasks.findIndex(task => task.id === activeId)
                const overIndex = tasks.findIndex(task => task.id === overId)

                tasks[activeIndex].columnId = tasks[overIndex].columnId

                return arrayMove(tasks, activeIndex, overIndex)
            })
        }
        console.log(tasks)

        // I'm dropping a task over a column

        const isOverColumn = over.data.current?.type === 'Column'

        if (isActiveATask && isOverColumn) {
            setTasks(tasks => {
                const activeIndex = tasks.findIndex(task => task.id === activeId)
                const overIndex = tasks.findIndex(task => task.id === overId)

                tasks[activeIndex].columnId = overId

                return arrayMove(tasks, activeIndex, overIndex)
            })
        }
    }
    useEffect(() => {
        getAllStates()
    }, [])
    return (
        <div className='container min-h-screen w-full flex justify-start mt-10 px-10 overflow-x-auto overflow-y-hidden text-slate-50'>
            <button className="add-column-button border-2 border-sl" onClick={() => { createNewColumn() }}>
                <PlusIcon /> Add column
            </button>
            <DndContext
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onDragOver={onDragOver}
                sensors={sensors}
            >
                <div className="mx-auto flex gap-4">
                    <div className="flex gap-4">
                        <SortableContext items={columns.map((column) => column.id)}>
                            {columns.map(column => (
                                <ColumnState
                                    key={column.id}
                                    column={column}
                                    deleteColumn={deleteColumn}
                                    updateColumn={updateColumn}
                                    createTask={createTask}
                                    tasks={tasks.filter(task => task.columnId === column.id)}
                                    deleteTask={deleteTask}
                                    updateTask={updateTask}
                                />
                            ))}
                        </SortableContext>
                    </div>
                </div>
                <DragOverlay>
                    {activeColumn &&
                        <ColumnState
                            column={activeColumn}
                            tasks={tasks.filter(task => task.columnId === activeColumn.id)}
                        />
                    }
                    {/* need an overlay component cause we don't even need the function of it */}
                    {activeTask &&
                        <TaskCard
                            task={activeTask}
                        />
                    }
                </DragOverlay>
            </DndContext>
        </div>
    )
}

export default KanbanBoard

// {allNotes.length > 0 ?
//     <div className='grid grid-cols-3 m-8 gap-4'>
//         {allNotes.map((note) => {
//             const stateMessage = note.state ? note.state.message : '';
//             const stateColor = note.state ? note.state.color : '';
//             return (
//                 <div className="flex flex-col gap-4" key={note._id}>
//                     <NoteCard
//                         id={note._id}
//                         note={note}
//                         tags={[note.tags]}
//                         stateMessage={stateMessage}
//                         stateColor={stateColor}
//                         onEdit={() => { onEdit(note) }}
//                         onDelete={() => { onDelete(note._id) }}
//                         onPinToggle={() => { onPinToggle(note) }}
//                     />
//                 </div>
//             )
//         })}
//     </div> :
//     <EmptyCard
//         imgSrc={imgSrc}
//         message={isSearch
//             ? `Oops! No notes found matching your search`
//             : `Start creating your first note! Click the 'ADD' button to jot down your thoughts, ideas, and reminders. Let's get started!`
//         }
//     />
// }