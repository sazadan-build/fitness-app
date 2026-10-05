import { getDay, todayKey } from '../data/store.js'
import MealSection from './MealSection.jsx'

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner']

export default function NutritionTab({ data, addMealItem, removeMealItem }) {
  const today = getDay(data, todayKey())

  return (
    <div className="flex flex-col gap-5">
      {MEAL_TYPES.map((mealType) => (
        <MealSection
          key={mealType}
          mealType={mealType}
          items={today.meals[mealType]}
          onAdd={(food) => addMealItem(mealType, food)}
          onRemove={(itemId) => removeMealItem(mealType, itemId)}
        />
      ))}
    </div>
  )
}
