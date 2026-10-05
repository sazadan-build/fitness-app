import { useState } from 'react'
import { getDay, todayKey } from '../data/store.js'
import { PROGRAM_DAYS } from '../data/program.js'
import ExerciseRow from './ExerciseRow.jsx'
import WorkoutNotes from './WorkoutNotes.jsx'

function formatDate(dateString) {
  const date = new Date(dateString + 'T00:00:00')
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function ExerciseTab({ data, addWorkoutSet, removeWorkoutSet, updateWorkoutNotes }) {
  const [selectedDayId, setSelectedDayId] = useState(PROGRAM_DAYS[0].id)
  const [customName, setCustomName] = useState('')
  const [customReps, setCustomReps] = useState('')
  const [customWeight, setCustomWeight] = useState('')
  const [viewingDate, setViewingDate] = useState(todayKey())

  const today = getDay(data, viewingDate)
  const selectedDay = PROGRAM_DAYS.find((d) => d.id === selectedDayId)
  const isToday = viewingDate === todayKey()

  function setsFor(exerciseName) {
    return today.workouts.filter((w) => w.exerciseName === exerciseName)
  }

  function handleCustomSubmit(e) {
    e.preventDefault()
    const repsNum = parseInt(customReps, 10)
    if (!customName.trim() || !repsNum) return
    addWorkoutSet({ exerciseName: customName.trim(), reps: repsNum, weight: parseFloat(customWeight) || 0 }, viewingDate)
    setCustomName('')
    setCustomReps('')
    setCustomWeight('')
  }

  function goToPreviousDay() {
    const date = new Date(viewingDate)
    date.setDate(date.getDate() - 1)
    const newDate = date.toISOString().split('T')[0]
    setViewingDate(newDate)
  }

  function goToNextDay() {
    const date = new Date(viewingDate)
    date.setDate(date.getDate() + 1)
    const newDate = date.toISOString().split('T')[0]
    if (newDate <= todayKey()) {
      setViewingDate(newDate)
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-white/90 rounded-3xl shadow-sm ring-1 ring-[#e5ddd0] p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-heading text-lg font-semibold text-[#5c5147]">{isToday ? "Today's Workout" : 'Workout History'}</h2>
        </div>

        <div className="flex items-center justify-between gap-2 mb-4 pb-4 border-b border-[#e5ddd0]">
          <button
            onClick={goToPreviousDay}
            className="text-sm font-medium text-[#8d8079] hover:text-[#4a423c] px-2 py-1"
          >
            ← Prev
          </button>
          <span className="text-sm text-[#6b6259]">{formatDate(viewingDate)}</span>
          <button
            onClick={goToNextDay}
            disabled={!isToday}
            className={`text-sm font-medium px-2 py-1 ${
              isToday ? 'text-[#cfc7ba] cursor-not-allowed' : 'text-[#8d8079] hover:text-[#4a423c]'
            }`}
          >
            Next →
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {PROGRAM_DAYS.map((day) => (
            <button
              key={day.id}
              onClick={() => setSelectedDayId(day.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                selectedDayId === day.id
                  ? 'bg-[#8d8079] text-white'
                  : 'bg-[#f2ede2] text-[#6b6259] hover:bg-[#e5ddd0]'
              }`}
            >
              {day.name}
            </button>
          ))}
        </div>
        <p className="text-xs text-[#8d8079] mb-2">{selectedDay.focus}</p>

        <div>
          {selectedDay.exercises.map((exercise) => (
            <ExerciseRow
              key={exercise.name}
              exercise={exercise}
              loggedSets={setsFor(exercise.name)}
              onLogSet={(set) => addWorkoutSet(set, viewingDate)}
              onRemoveSet={(setId) => removeWorkoutSet(setId, viewingDate)}
              data={data}
            />
          ))}
        </div>
      </div>

      {isToday && (
        <>
          <div className="bg-white/90 rounded-3xl shadow-sm ring-1 ring-[#e5ddd0] p-5">
            <h2 className="font-heading text-lg font-semibold text-[#5c5147] mb-3">Log a Different Exercise</h2>
            <form onSubmit={handleCustomSubmit} className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Exercise name"
                className="flex-1 min-w-[140px] border border-[#ddd3c2] rounded-lg px-3 py-1.5 text-sm"
              />
              <input
                type="number"
                value={customReps}
                onChange={(e) => setCustomReps(e.target.value)}
                placeholder="Reps"
                className="w-20 border border-[#ddd3c2] rounded-lg px-3 py-1.5 text-sm"
              />
              <input
                type="number"
                step="0.5"
                value={customWeight}
                onChange={(e) => setCustomWeight(e.target.value)}
                placeholder="Weight (lb)"
                className="w-28 border border-[#ddd3c2] rounded-lg px-3 py-1.5 text-sm"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-[#8d8079] text-white text-sm font-medium hover:bg-[#756a63]"
              >
                Log set
              </button>
            </form>
          </div>

          <WorkoutNotes data={data} onUpdateNotes={updateWorkoutNotes} />
        </>
      )}
    </div>
  )
}
