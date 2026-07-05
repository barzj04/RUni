import { useState, useEffect } from 'react'
import { fetchRecipes, addRecipe, deleteRecipe } from '../services/recipeService'
import { sanitizeInput } from '../utils/sanitize'
import Spinner from '../components/Spinner'

const WHEN_OPTIONS = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Anytime']

export default function Recipes() {
  const [recipes, setRecipes] = useState([])
  const [idea, setIdea] = useState('')
  const [link, setLink] = useState('')
  const [whenToCook, setWhenToCook] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  useEffect(() => {
    loadRecipes()
  }, [])

  async function loadRecipes() {
    setLoading(true)
    try {
      const data = await fetchRecipes()
      setRecipes(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleAdd() {
    if (!idea.trim()) {
      setError('Please enter a dish name.')
      return
    }
    const sanitizedIdea = sanitizeInput(idea)
    const sanitizedLink = sanitizeInput(link)
    try {
      await addRecipe(sanitizedIdea, sanitizedLink, whenToCook)
      setIdea('')
      setLink('')
      setWhenToCook('')
      await loadRecipes()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete(id) {
    try {
      await deleteRecipe(id)
      setConfirmDelete(null)
      await loadRecipes()
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <Spinner />

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-700 mb-2">💡 Recipes</h2>
      <p className="text-gray-400 text-sm mb-6">A shared pool of meal ideas for both of you.</p>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      <div className="bg-white rounded-xl shadow p-4 mb-6 flex flex-col gap-3">
        <input
          type="text"
          placeholder="Dish name e.g. Spaghetti Aglio e Olio *"
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          className="border border-rose-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-300"
        />
        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Recipe link (optional)"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="border border-rose-200 rounded-lg px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-rose-300"
          />
          <select
            value={whenToCook}
            onChange={(e) => setWhenToCook(e.target.value)}
            className="border border-rose-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-300"
          >
            {WHEN_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt || 'When to cook?'}</option>
            ))}
          </select>
          <button
            onClick={handleAdd}
            className="bg-rose-400 text-white px-4 py-2 rounded-lg hover:bg-rose-500 transition-colors"
          >
            Add Recipe
          </button>
        </div>
      </div>

      {recipes.length === 0 && <p className="text-gray-400 text-sm">No recipes yet. Add some ideas above!</p>}

      <div className="flex flex-col gap-3">
        {recipes.map(r => (
          <div key={r.id} className="bg-white rounded-xl shadow-sm p-4 flex items-start gap-3">
            <div className="flex-1">
              <p className="font-medium text-gray-700">🍽️ {r.idea}</p>
              <div className="flex gap-3 mt-1 flex-wrap">
                {r.when_to_cook && (
                  <span className="text-sm text-gray-400">📅 {r.when_to_cook}</span>
                )}
                {r.link && (
                  <a href={r.link} target="_blank" rel="noopener noreferrer" className="text-sm text-rose-400 hover:text-rose-500 underline">
                    🔗 Recipe
                  </a>
                )}
              </div>
            </div>
            {confirmDelete === r.id ? (
              <div className="flex gap-2">
                <button onClick={() => handleDelete(r.id)} className="text-red-400 text-sm hover:text-red-500">Yes</button>
                <button onClick={() => setConfirmDelete(null)} className="text-gray-400 text-sm hover:text-gray-500">Cancel</button>
              </div>
            ) : (
              <button onClick={() => setConfirmDelete(r.id)} className="text-gray-300 hover:text-red-400 transition-colors">🗑️</button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}