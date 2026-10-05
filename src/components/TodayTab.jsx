import { computeDayMacros, getDay, todayKey } from '../data/store.js'
import MacroBars from './MacroBars.jsx'
import WeeklyRow from './WeeklyRow.jsx'
import RingProgress from './RingProgress.jsx'
import SummaryCard from './SummaryCard.jsx'

export default function TodayTab({ data, adjustSteps, adjustWater, addWeightLog, addBodyFatLog }) {
  const today = getDay(data, todayKey())
  const totals = computeDayMacros(today)

  return (
    <div className="flex flex-col gap-5">
      <MacroBars totals={totals} goals={data.goals} />
      <WeeklyRow data={data} />

      <div className="bg-white/90 rounded-3xl shadow-sm ring-1 ring-[#e5ddd0] p-5">
        <h2 className="font-heading text-lg font-semibold text-[#5c5147] mb-4">Activity</h2>
        <div className="flex justify-around flex-wrap gap-6">
          <RingProgress
            value={today.steps}
            goal={data.goals.steps}
            label="Steps"
            unit="steps"
            color="#d0ba98"
            step={250}
            onIncrement={(step) => adjustSteps(step)}
            onDecrement={(step) => adjustSteps(-step)}
          />
          <RingProgress
            value={today.waterCups}
            goal={data.goals.waterCups}
            label="Water"
            unit="cups"
            color="#aeb2a6"
            step={1}
            onIncrement={(step) => adjustWater(step)}
            onDecrement={(step) => adjustWater(-step)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <SummaryCard
          title="Current Weight"
          unit="lb"
          logs={data.weightLogs}
          color="#8d8079"
          onAddEntry={addWeightLog}
        />
        <SummaryCard
          title="Current Body Fat %"
          unit="%"
          logs={data.bodyFatLogs}
          color="#aeb2a6"
          onAddEntry={addBodyFatLog}
        />
      </div>
    </div>
  )
}
