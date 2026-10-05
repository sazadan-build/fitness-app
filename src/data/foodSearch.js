// Talks to the USDA FoodData Central API to look up nutrition facts for a
// food by name. `import.meta.env.VITE_USDA_API_KEY` reads the key we put in
// .env.local — Vite automatically makes any env variable starting with
// VITE_ available to our app's code (this keeps the key out of the source
// code itself, so it's not something we'd accidentally share/commit).
const USDA_API_KEY = import.meta.env.VITE_USDA_API_KEY

// USDA reports many nutrients per food; we only care about these five,
// matched by their official USDA name.
const NUTRIENT_MAP = {
  Energy: 'calories',
  Protein: 'protein',
  'Total lipid (fat)': 'fat',
  'Carbohydrate, by difference': 'carbs',
  'Fiber, total dietary': 'fiber',
}

// Returns up to 10 matching foods. Values are per the USDA reference
// amount, which for most foods is per 100 grams.
//
// We restrict to the "Foundation" and "SR Legacy" data types — USDA's
// standardized, generic-food entries (e.g. distinct fat %, raw vs. cooked)
// — and skip "Branded", which is what floods a common search term like
// "ground beef" with dozens of near-duplicate packaged products.
export async function searchFoods(query) {
  const trimmed = query.trim()
  if (!trimmed) return []

  const url = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${USDA_API_KEY}&query=${encodeURIComponent(trimmed)}&dataType=Foundation,SR%20Legacy&pageSize=10`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`USDA search failed (${res.status})`)
  }
  const data = await res.json()

  return (data.foods || [])
    .map((food) => {
      const macros = { calories: 0, protein: 0, fat: 0, carbs: 0, fiber: 0 }
      for (const nutrient of food.foodNutrients || []) {
        const key = NUTRIENT_MAP[nutrient.nutrientName]
        // USDA lists "Energy" twice per food — once in kcal, once in kJ.
        // Skip the kJ one so we don't accidentally grab a ~4x-too-large number.
        if (key === 'calories' && nutrient.unitName !== 'KCAL') continue
        if (key) macros[key] = Math.round(nutrient.value)
      }
      return {
        id: String(food.fdcId),
        name: food.description,
        ...macros,
      }
    })
    // Some newer "Foundation" entries haven't had their nutrients fully
    // analyzed yet and come back all-zero — not useful to show.
    .filter((food) => food.calories > 0)
}
