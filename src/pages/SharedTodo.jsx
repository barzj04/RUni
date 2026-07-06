import { useState, useEffect } from 'react'
import { fetchSharedTodos, addSharedTodo, toggleSharedTodo, deleteSharedTodo } from '../services/sharedTodoService'
import { sanitizeInput } from '../utils/sanitize'
import Spinner from '../components/Spinner'

export default function SharedTodo({ displayName }) {
  const [todos, setTodos] = useState([])
  const [task, setTask] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [link, setLink] = useState('')

  useEffect(() => {
    loadTodos()
  }, [])

  async function loadTodos() {
    setLoading(true)
    try {
      const data = await fetchSharedTodos()
      console.log('shared todos:', data)
      setTodos(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleAdd() {
    if (!task.trim()) {
      setError('Please enter a task.')
      return
    }
    const sanitizedTask = sanitizeInput(task)
    const sanitizedLink = sanitizeInput(link)
    setLink('')
    try {
      await addSharedTodo(sanitizedTask, displayName, sanitizedLink)
      setTask('')
      setLink('')
      await loadTodos()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleToggle(id, currentValue) {
    try {
      await toggleSharedTodo(id, currentValue)
      await loadTodos()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete(id) {
    try {
      await deleteSharedTodo(id)
      setConfirmDelete(null)
      await loadTodos()
    } catch (err) {
      setError(err.message)
    }
  }

  const doneTodos = todos.filter(t => t.done).length

  if (loading) return <Spinner />

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-700 mb-2">✅ Things To Do Together</h2>
      <p className="text-gray-400 text-sm mb-6">A shared list for both of you — {doneTodos} of {todos.length} done.</p>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      {/* ── ADD FORM ── */}
      <div className="bg-white rounded-xl shadow p-4 mb-6 flex flex-col gap-3 md:flex-row">
        <input
          type="text"
          placeholder="e.g. Clean the kitchen, Pay rent"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="border border-rose-200 rounded-lg px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-rose-300"
        />
        <input
            type="text"
            placeholder="Link (optional)"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="border border-rose-200 rounded-lg px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-rose-300"
            />
        <button
          onClick={handleAdd}
          className="bg-rose-400 text-white px-4 py-2 rounded-lg hover:bg-rose-500 transition-colors w-full md:w-auto"
        >
          Add
        </button>
      </div>

      {/* ── TODO LIST ── */}
      {todos.length === 0 && <p className="text-gray-400 text-sm">No tasks yet. Add something to do together!</p>}

      <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-3">
        {todos.map(t => (
          <div key={t.id} className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={t.done}
              onChange={() => handleToggle(t.id, t.done)}
              className="accent-rose-400 w-4 h-4"
            />
            <div className="flex-1">
              <span className={`text-gray-700 ${t.done ? 'line-through text-gray-400' : ''}`}>
                {t.task}
              </span>
                {t.link && (
                    <a href={t.link} target="_blank" rel="noopener noreferrer" className="ml-2 text-rose-400 hover:text-rose-500 text-sm underline">
                    🔗 Link
                    </a>
                )}
              <p className="text-xs text-gray-400">Added by {t.added_by}</p>
            </div>

            {confirmDelete === t.id ? (
              <div className="flex gap-2">
                <button onClick={() => handleDelete(t.id)} className="text-red-400 text-sm hover:text-red-500">Yes</button>
                <button onClick={() => setConfirmDelete(null)} className="text-gray-400 text-sm hover:text-gray-500">Cancel</button>
              </div>
            ) : (
              <button onClick={() => setConfirmDelete(t.id)} className="text-gray-300 hover:text-red-400 transition-colors">🗑️</button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}