export default function Navbar({ activePage, setActivePage, onLogout }) {
  const tabs = ['Schedule', 'Groceries', 'Recipes', 'Wishlist', 'Together', 'Personal']

  return (
    <>
      {/* --- DESKTOP TOP NAV (Hidden on mobile) --- */}
      <nav className="hidden md:flex bg-white shadow-sm px-6 py-4 justify-between items-center">
        <span className="text-xl font-bold text-rose-500">🍳 RUni</span>
        <div className="flex gap-4">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActivePage(tab)}
              className={`px-4 py-2 rounded-full font-medium transition-colors duration-200 ${
                activePage === tab ? 'bg-rose-300 text-white' : 'text-gray-600 hover:bg-rose-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <button onClick={onLogout} className="px-4 py-2 rounded-full text-rose-400 hover:bg-rose-50 font-medium transition-colors">
          Logout
        </button>
      </nav>

      {/* --- MOBILE BOTTOM NAV & TOP BAR --- */}
      {/* Mobile Header (Just Logo & Logout) */}
      <div className="md:hidden bg-white shadow-sm px-4 py-3 flex justify-between items-center sticky top-0 z-50">
        <span className="text-xl font-bold text-rose-500">🍳 RUni</span>
        <button onClick={onLogout} className="text-sm font-medium text-rose-400 px-3 py-1 rounded-full hover:bg-rose-50">
          Logout
        </button>
      </div>

      {/* Mobile Bottom Tab Bar (Scrolls horizontally if screens get very small) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 flex justify-around items-center z-50 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActivePage(tab)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activePage === tab ? 'bg-rose-100 text-rose-600' : 'text-gray-500'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </>
  )
}