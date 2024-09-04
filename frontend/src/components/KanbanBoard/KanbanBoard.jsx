import { useEffect, useMemo, useState } from 'react'
import NoteCard from '../Cards/NoteCard';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { arrayMove, SortableContext } from "@dnd-kit/sortable"
import PlusIcon from '../icons/PlusIcon';
import ColumnState from './ColumnState';
import TaskCard from './TaskCard';
import { generateId } from '../../utils/helper';
import { axiosInstance } from '../../utils/axiosInstance'
import { handleAxiosRequest } from '../../utils/handleAxiosRequest'

function KanbanBoard({ openNoteEdit, allNotes, getAllNotes, isSearch, onEdit, onDelete, onPinToggle }) {
    const [allStates, setAllStates] = useState([])
    const [activeState, setActiveState] = useState(null)
    const [tasks, setTasks] = useState([])
    const [activeTask, setActiveTask] = useState(null)

    const sensors = useSensors(useSensor(PointerSensor, {
        activationConstraint: {
            distance: 3, //3px
        }
    }))

    // show state to display 
    const getAllStates = async () => {
        const response = await axiosInstance.get(`/api/state/`)

        handleAxiosRequest(response, (data) => {
            if (data.message) return setAllStates(data.states);
        }, (err) => {
            console.log(err.response.data.message)
        })
    }
    const itemOrder = useMemo(() => allStates.map((state) => state.order), [allStates]);

    async function createNewColumn() {
        const response = await axiosInstance.post(`/api/state`, {
            order: generateId(),
            title: `Column ${allStates.length + 1}`
        })
        handleAxiosRequest(response, (data) => {
            if (data.message) return getAllStates();
        }, (err) => {
            console.log(err.response.data.message)
        })
    }
    async function deleteColumn(id) {
        const response = await axiosInstance.delete(`/api/state/${id}`)
        handleAxiosRequest(response, (data) => {
            if (data.message) return getAllStates();
        }, (err) => {
            console.log(err.response.data.message)
        })
        // const filteredTasks = tasks.filter(task => task.columnId !== id)
        // setTasks(filteredTasks)
    }
    async function updateColumn(id, title) {
        const response = await axiosInstance.put(`/api/state`, {
            id,
            title,
        })
        handleAxiosRequest(response, (data) => {
            if (data.message) return getAllStates();
        }, (err) => {
            console.log(err.response.data.message)
        })
    }

    async function createTask(columnId) {
        const newTask = {
            id: generateId(),
            columnId,
            content: `Task ${tasks.length + 1}`,
        }

        setTasks([...tasks, newTask])
    }
    async function deleteTask(taskId) {
        const newTask = tasks.filter(task => task.id !== taskId)

        setTasks(newTask)
    }
    async function updateTask(taskId, content) {
        const newTasks = tasks.map(task => {
            if (task.id !== taskId) return task;
            return { ...task, content }
        })
        setTasks(newTasks)
    }

    async function onDragStart(event) {
        if (event.active.data.current?.type === 'Column') {
            setActiveState(event.active.data.current.column)
            return;
        }
        // if (event.active.data.current?.type === 'Task') {
        //     setActiveTask(event.active.data.current.task)
        //     return;
        // }
    }
    async function onDragEnd(event) {
        setActiveState(null)
        setActiveTask(null)

        const { active, over } = event
        if (!over) return;
        console.log(event)

        const activeStateId = active.id
        const overColumnId = over.id

        if (activeStateId === overColumnId) return;

        setAllStates(states => {
            const activeStateIndex = states.findIndex(state => state.order === activeStateId)
            const overColumnIndex = states.findIndex(state => state.order === overColumnId)

            return arrayMove(allStates, activeStateIndex, overColumnIndex)
        })
    }
    async function onDragOver(event) {
        const { active, over } = event
        if (!over) return;
        console.log('over:\n', event)
        const activeId = active.id
        const overId = over.id

        if (activeId === overId) return;

        // I'm dropping a task over an another task
        const isActiveATask = active.data.current?.type === 'Task'
        const isOverATask = over.data.current?.type === 'Task'

        if (!isActiveATask) return;

        if (isActiveATask && isOverATask) {
            setTasks(tasks => {
                const activeIndex = tasks.findIndex(task => task.id === activeId)
                const overIndex = tasks.findIndex(task => task.id === overId)

                tasks[activeIndex].columnId = tasks[overIndex].columnId

                return arrayMove(tasks, activeIndex, overIndex)
            })
        }

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
                        <SortableContext items={itemOrder}>
                            {allStates.map(state => {
                                const stateNotes = allNotes.filter(note => note.columnId === state._id)
                                return (
                                    <ColumnState
                                        key={state.order}
                                        column={state}
                                        deleteColumn={deleteColumn}
                                        updateColumn={updateColumn}
                                        allNotes={stateNotes}
                                        getAllNotes={getAllNotes}
                                        onEdit={onEdit}
                                        onDelete={onDelete}
                                        onPinToggle={onPinToggle}

                                        openNoteEdit={openNoteEdit}
                                    />
                                )
                            })}
                        </SortableContext>
                    </div>
                </div>
                <DragOverlay>
                    {activeState &&
                        <ColumnState
                            column={activeState}
                            tasks={tasks.filter(task => task.columnId === activeState.id)}
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