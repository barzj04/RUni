import { useState } from 'react'

export default function Navbar({ activePage, setActivePage, onLogout }) {
  const tabs = ['Schedule', 'Groceries', 'Recipes', 'Wishlist', 'Together', 'Personal']
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-sm px-6 py-4">
      <div className="flex justify-between items-center">
        <span className="text-xl font-bold text-rose-500">🍳 RUni</span>

        <div className="hidden md:flex gap-4">
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

        <div className="flex items-center gap-2">
          <button
            onClick={onLogout}
            className="hidden md:block px-4 py-2 rounded-full text-rose-400 hover:bg-rose-50 font-medium transition-colors"
          >
            Logout
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-600 hover:text-rose-400 transition-colors text-2xl"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-2">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => {
                setActivePage(tab)
                setMenuOpen(false)
              }}
              className={`px-4 py-2 rounded-lg font-medium text-left transition-colors ${
                activePage === tab
                  ? 'bg-rose-300 text-white'
                  : 'text-gray-600 hover:bg-rose-100'
              }`}
            >
              {tab}
            </button>
          ))}
          <button
            onClick={onLogout}
            className="px-4 py-2 rounded-lg text-red-400 hover:bg-red-50 font-medium text-left transition-colors"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  )
}