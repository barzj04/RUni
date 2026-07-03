export default function Navbar({ activePage, setActivePage, onLogout }) {
    const tabs = ['Groceries','Wishlist','Personal'];
    return (
        <nav>
            <span>RUni</span>
            <div>
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActivePage(tab)}
                        style={{ fontWeight: activePage === tab ? 'bold' : 'normal',
                            textDecoration: activePage === tab ? 'underline' : 'none'
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>
            <button onClick={onLogout}>Logout</button>
        </nav>
    );
}