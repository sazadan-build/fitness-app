// A circular progress ring, drawn with SVG. SVG lets us draw shapes with
// code instead of images. The "trick" for a progress ring is: draw a full
// circle outline, then make part of it invisible by dashing the line and
// controlling how much of the dash is showing.
export default function RingProgress({ value, goal, label, unit, color, onIncrement, onDecrement, step = 1 }) {
  const size = 140
  const strokeWidth = 12
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const percent = goal > 0 ? Math.min(value / goal, 1) : 0
  const offset = circumference * (1 - percent)

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} stroke="#f2ede2" strokeWidth={strokeWidth} fill="none" />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.3s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-heading text-xl font-semibold text-[#4a423c]">{value}</span>
          <span className="text-xs text-[#8d8079]">of {goal} {unit}</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onDecrement(step)}
          className="w-8 h-8 rounded-full bg-[#f2ede2] text-[#6b6259] font-bold hover:bg-[#e5ddd0]"
          aria-label={`Decrease ${label}`}
        >
          −
        </button>
        <span className="text-sm font-semibold text-[#5c5147]">{label}</span>
        <button
          onClick={() => onIncrement(step)}
          className="w-8 h-8 rounded-full bg-[#f2ede2] text-[#6b6259] font-bold hover:bg-[#e5ddd0]"
          aria-label={`Increase ${label}`}
        >
          +
        </button>
      </div>
    </div>
  )
}
