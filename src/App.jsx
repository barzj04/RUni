import { useState, useEffect } from 'react'
import { supabase } from './services/supabaseClient'
import { fetchProfile } from './services/profileService'
import Schedule from './pages/Schedule'
import Recipes from './pages/Recipes'

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
  const [displayName, setDisplayName] = useState('')
  // activePage → tracks which tab is currently showing, defaults to Groceries

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) loadProfile(session.user.id)
    })
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) loadProfile(session.user.id)
    })
  }, [])

  async function loadProfile(userId) {
    try {
      const name = await fetchProfile(userId)
      console.log('display name loaded:', name)
      setDisplayName(name)
    }catch (err) {
      console.error('Error fetching profile:', err)
    }}


  function handleLogout() {
    supabase.auth.signOut()
    setDisplayName('')
  }

  if (session) {
    return (
      <div className="min-h-screen bg-rose-50">
        <Navbar
          activePage={activePage}
          setActivePage={setActivePage}
          onLogout={handleLogout}
        />
        {/* Navbar handles tab switching and logout */}

        <div className='max-w-3xl mx-auto px-4 py-8'>
          <p className='text-sm text-gray-400 mb-6'>Logged in as: {displayName}</p>
          {activePage==='Schedule' && <Schedule userId={session.user.id} displayName={displayName} />}
          {activePage === 'Groceries' && <Groceries displayName={displayName} />}
          {activePage === 'Recipes' && <Recipes />}
          {activePage === 'Wishlist' && <GroceryWishlist displayName={displayName} />}
          {activePage === 'Personal' && <Personal userId={session.user.id} displayName={displayName} />}
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