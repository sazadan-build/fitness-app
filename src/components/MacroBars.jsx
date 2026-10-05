const MACROS = [
  { key: 'calories', label: 'Calories', unit: 'kcal', color: '#d0ba98' },
  { key: 'protein', label: 'Protein', unit: 'g', color: '#8d8079' },
  { key: 'fat', label: 'Fat', unit: 'g', color: '#aeb2a6' },
  { key: 'carbs', label: 'Carbs', unit: 'g', color: '#b8b6b0' },
  { key: 'fiber', label: 'Fiber', unit: 'g', color: '#d8caa9' },
]

export default function MacroBars({ totals, goals }) {
  return (
    <div className="bg-white/90 rounded-3xl shadow-sm ring-1 ring-[#e5ddd0] p-5 flex flex-col gap-4">
      <h2 className="font-heading text-lg font-semibold text-[#5c5147]">Today's Macros</h2>
      {MACROS.map(({ key, label, unit, color }) => {
        const value = totals[key] || 0
        const goal = goals[key] || 1
        const percent = Math.min((value / goal) * 100, 100)
        return (
          <div key={key}>
            <div className="flex justify-between text-sm text-[#6b6259] mb-1">
              <span>{label}</span>
              <span>
                {value} / {goal} {unit}
              </span>
            </div>
            <div className="h-3 rounded-full bg-[#f2ede2] overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${percent}%`, backgroundColor: color, transition: 'width 0.3s ease' }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
