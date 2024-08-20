import React, { useState } from 'react'
import TagInput from '../../components/Input/TagInput';
import { MdClose } from 'react-icons/md';
import { axiosInstance } from '../../utils/axiosInstance';
// parent: Home
const AddEditNotes = ({ onClose, noteData, type, stateValue, getAllNotes, handleShowToast }) => {
    const [title, setTitle] = useState(noteData?.title ?? '')
    const [content, setContent] = useState(noteData?.content ?? '')
    const [tags, setTags] = useState(noteData?.tags ?? [])
    const [state, setstate] = useState(noteData?.state?.message ?? 'Will be done')
    const [error, setError] = useState(null)

    // handle note create
    const handleAddNote = () => {
        if (!title) {
            setError('Please enter the title')
            return
        }
        if (!content) {
            setError('Please enter the content')
            return
        }
        setError('')
        if (type === 'edit') {
            editNote()
        } else {
            addNewNote()
        }
    }

    // add new note
    const addNewNote = async () => {
        try {
            const response = await axiosInstance.post('/api/note', {
                title,
                content,
                tags,
                state,
            })

            if (response.data && response.data.note) {
                handleShowToast('Note Added Successfully', 'add')
                getAllNotes()
                onClose()
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message)
            }
        }
    }

    // edit current note
    const editNote = async () => {
        const noteId = noteData._id
        try {
            const response = await axiosInstance.patch(`/api/note/${noteId}`, {
                title,
                content,
                tags,
                state,
            })
            console.log(response.data)
            if (response.data && response.data.note) {
                handleShowToast('Note Updated Successfully!', 'add')
                getAllNotes()
                onClose()
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message)
            }
        }
    }

    console.log(type)
    return (
        <div className='relative'>
            <button className='w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-100'>
                <MdClose className='text-xl text-slate-400' onClick={onClose} />
            </button>

            <div className="add-container">
                <label className="input-label">TITLE</label>
                <input
                    type="text"
                    className='text-2xl text-slate-950 outline-none'
                    placeholder='Finish MERN project tomorrow'
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
            </div>
            <div className="add-container mt-3">
                <label className="input-label">Content</label>
                <textarea
                    type='text'
                    className="text-sm text-slate-950 outline-none bg-slate-50 rounded-md"
                    placeholder='Content'
                    rows={8}
                    value={content}
                    onChange={e => setContent(e.target.value)}
                />
            </div>
            <div className="mt-3 flex flex-col gap-2">
                <label className="input-label">state</label>
                <select onChange={e => { setstate(e.target.value) }}>
                    {stateValue.map((stateParams, index) => (
                        <option
                            key={index}
                            value={stateParams.message}>{stateParams.message == ' ' ? 'None' : stateParams.message}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mt-3">
                <label className="input-label">TAGS</label>
                <TagInput tags={tags} setTags={setTags} />
            </div>
            {error && <p className='text-red-500 text-xs pt-4'>{error}</p>}
            <button className='btn-primary font-medium mt-5 p-3' onClick={() => { handleAddNote() }}>
                {type === 'edit' ? 'UPDATE' : 'ADD'}
            </button>
        </div>
    )
}

export default AddEditNotes