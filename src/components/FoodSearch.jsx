import { useState } from 'react'
import { searchFoods } from '../data/foodSearch.js'

const GRAMS_PER_OUNCE = 28.3495

// USDA reports nutrients per 100g for most foods, so we let the user enter
// how much they actually ate (in grams or ounces) and scale from there.
export default function FoodSearch({ onAdd, onCancel }) {
  const [mode, setMode] = useState('search') // search | manual
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [status, setStatus] = useState('idle') // idle | loading | error
  const [selected, setSelected] = useState(null)
  const [amount, setAmount] = useState(100)
  const [unit, setUnit] = useState('g')

  // Manual entry fields
  const [manualName, setManualName] = useState('')
  const [manualCalories, setManualCalories] = useState('')
  const [manualProtein, setManualProtein] = useState('')
  const [manualFat, setManualFat] = useState('')
  const [manualCarbs, setManualCarbs] = useState('')
  const [manualFiber, setManualFiber] = useState('')

  async function handleSearch(e) {
    e.preventDefault()
    if (!query.trim()) return
    setStatus('loading')
    setSelected(null)
    try {
      const foods = await searchFoods(query)
      setResults(foods)
      setStatus('idle')
    } catch {
      setStatus('error')
    }
  }

  function handleAdd() {
    const grams = unit === 'oz' ? (parseFloat(amount) || 0) * GRAMS_PER_OUNCE : parseFloat(amount) || 0
    const factor = grams / 100
    onAdd({
      name: selected.name,
      calories: Math.round(selected.calories * factor),
      protein: Math.round(selected.protein * factor),
      fat: Math.round(selected.fat * factor),
      carbs: Math.round(selected.carbs * factor),
      fiber: Math.round(selected.fiber * factor),
    })
  }

  function handleManualAdd() {
    if (!manualName.trim()) return
    onAdd({
      name: manualName.trim(),
      calories: parseInt(manualCalories) || 0,
      protein: parseInt(manualProtein) || 0,
      fat: parseInt(manualFat) || 0,
      carbs: parseInt(manualCarbs) || 0,
      fiber: parseInt(manualFiber) || 0,
    })
  }

  return (
    <div className="mt-3 p-3 rounded-xl bg-[#f2ede2] flex flex-col gap-3">
      <div className="flex gap-2 mb-2">
        <button
          onClick={() => {
            setMode('search')
            setSelected(null)
            setResults([])
          }}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
            mode === 'search'
              ? 'bg-[#8d8079] text-white'
              : 'bg-white text-[#8d8079] hover:bg-[#f0ebe1]'
          }`}
        >
          Search
        </button>
        <button
          onClick={() => {
            setMode('manual')
            setSelected(null)
            setResults([])
          }}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
            mode === 'manual'
              ? 'bg-[#8d8079] text-white'
              : 'bg-white text-[#8d8079] hover:bg-[#f0ebe1]'
          }`}
        >
          Manual entry
        </button>
      </div>

      {mode === 'search' && (
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a food, e.g. banana"
            className="flex-1 border border-[#ddd3c2] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#d0ba98]"
          />
          <button
            type="submit"
            className="px-3 py-1.5 rounded-lg bg-[#8d8079] text-white text-sm font-medium hover:bg-[#756a63]"
          >
            Search
          </button>
          <button type="button" onClick={onCancel} className="px-3 py-1.5 text-sm text-[#8d8079] hover:text-[#4a423c]">
            Cancel
          </button>
        </form>
      )}

      {mode === 'search' && status === 'loading' && <p className="text-sm text-[#8d8079]">Searching…</p>}
      {mode === 'search' && status === 'error' && (
        <p className="text-sm text-red-500">Couldn't reach USDA's food database. Check your connection and try again.</p>
      )}

      {mode === 'search' && status === 'idle' && results.length > 0 && !selected && (
        <ul className="flex flex-col divide-y divide-[#e5ddd0] max-h-48 overflow-y-auto">
          {results.map((food) => (
            <li key={food.id}>
              <button
                onClick={() => setSelected(food)}
                className="w-full text-left py-2 px-1 hover:bg-white rounded-lg text-sm"
              >
                <span className="text-[#4a423c]">{food.name}</span>
                <span className="text-[#8d8079]"> — {food.calories} kcal / 100g</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {mode === 'search' && selected && (
        <div className="flex flex-col gap-2 bg-white rounded-lg p-3">
          <p className="text-sm font-medium text-[#4a423c]">{selected.name}</p>
          <p className="text-xs text-[#8d8079]">
            Per 100g: {selected.calories} kcal · {selected.protein}g protein · {selected.fat}g fat · {selected.carbs}g
            carbs · {selected.fiber}g fiber
          </p>
          <div className="flex items-center gap-2">
            <label className="text-sm text-[#6b6259]">Amount eaten:</label>
            <input
              type="number"
              step="1"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-20 border border-[#ddd3c2] rounded-lg px-2 py-1 text-sm"
            />
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="border border-[#ddd3c2] rounded-lg px-2 py-1 text-sm"
            >
              <option value="g">grams</option>
              <option value="oz">ounces</option>
            </select>
          </div>
          <button
            onClick={handleAdd}
            className="self-start px-3 py-1.5 rounded-lg bg-[#8d8079] text-white text-sm font-medium hover:bg-[#756a63]"
          >
            Add to meal
          </button>
        </div>
      )}

      {mode === 'manual' && (
        <div className="flex flex-col gap-2">
          <div>
            <label className="text-sm text-[#6b6259] block mb-1">Food name</label>
            <input
              autoFocus
              type="text"
              value={manualName}
              onChange={(e) => setManualName(e.target.value)}
              placeholder="e.g., Turkey sandwich"
              className="w-full border border-[#ddd3c2] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#d0ba98]"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs text-[#6b6259] block mb-1">Calories</label>
              <input
                type="number"
                value={manualCalories}
                onChange={(e) => setManualCalories(e.target.value)}
                placeholder="0"
                className="w-full border border-[#ddd3c2] rounded-lg px-2 py-1 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-[#6b6259] block mb-1">Protein (g)</label>
              <input
                type="number"
                value={manualProtein}
                onChange={(e) => setManualProtein(e.target.value)}
                placeholder="0"
                className="w-full border border-[#ddd3c2] rounded-lg px-2 py-1 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-[#6b6259] block mb-1">Fat (g)</label>
              <input
                type="number"
                value={manualFat}
                onChange={(e) => setManualFat(e.target.value)}
                placeholder="0"
                className="w-full border border-[#ddd3c2] rounded-lg px-2 py-1 text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-[#6b6259] block mb-1">Carbs (g)</label>
              <input
                type="number"
                value={manualCarbs}
                onChange={(e) => setManualCarbs(e.target.value)}
                placeholder="0"
                className="w-full border border-[#ddd3c2] rounded-lg px-2 py-1 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-[#6b6259] block mb-1">Fiber (g)</label>
              <input
                type="number"
                value={manualFiber}
                onChange={(e) => setManualFiber(e.target.value)}
                placeholder="0"
                className="w-full border border-[#ddd3c2] rounded-lg px-2 py-1 text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleManualAdd}
              className="px-3 py-1.5 rounded-lg bg-[#8d8079] text-white text-sm font-medium hover:bg-[#756a63]"
            >
              Add to meal
            </button>
            <button
              onClick={onCancel}
              className="px-3 py-1.5 text-sm text-[#8d8079] hover:text-[#4a423c]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
