export default function Navbar({ activePage, setActivePage, onLogout }) {
  const tabs = ['Schedule', 'Groceries', 'Recipes', 'Wishlist', 'Together', 'Personal']
  return (
    <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      <span className="text-xl font-bold text-rose-500">🍳 RUni</span>

      <div className="flex gap-4">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActivePage(tab)}
            className={`px-4 py-2 rounded-full font-medium transition-colors duration-200 ${
              activePage === tab
                ? 'bg-rose-300 text-white'
                : 'text-gray-600 hover:bg-rose-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <button
        onClick={onLogout}
        className="px-4 py-2 rounded-full text-rose-400 hover:bg-rose-50 font-medium transition-colors"
      >
        Logout
      </button>
    </nav>
  )
}