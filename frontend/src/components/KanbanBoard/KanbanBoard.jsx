import { useEffect, useMemo, useState } from 'react'
import NoteCard from '../Cards/NoteCard';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { arrayMove, SortableContext } from "@dnd-kit/sortable"
import PlusIcon from '../icons/PlusIcon';
import ColumnState from './ColumnState';
import { generateId } from '../../utils/helper';
import { axiosInstance } from '../../utils/axiosInstance'
import { handleAxiosRequest } from '../../utils/handleAxiosRequest'

function KanbanBoard({ openNoteEdit, allNotes, getAllNotes, setAllNotes, onEdit, onDelete, onPinToggle }) {
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

    async function onDragStart(event) {
        if (event.active.data.current?.type === 'State') {
            setActiveState(event.active.data.current.column)
            return;
        }
        if (event.active.data.current?.type === 'Note') {
            setActiveTask(event.active.data.current.note)
            return;
        }
    }
    async function onDragEnd(event) {
        setActiveState(null)
        setActiveTask(null)

        const { active, over } = event
        if (!over) return;

        const activeStateId = active.id
        const overColumnId = over.id

        if (activeStateId === overColumnId) return;

        const isActiveTask = active.data.current?.type === 'Note';
        const isOverColumn = over.data.current?.type === 'State';

        // setAllStates(states => {
        //     const activeStateIndex = states.findIndex(state => state.order === activeStateId)
        //     const overColumnIndex = states.findIndex(state => state.order === overColumnId)

        //     return arrayMove(allStates, activeStateIndex, overColumnIndex)
        // })
        // If it's a note being dragged to a column (including an empty column)
        if (isActiveTask && isOverColumn) {
            // Move the note to the new column without affecting column positions
            setAllNotes(notes => {
                const activeIndex = notes.findIndex(note => note.columnId === activeStateId);

                if (activeIndex === -1) return notes;

                // Assign the note to the new column
                notes[activeIndex].columnId = overId;

                // Return the updated notes array without changing the column order
                return [...notes];
            });

            return; // No need to proceed further since we're only moving the note
        }

        // If the dragged item is a column, handle column reordering
        const isActiveState = active.data.current?.type === 'State';
        if (isActiveState) {
            setAllStates(states => {
                const activeStateIndex = states.findIndex(state => state.order === activeStateId);
                const overColumnIndex = states.findIndex(state => state.order === overColumnId);

                if (activeStateIndex === -1 || overColumnIndex === -1) return states;

                // Reorder the columns (states)
                return arrayMove(states, activeStateIndex, overColumnIndex);
            });
        }
    }
    async function onDragOver(event) {
        const { active, over } = event
        if (!over) return;
        const activeId = active.id
        const overId = over.id
        if (activeId === overId) return;

        const isActiveATask = active.data.current?.type === 'Note'
        const isOverATask = over.data.current?.type === 'Note'

        if (!isActiveATask) return;

        // I'm dropping a task over an another task

        if (isActiveATask && isOverATask) {
            setAllNotes(notes => {
                const activeIndex = notes.findIndex(note => note.order === activeId)
                const overIndex = notes.findIndex(note => note.order === overId)

                if (activeIndex === -1 || overIndex === -1) return notes;

                notes[activeIndex].columnId = notes[overIndex].columnId

                return arrayMove(notes, activeIndex, overIndex)
            })
        }

        // I'm dropping a task over a column

        const isOverColumn = over.data.current?.type === 'State'

        if (isActiveATask && isOverColumn) {
            console.log(event)
            setAllNotes(notes => {
                const activeIndex = notes.findIndex(note => note.columnId === activeId)
                const overIndex = notes.findIndex(note => note.columnId === overId)
                if (notes[activeIndex]?.columnId) {
                    notes[activeIndex].columnId = overId
                }
                return arrayMove(notes, activeIndex, overIndex)
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
                                const stateNotes = allNotes.filter(note => note.columnId === state.order.toString())
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
                        <div className="flex flex-col gap-4">
                            <NoteCard
                                note={activeTask}
                                tags={[activeTask.tags]}
                            />
                        </div>
                    }
                </DragOverlay>
            </DndContext>
        </div>
    )
}

export default KanbanBoard