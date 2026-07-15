import { useState } from 'react'

export default function Navbar({ activePage, setActivePage, onLogout }) {
  const tabs = ['Schedule', 'Groceries', 'Recipes', 'Wishlist', 'Together', 'Personal']
<<<<<<< HEAD
=======
  const [menuOpen, setMenuOpen] = useState(false)

>>>>>>> feature/mobile-layout
  return (
    <nav className="bg-white shadow-sm px-6 py-4">
      <div className="flex justify-between items-center">
        <span className="text-xl font-bold text-rose-500">🍳 RUni</span>

        {/* ── DESKTOP TABS — hidden on mobile ── */}
        <div className="hidden md:flex gap-4">
          {/* hidden → hide on mobile, md:flex → show on medium screens and above */}
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

          {/* ── HAMBURGER BUTTON — only on mobile ── */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-600 hover:text-rose-400 transition-colors text-2xl"
          >
            {menuOpen ? '✕' : '☰'}
            {/* toggle between hamburger and close icon */}
          </button>
        </div>
      </div>

      {/* ── MOBILE DROPDOWN MENU ── */}
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-2">
          {/* md:hidden → only show on mobile */}
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