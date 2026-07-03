import { useState, useEffect } from 'react'
import { supabase } from './services/supabaseClient'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Groceries from './pages/Groceries'
import GroceryWishlist from './pages/GroceryWishlist'
import Personal from './pages/Personal'
import Navbar from './components/Navbar'
// importing the Navbar component

export default function App() {
  const [session, setSession] = useState(null)
  const [page, setPage] = useState('login')
  const [activePage, setActivePage] = useState('Groceries')
  // activePage → tracks which tab is currently showing, defaults to Groceries

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  function handleLogout() {
    supabase.auth.signOut()
  }

  if (session) {
    return (
      <div>
        <Navbar
          activePage={activePage}
          setActivePage={setActivePage}
          onLogout={handleLogout}
        />
        {/* Navbar handles tab switching and logout */}

        <div style={{ padding: '20px' }}>
          <p>Logged in as: {session.user.email}</p>

          {activePage === 'Groceries' && <Groceries displayName={session.user.email} />}
          {activePage === 'Wishlist' && <GroceryWishlist displayName={session.user.email} />}
          {activePage === 'Personal' && <Personal userId={session.user.id} displayName={session.user.email} />}
          {/* only renders the active tab's component */}
        </div>
      </div>
    )
  }

  return (
    <div>
      {page === 'login' ? <Login /> : <Signup />}
      <button onClick={() => setPage(page === 'login' ? 'signup' : 'login')}>
        {page === 'login' ? 'Go to Sign Up' : 'Go to Login'}
      </button>
    </div>
  )
}