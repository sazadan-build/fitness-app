import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { getExerciseHistory } from '../data/store.js'

export default function ExerciseRow({ exercise, loggedSets, onLogSet, onRemoveSet, data }) {
  const [reps, setReps] = useState('')
  const [weight, setWeight] = useState('')
  const [showHistory, setShowHistory] = useState(false)

  const history = getExerciseHistory(data, exercise.name)

  function handleSubmit(e) {
    e.preventDefault()
    const repsNum = parseInt(reps, 10)
    const weightNum = parseFloat(weight) || 0
    if (!repsNum) return
    onLogSet({ exerciseName: exercise.name, reps: repsNum, weight: weightNum })
    setReps('')
    setWeight('')
  }

  return (
    <div className="py-3 border-b border-[#e5ddd0] last:border-b-0">
      <div className="flex items-baseline justify-between mb-1">
        <p className="text-sm font-medium text-[#4a423c]">{exercise.name}</p>
        <div className="flex items-center gap-3">
          <p className="text-xs text-[#8d8079]">
            Target: {exercise.targetSets} x {exercise.targetReps}
          </p>
          {history.length > 0 && (
            <button
              onClick={() => setShowHistory((v) => !v)}
              className="text-xs font-semibold text-[#8d8079] hover:text-[#4a423c]"
            >
              {showHistory ? '▲ Hide history' : '▼ History'}
            </button>
          )}
        </div>
      </div>
      {exercise.cue && exercise.cue !== '—' && (
        <p className="text-xs text-[#a39c8f] mb-2 italic">{exercise.cue}</p>
      )}

      {showHistory && (
        <div className="mt-2 bg-[#f2ede2] rounded-lg p-2" style={{ width: '100%', height: 140 }}>
          <ResponsiveContainer>
            <LineChart data={history}>
              <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(d) => d.slice(5)} />
              <YAxis tick={{ fontSize: 10 }} domain={['auto', 'auto']} />
              <Tooltip formatter={(value, name) => [value, name === 'weight' ? 'Weight (lb)' : name]} />
              <Line type="monotone" dataKey="weight" stroke="#8d8079" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {loggedSets.length > 0 && (
        <ul className="mt-2 flex flex-col gap-1">
          {loggedSets.map((set, i) => (
            <li key={set.id} className="flex items-center justify-between text-xs text-[#8d8079]">
              <span>
                Set {i + 1}: {set.reps} reps{set.weight ? ` @ ${set.weight} lb` : ''}
              </span>
              <button onClick={() => onRemoveSet(set.id)} className="text-[#cfc7ba] hover:text-red-500 px-2">
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit} className="mt-2 flex items-center gap-2">
        <input
          type="number"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          placeholder="Reps"
          className="w-20 border border-[#ddd3c2] rounded-lg px-2 py-1 text-sm"
        />
        <input
          type="number"
          step="0.5"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Weight (lb)"
          className="w-28 border border-[#ddd3c2] rounded-lg px-2 py-1 text-sm"
        />
        <button
          type="submit"
          className="px-3 py-1 rounded-lg bg-[#8d8079] text-white text-xs font-medium hover:bg-[#756a63]"
        >
          Log set
        </button>
      </form>
    </div>
  )
}
