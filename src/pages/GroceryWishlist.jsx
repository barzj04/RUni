import { useState, useEffect } from 'react'
import { fetchGroceryWishlist, addGroceryWishlist, deleteGroceryWishlist, moveToGroceries } from '../services/groceryWishlistService'

export default function GroceryWishlist({ displayName }) {
  const [wishlist, setWishlist] = useState([])
  const [item, setItem] = useState('')

  const [error, setError] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  useEffect(() => {
    loadWishlist()
  }, [])

  async function loadWishlist() {
    try {
      const data = await fetchGroceryWishlist()
      setWishlist(data)
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleAdd() {
    if (!item.trim()) {
      setError('Please enter an item.')
      return
    }
    try {
      await addGroceryWishlist(item.trim(), displayName)
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

  return (
    <div>
      <h2>Grocery Wishlist</h2>
      <p>Items you want to buy someday — move them to the bill once bought.</p>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        <input
          type="text"
          placeholder="e.g. Miso paste, Tahini"
          value={item}
          onChange={(e) => setItem(e.target.value)}
        />
        <button onClick={handleAdd}>Add to Wishlist</button>
      </div>

      {wishlist.length === 0 && <p>Nothing on the wishlist yet.</p>}

      {wishlist.map(w => (
        <div key={w.id}>
          <span>{w.item} </span>
          <span>Added by: {w.added_by} </span>

          <button onClick={() => handleMove(w.id, w.item)}>
            Move to Bill
          </button>
          // clicking this adds item to groceries and removes from wishlist

          {confirmDelete === w.id ? (
            <>
              <button onClick={() => handleDelete(w.id)}>Yes, delete</button>
              <button onClick={() => setConfirmDelete(null)}>Cancel</button>
            </>
          ) : (
            <button onClick={() => setConfirmDelete(w.id)}>Delete</button>
          )}
        </div>
      ))}
    </div>
  )
}