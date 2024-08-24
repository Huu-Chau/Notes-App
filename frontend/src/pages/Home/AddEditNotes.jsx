import React, { useState } from 'react'
import TagInput from '../../components/Input/TagInput';
import { MdClose } from 'react-icons/md';
import { axiosInstance } from '../../utils/axiosInstance';
// parent: Home
const AddEditNotes = ({ onClose, noteData, type, stateValue, getAllNotes, handleShowToast }) => {
    const [error, setError] = useState(null)
    const previousDataInput = {
        title: noteData?.title ?? '',
        content: noteData?.content ?? '',
        tags: noteData?.tags ?? [],
        state: noteData?.state?.message ?? 'Will be done',
    }

    const [dataInput, setDataInput] = useState({
        title: noteData?.title ?? '',
        content: noteData?.content ?? '',
        tags: noteData?.tags ?? [],
        state: noteData?.state?.message ?? 'Will be done',
    })

    // handle note create
    const handleAddNote = () => {
        const { title, content } = dataInput
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
        const { title, content, tags, state, } = dataInput

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
        const noteId = noteData?._id
        if (!noteId) {
            return () => {
                console.log('No note found that matches you input')
            }
        }
        try {
            const payload = {
                title: dataInput.title && dataInput.title !== previousDataInput.title ? dataInput.title : undefined,
                content: dataInput.content && dataInput.content !== previousDataInput.content ? dataInput.content : undefined,
                tags: dataInput.tags && dataInput.tags !== previousDataInput.tags ? dataInput.tags : undefined,
                state: dataInput.state && dataInput.state !== previousDataInput.state ? dataInput.state : undefined,
            }
            const response = await axiosInstance.patch(`/api/note/${noteId}`, payload)

            if (response.data && (response.data.note || response.data.stateObject)) {
                handleShowToast('Note Updated Successfully!', 'add')
                getAllNotes()
                onClose()
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message)
            } else {
                console.log(error)
            }
        }
    }

    // Function to handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDataInput(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleTagsInputChange = (value) => {
        setDataInput(prevData => ({
            ...prevData,
            tags: value,
        }));
    };
    // 
    return (
        <div className='relative'>
            <button className='w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-100'>
                <MdClose className='text-xl text-slate-400' onClick={onClose} />
            </button>

            <div className="add-container">
                <label className="input-label">TITLE</label>
                <input
                    type="text"
                    name='title'
                    className='text-2xl text-slate-950 outline-none'
                    placeholder='Finish MERN project tomorrow'
                    value={dataInput.title}
                    onChange={e => { handleInputChange(e) }}
                />
            </div>
            <div className="add-container mt-3">
                <label className="input-label">Content</label>
                <textarea
                    type='text'
                    name='content'
                    className="text-sm text-slate-950 outline-none bg-slate-50 rounded-md"
                    placeholder='Content'
                    rows={8}
                    value={dataInput.content}
                    onChange={e => { handleInputChange(e) }}
                />
            </div>
            <div className="mt-3 flex flex-col gap-2">
                <label className="input-label">state</label>
                <select name='state' onChange={e => { handleInputChange(e) }}>
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
                <TagInput tags={dataInput.tags} setTags={handleTagsInputChange} />
            </div>
            {error && <p className='text-red-500 text-xs pt-4'>{error}</p>}
            <button className='btn-primary font-medium mt-5 p-3' onClick={() => { handleAddNote() }}>
                {type === 'edit' ? 'UPDATE' : 'ADD'}
            </button>
        </div>
    )
}

export default AddEditNotes