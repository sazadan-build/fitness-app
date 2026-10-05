import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function SummaryCard({ title, unit, logs, color, onAddEntry }) {
  const [expanded, setExpanded] = useState(false)
  const [newValue, setNewValue] = useState('')

  const latest = logs[logs.length - 1]

  function handleSubmit(e) {
    e.preventDefault()
    const num = parseFloat(newValue)
    if (!Number.isNaN(num)) {
      onAddEntry(num)
      setNewValue('')
    }
  }

  return (
    <div className="bg-white/90 rounded-3xl shadow-sm ring-1 ring-[#e5ddd0] p-5">
      <button className="w-full text-left" onClick={() => setExpanded((v) => !v)}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-medium text-[#8d8079]">{title}</h2>
            <p className="font-heading text-2xl font-semibold text-[#4a423c]">
              {latest ? latest.value : '—'} <span className="text-sm font-normal text-[#8d8079]">{unit}</span>
            </p>
          </div>
          <span className="text-[#aba295] text-sm">{expanded ? '▲ Hide' : '▼ Details'}</span>
        </div>
      </button>

      {expanded && (
        <div className="mt-4 flex flex-col gap-4">
          <div style={{ width: '100%', height: 160 }}>
            <ResponsiveContainer>
              <LineChart data={logs}>
                <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(d) => d.slice(5)} />
                <YAxis tick={{ fontSize: 10 }} domain={['auto', 'auto']} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              type="number"
              step="0.1"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder={`New ${title.toLowerCase()}`}
              className="flex-1 border border-[#ddd3c2] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#d0ba98]"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-[#8d8079] text-white text-sm font-medium hover:bg-[#756a63]"
            >
              Log entry
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
