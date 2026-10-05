import { useCallback, useEffect, useState } from 'react'
import { getDay, loadData, saveData, todayKey } from './store.js'

// A "hook" is a function starting with "use" that plugs into React's state
// system. This one loads our saved data once when the app starts, keeps it
// in memory (via useState), and writes it back to localStorage any time it
// changes (via useEffect). Components call the action functions below
// instead of editing the data directly — that keeps all the "how do I
// change this data" logic in one place.
export function useFitnessData() {
  const [data, setData] = useState(() => loadData())

  useEffect(() => {
    saveData(data)
  }, [data])

  const updateDay = useCallback((dateKey, updater) => {
    setData((prev) => {
      const current = getDay(prev, dateKey)
      return {
        ...prev,
        days: { ...prev.days, [dateKey]: updater(current) },
      }
    })
  }, [])

  const adjustSteps = useCallback(
    (delta, dateKey = todayKey()) => {
      updateDay(dateKey, (day) => ({
        ...day,
        steps: Math.max(0, day.steps + delta),
      }))
    },
    [updateDay],
  )

  const adjustWater = useCallback(
    (delta, dateKey = todayKey()) => {
      updateDay(dateKey, (day) => ({
        ...day,
        waterCups: Math.max(0, day.waterCups + delta),
      }))
    },
    [updateDay],
  )

  const addWeightLog = useCallback((value, dateKey = todayKey()) => {
    setData((prev) => ({
      ...prev,
      weightLogs: [...prev.weightLogs.filter((l) => l.date !== dateKey), { date: dateKey, value }].sort((a, b) =>
        a.date.localeCompare(b.date),
      ),
    }))
  }, [])

  const addBodyFatLog = useCallback((value, dateKey = todayKey()) => {
    setData((prev) => ({
      ...prev,
      bodyFatLogs: [...prev.bodyFatLogs.filter((l) => l.date !== dateKey), { date: dateKey, value }].sort((a, b) =>
        a.date.localeCompare(b.date),
      ),
    }))
  }, [])

  const addMealItem = useCallback(
    (mealType, item, dateKey = todayKey()) => {
      updateDay(dateKey, (day) => ({
        ...day,
        meals: {
          ...day.meals,
          [mealType]: [...day.meals[mealType], { ...item, id: item.id || crypto.randomUUID() }],
        },
      }))
    },
    [updateDay],
  )

  const removeMealItem = useCallback(
    (mealType, itemId, dateKey = todayKey()) => {
      updateDay(dateKey, (day) => ({
        ...day,
        meals: {
          ...day.meals,
          [mealType]: day.meals[mealType].filter((item) => item.id !== itemId),
        },
      }))
    },
    [updateDay],
  )

  const addWorkoutSet = useCallback(
    (set, dateKey = todayKey()) => {
      updateDay(dateKey, (day) => ({
        ...day,
        workouts: [...day.workouts, { ...set, id: crypto.randomUUID() }],
      }))
    },
    [updateDay],
  )

  const removeWorkoutSet = useCallback(
    (setId, dateKey = todayKey()) => {
      updateDay(dateKey, (day) => ({
        ...day,
        workouts: day.workouts.filter((w) => w.id !== setId),
      }))
    },
    [updateDay],
  )

  const updateWorkoutNotes = useCallback(
    (notes, dateKey = todayKey()) => {
      updateDay(dateKey, (day) => ({
        ...day,
        workoutNotes: notes,
      }))
    },
    [updateDay],
  )

  return {
    data,
    adjustSteps,
    adjustWater,
    addWeightLog,
    addBodyFatLog,
    addMealItem,
    removeMealItem,
    addWorkoutSet,
    removeWorkoutSet,
    updateWorkoutNotes,
  }
}
