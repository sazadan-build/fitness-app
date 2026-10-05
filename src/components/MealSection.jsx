import { useState } from 'react'
import FoodSearch from './FoodSearch.jsx'

const MEAL_LABELS = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner' }

export default function MealSection({ mealType, items, onAdd, onRemove }) {
  const [searching, setSearching] = useState(false)

  function handleAdd(food) {
    onAdd(food)
    setSearching(false)
  }

  return (
    <div className="bg-white/90 rounded-3xl shadow-sm ring-1 ring-[#e5ddd0] p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-heading text-lg font-semibold text-[#5c5147]">{MEAL_LABELS[mealType]}</h2>
        {!searching && (
          <button
            onClick={() => setSearching(true)}
            className="text-sm font-semibold text-[#8d8079] hover:text-[#4a423c]"
          >
            + Add food
          </button>
        )}
      </div>

      {items.length === 0 && !searching && <p className="text-sm text-[#aba295]">No foods logged yet.</p>}

      {items.length > 0 && (
        <ul className="flex flex-col divide-y divide-[#e5ddd0]">
          {items.map((item) => (
            <li key={item.id} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm text-[#4a423c]">{item.name}</p>
                <p className="text-xs text-[#8d8079]">
                  {item.calories} kcal · {item.protein}g P · {item.fat}g F · {item.carbs}g C · {item.fiber}g fiber
                </p>
              </div>
              <button onClick={() => onRemove(item.id)} className="text-[#cfc7ba] hover:text-red-500 text-sm px-2">
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      {searching && <FoodSearch onAdd={handleAdd} onCancel={() => setSearching(false)} />}
    </div>
  )
}
