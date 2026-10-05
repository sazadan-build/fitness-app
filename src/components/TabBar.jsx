const TABS = ['Today', 'Nutrition', 'Exercise']

export default function TabBar({ activeTab, onChange }) {
  return (
    <div className="flex bg-white/80 backdrop-blur rounded-2xl shadow-sm ring-1 ring-[#e5ddd0] p-1 mb-6">
      {TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`flex-1 py-2 rounded-xl text-sm font-semibold transition ${
            activeTab === tab ? 'bg-[#8d8079] text-white shadow-sm' : 'text-[#8d8079] hover:bg-[#f2ede2]'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}
