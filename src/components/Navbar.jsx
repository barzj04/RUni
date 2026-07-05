export default function Navbar({ activePage, setActivePage, onLogout }) {
    const tabs = ['Groceries', 'Wishlist', 'Personal']
    return (
        <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
            <span className="text-xl font-bold text-rose-300">RUni</span>
            <div className="flex gap-4">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActivePage(tab)}
                        className={`px-4 py-2 rounded-full font-medium transition-colors duration-200 ${
                            activePage === tab
                                ? 'bg-rose-300 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
            <button
                onClick={onLogout}
                className="px-4 py-2 rounded-full text-red-500 hover:bg-red-50 font-medium transition-colors"
            >
                Logout
            </button>
        </nav>
    );
}