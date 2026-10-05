import { useState } from 'react'
import { getDay, todayKey } from '../data/store.js'

export default function WorkoutNotes({ data, onUpdateNotes }) {
  const today = getDay(data, todayKey())
  const [notes, setNotes] = useState(today.workoutNotes || '')
  const [showEdit, setShowEdit] = useState(false)

  function handleSave() {
    onUpdateNotes(notes)
    setShowEdit(false)
  }

  return (
    <div className="bg-white/90 rounded-3xl shadow-sm ring-1 ring-[#e5ddd0] p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-heading text-lg font-semibold text-[#5c5147]">Workout Notes</h2>
        {!showEdit && (
          <button
            onClick={() => setShowEdit(true)}
            className="text-sm font-semibold text-[#8d8079] hover:text-[#4a423c]"
          >
            {notes ? 'Edit' : '+ Add notes'}
          </button>
        )}
      </div>

      {!showEdit && notes && <p className="text-sm text-[#6b6259] whitespace-pre-wrap">{notes}</p>}

      {!showEdit && !notes && <p className="text-sm text-[#aba295]">No notes yet. How are you feeling today?</p>}

      {showEdit && (
        <div className="flex flex-col gap-3">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="What felt good? What's tight? Any pain or discomfort? How's your energy?"
            className="w-full border border-[#ddd3c2] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#d0ba98] resize-none"
            rows="4"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-3 py-1.5 rounded-lg bg-[#8d8079] text-white text-sm font-medium hover:bg-[#756a63]"
            >
              Save notes
            </button>
            <button
              onClick={() => {
                setNotes(today.workoutNotes || '')
                setShowEdit(false)
              }}
              className="px-3 py-1.5 rounded-lg text-[#8d8079] text-sm font-medium hover:text-[#4a423c]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
