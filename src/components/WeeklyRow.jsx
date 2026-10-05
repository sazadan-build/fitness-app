import { WEEKDAY_LABELS, dayHasWorkout, dayHitStepGoal, getDay, getWeekDates, todayKey } from '../data/store.js'
import { DumbbellIcon, FootstepsIcon } from './icons.jsx'

export default function WeeklyRow({ data }) {
  const week = getWeekDates()
  const today = todayKey()

  return (
    <div className="bg-white/90 rounded-3xl shadow-sm ring-1 ring-[#e5ddd0] p-5">
      <h2 className="font-heading text-lg font-semibold text-[#5c5147] mb-4">This Week</h2>
      <div className="grid grid-cols-7 gap-2">
        {week.map((dateKey, i) => {
          const day = getDay(data, dateKey)
          const isToday = dateKey === today
          const isFuture = dateKey > today
          const earnedWorkout = dayHasWorkout(day)
          const earnedSteps = dayHitStepGoal(day, data.goals)

          return (
            <div
              key={dateKey}
              className={`flex flex-col items-center gap-2 py-3 rounded-xl ${
                isToday ? 'bg-[#f2ede2] ring-1 ring-[#d8caa9]' : ''
              }`}
            >
              <span className="text-xs font-semibold text-[#8d8079]">{WEEKDAY_LABELS[i]}</span>
              <div className="flex flex-col gap-1.5 h-10 items-center justify-center text-[#8d8079]">
                {isFuture ? (
                  <span className="text-[#c7c0b3] text-xs">—</span>
                ) : (
                  <>
                    <DumbbellIcon className={`w-4 h-4 ${earnedWorkout ? 'opacity-100' : 'opacity-20'}`} />
                    <FootstepsIcon className={`w-4 h-4 ${earnedSteps ? 'opacity-100' : 'opacity-20'}`} />
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
