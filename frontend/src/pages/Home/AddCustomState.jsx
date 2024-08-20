import React, { useEffect, useState } from 'react'
import { DndContext } from "@dnd-kit/core"
import { arrayMove, SortableContext } from "@dnd-kit/sortable"
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { MdClose } from 'react-icons/md';

import { axiosInstance } from '../../utils/axiosInstance';
import StateCard from '../../components/Cards/StateCard';
// parent: Home
const AddCustomState = ({ onClose, stateData, getAllStates }) => {
    const [error, setError] = useState(null)
    const [allState, setAllState] = useState([])
    const [stateValue, setStateValue] = useState('')

    // handle note create
    const handleAddState = () => {
        if (!stateValue) {
            setError('Please enter the state name before adding it')
            return
        }
        setError('')
        addNewState()
    }

    // add new State
    const addNewState = async () => {
        try {
            const response = await axiosInstance.post('/api/state', {
                state: stateValue,
            })

            if (response.data && response.data.result) {
                setStateValue('')
                getAllStates()
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message)
            }
        }
    }

    // delete state
    async function handleDeleteState(data) {
        console.log('yes')
        const stateId = data._id
        try {
            const response = await axiosInstance.delete(`/api/state/${stateId}`)
            if (response.data && response.data.stateMatch) {
                getAllStates()
            }
        }
        catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message)
            }
        }
    }

    // handle function to drag and drop
    const handleDragEnd = (event) => {
        const { active, over } = event
        if (over && over.id !== active.id) {
            setAllState(items => {
                const oldIndex = items.findIndex(item => item._id === active.id)
                const newIndex = items.findIndex(item => item._id === over.id)
                return arrayMove(items, oldIndex, newIndex)
            })
        }
    }

    useEffect(() => {
        setAllState(stateData)
    }, [stateData])

    return (
        <div className='relative'>
            <button className='w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-100'>
                <MdClose className='text-xl text-slate-400' onClick={onClose} />
            </button>

            <div className="add-container">
                <label className="input-label">STATE LIST</label>
                <div className="flex items-center">
                    <input
                        type="text"
                        className='border rounded p-2 mr-auto'
                        value={stateValue}
                        placeholder='Enter state'
                        onChange={(e) => setStateValue(e.target.value)}
                    />
                    <button className='btn-primary font-medium text-sm' onClick={() => { handleAddState() }}>
                        Add
                    </button>
                </div>
                <DndContext
                    onDragEnd={handleDragEnd}
                    modifiers={[restrictToVerticalAxis]}
                >
                    <div className='flex flex-col gap-3'>
                        <SortableContext items={allState.map(state => state._id)}>
                            {allState.map((state) => (
                                <StateCard
                                    key={state._id}
                                    id={state._id}
                                    title={state.message}
                                    onDelete={() => { handleDeleteState(state) }}
                                />
                            ))}
                        </SortableContext>
                    </div>
                </DndContext>
            </div>
            {error && <p className='text-red-600 mt-2'>{error}</p>}
        </div >
    )
}

export default AddCustomState