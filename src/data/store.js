// ---------------------------------------------------------------------------
// This file is the "filing cabinet" for the app's data.
//
// It knows how to:
//   1. Describe the shape of our data (see the comments below)
//   2. Load that data from the browser's storage (localStorage)
//   3. Save it back after changes
//   4. Do small calculations on it (like "did I hit my step goal today?")
//
// It does NOT know anything about React or what's on screen — it's just
// plain JavaScript functions. That separation makes it easier to reason
// about: "where does the data live?" vs "how is it drawn on screen?"
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'fitness-app-data'

// ----- What our data looks like ---------------------------------------------
//
// {
//   goals: {
//     calories: 2000, protein: 120, fat: 65, carbs: 225, fiber: 30,
//     steps: 10000, waterCups: 8
//   },
//
//   // One entry per day that has any activity, keyed by "YYYY-MM-DD"
//   days: {
//     "2026-09-05": {
//       meals: {
//         breakfast: [ { id, name, calories, protein, fat, carbs, fiber } ],
//         lunch: [ ... ],
//         dinner: [ ... ],
//       },
//       workouts: [ { id, exerciseName, reps, weight } ],
//       steps: 4200,
//       waterCups: 3,
//     },
//     ...
//   },
//
//   // Body measurements are logged occasionally, not every day, so they
//   // live in their own lists instead of inside "days".
//   weightLogs: [ { date: "2026-09-01", value: 168 }, ... ],
//   bodyFatLogs: [ { date: "2026-09-01", value: 22.5 }, ... ],
// }

export const DEFAULT_GOALS = {
  calories: 2000,
  protein: 120,
  fat: 65,
  carbs: 225,
  fiber: 30,
  steps: 10000,
  waterCups: 8,
}

function emptyDay() {
  return {
    meals: { breakfast: [], lunch: [], dinner: [] },
    workouts: [],
    steps: 0,
    waterCups: 0,
    workoutNotes: '',
  }
}

function emptyData() {
  return {
    goals: { ...DEFAULT_GOALS },
    days: {},
    weightLogs: [],
    bodyFatLogs: [],
  }
}

// ----- Date helpers ----------------------------------------------------------
// We store dates as plain "YYYY-MM-DD" strings (not JS Date objects) because
// they're easy to use as object keys and easy to compare/sort as text.

export function toDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function todayKey() {
  return toDateKey(new Date())
}

// Returns the 7 date keys (Sun -> Sat) for the week that contains `date`.
export function getWeekDates(date = new Date()) {
  const start = new Date(date)
  start.setHours(0, 0, 0, 0)
  start.setDate(start.getDate() - start.getDay()) // rewind to Sunday
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    return toDateKey(d)
  })
}

export const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// ----- Loading & saving -------------------------------------------------------

export function loadData() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    const seeded = seedDemoData()
    saveData(seeded)
    return seeded
  }
  try {
    const parsed = JSON.parse(raw)
    // Merge with defaults so older saved data doesn't crash on missing fields.
    return {
      ...emptyData(),
      ...parsed,
      goals: { ...DEFAULT_GOALS, ...parsed.goals },
    }
  } catch {
    return emptyData()
  }
}

export function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function resetData() {
  const seeded = seedDemoData()
  saveData(seeded)
  return seeded
}

// ----- Calculations on a single day ------------------------------------------

export function getDay(data, dateKey) {
  return data.days[dateKey] || emptyDay()
}

export function computeDayMacros(day) {
  const totals = { calories: 0, protein: 0, fat: 0, carbs: 0, fiber: 0 }
  for (const items of Object.values(day.meals)) {
    for (const item of items) {
      totals.calories += item.calories || 0
      totals.protein += item.protein || 0
      totals.fat += item.fat || 0
      totals.carbs += item.carbs || 0
      totals.fiber += item.fiber || 0
    }
  }
  return totals
}

export function dayHasWorkout(day) {
  return day.workouts.length > 0
}

export function dayHitStepGoal(day, goals) {
  return day.steps >= goals.steps
}

// For a given exercise, returns one point per day it was logged: the
// heaviest set from that day (so a chart can show your top weight over
// time, even if you did several lighter warm-up sets that session).
export function getExerciseHistory(data, exerciseName) {
  const points = []
  for (const [dateKey, day] of Object.entries(data.days)) {
    const sets = day.workouts.filter((w) => w.exerciseName === exerciseName)
    if (sets.length === 0) continue
    const heaviest = sets.reduce((best, s) => (s.weight > best.weight ? s : best), sets[0])
    points.push({ date: dateKey, weight: heaviest.weight, reps: heaviest.reps })
  }
  return points.sort((a, b) => a.date.localeCompare(b.date))
}

// ----- Demo/seed data ---------------------------------------------------------
// So the Today tab has something interesting to show before the Nutrition
// and Exercise tabs exist for real logging. This runs once, the first time
// the app is opened on a given browser.

function seedDemoData() {
  const data = emptyData()
  const today = new Date()

  // Fill in the last 7 days (today + 6 previous) with sample activity.
  for (let i = 0; i < 7; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const key = toDateKey(d)
    const day = emptyDay()

    // Alternate some sample steps/workouts so the weekly icons have variety.
    day.steps = [12500, 8000, 10200, 6400, 11000, 9500, 7200][i]
    day.waterCups = i === 0 ? 3 : Math.floor(Math.random() * 8)
    if (i % 2 === 0) {
      day.workouts.push({ id: `seed-w-${i}`, exerciseName: 'Push-ups', reps: 15, weight: 0 })
    }

    // Only give "today" some sample meals, so the macro bars show progress.
    if (i === 0) {
      day.meals.breakfast.push({
        id: 'seed-m-1', name: 'Oatmeal with berries',
        calories: 350, protein: 10, fat: 6, carbs: 60, fiber: 8,
      })
      day.meals.lunch.push({
        id: 'seed-m-2', name: 'Chicken salad',
        calories: 480, protein: 38, fat: 20, carbs: 30, fiber: 6,
      })
    }

    data.days[key] = day
  }

  // A few weeks of weight/body fat history for the trend charts.
  for (let i = 8; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i * 7)
    const key = toDateKey(d)
    data.weightLogs.push({ date: key, value: Math.round((172 - i * 0.4) * 10) / 10 })
    data.bodyFatLogs.push({ date: key, value: Math.round((24 - i * 0.15) * 10) / 10 })
  }

  return data
}
