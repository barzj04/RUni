import { useState, useEffect } from 'react'
import { fetchGroceryWishlist, addGroceryWishlist, deleteGroceryWishlist, moveToGroceries } from '../services/groceryWishlistService'
import { sanitizeInput } from '../utils/sanitize'
import Spinner from '../components/Spinner'

export default function GroceryWishlist({ displayName }) {
  const [wishlist, setWishlist] = useState([])
  const [item, setItem] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  useEffect(() => {
    loadWishlist()
  }, [])

  async function loadWishlist() {
    setLoading(true)
    try {
      const data = await fetchGroceryWishlist()
      setWishlist(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleAdd() {
    if (!item.trim()) {
      setError('Please enter an item.')
      return
    }
    const sanitizedItem = sanitizeInput(item)
    try {
      await addGroceryWishlist(sanitizedItem, displayName)
      setItem('')
      await loadWishlist()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete(id) {
    try {
      await deleteGroceryWishlist(id)
      setConfirmDelete(null)
      await loadWishlist()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleMove(id, itemName) {
    try {
      await moveToGroceries(id, itemName, displayName)
      await loadWishlist()
    } catch (err) {
      setError(err.message)
    }
  }
  if (loading) return <Spinner />
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-700 mb-6">📋 Grocery Wishlist</h2>
      <p className="text-gray-400 text-sm mb-6">Items you want to buy someday — move them to the bill once bought.</p>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      <div className="bg-white rounded-xl shadow p-4 mb-6 flex flex-col gap-3 md:flex-row">
        <input
          type="text"
          placeholder="e.g. Miso paste, Tahini"
          value={item}
          onChange={(e) => setItem(e.target.value)}
          className="border border-rose-200 rounded-lg px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-rose-300"
        />
        <button onClick={handleAdd} className="bg-rose-400 text-white px-4 py-2 rounded-lg hover:bg-rose-500 transition-colors w-full md:w-auto">
          Add
        </button>
      </div>

      {wishlist.length === 0 && <p className="text-gray-400 text-sm">Nothing on the wishlist yet.</p>}

      <div className="flex flex-col gap-3">
        {wishlist.map(w => (
          <div key={w.id} className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3 flex-wrap">
            <div className="flex-1">
              <p className="font-medium text-gray-700">{w.item}</p>
              <p className="text-sm text-gray-400">Added by {w.added_by}</p>
            </div>

            <button
              onClick={() => handleMove(w.id, w.item)}
              className="bg-rose-100 text-rose-500 hover:bg-rose-200 px-3 py-1 rounded-full text-sm font-medium transition-colors"
            >
              Move to Bill
            </button>

            {confirmDelete === w.id ? (
              <div className="flex gap-2">
                <button onClick={() => handleDelete(w.id)} className="text-red-400 text-sm hover:text-red-500">Yes</button>
                <button onClick={() => setConfirmDelete(null)} className="text-gray-400 text-sm hover:text-gray-500">Cancel</button>
              </div>
            ) : (
              <button onClick={() => setConfirmDelete(w.id)} className="text-gray-300 hover:text-red-400 transition-colors">🗑️</button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}