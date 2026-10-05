import { useState } from 'react'
import { useFitnessData } from './data/useFitnessData.js'
import TabBar from './components/TabBar.jsx'
import TodayTab from './components/TodayTab.jsx'
import NutritionTab from './components/NutritionTab.jsx'
import ExerciseTab from './components/ExerciseTab.jsx'

export default function App() {
  const [activeTab, setActiveTab] = useState('Today')
  const {
    data,
    adjustSteps,
    adjustWater,
    addWeightLog,
    addBodyFatLog,
    addMealItem,
    removeMealItem,
    addWorkoutSet,
    removeWorkoutSet,
    updateWorkoutNotes,
  } = useFitnessData()

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-xl mx-auto">
        <h1 className="font-heading text-3xl font-bold text-[#4a423c] mb-6 tracking-tight">Fitness Tracker</h1>
        <TabBar activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === 'Today' && (
          <TodayTab
            data={data}
            adjustSteps={adjustSteps}
            adjustWater={adjustWater}
            addWeightLog={addWeightLog}
            addBodyFatLog={addBodyFatLog}
          />
        )}

        {activeTab === 'Nutrition' && (
          <NutritionTab data={data} addMealItem={addMealItem} removeMealItem={removeMealItem} />
        )}

        {activeTab === 'Exercise' && (
          <ExerciseTab data={data} addWorkoutSet={addWorkoutSet} removeWorkoutSet={removeWorkoutSet} updateWorkoutNotes={updateWorkoutNotes} />
        )}
      </div>
    </div>
  )
}
