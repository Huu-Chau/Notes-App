import React from 'react'
import NoteCard from './NoteCard'

function NoteState({ id, note, tags, stateMessage, stateColor, onEdit, onDelete, onPinToggle }) {
    return (
        <div>
            <NoteCard
                id={id}
                note={note}
                tags={[tags]}
                stateMessage={stateMessage}
                stateColor={stateColor}
                onEdit={onEdit()}
                onDelete={onDelete()}
                onPinToggle={onPinToggle()}
            />
        </div>
    )
}

export default NoteState
