import {useState, useEffect} from 'react';
import {
    fetchPersonalWishlist,
    addPersonalWishlist,
    togglePersonalWishlist,
    deletePersonalWishlist,
    fetchPersonalTodo,
    addPersonalTodo,
    togglePersonalTodo,
    deletePersonalTodo
} from '../services/personalService';
import { sanitizeInput } from '../utils/sanitize'
import Spinner from '../components/Spinner'

export default function Personal({ userId, displayName }) {
    const [wishlist, setWishlist] = useState([]);
    const [todo, setTodo] = useState([]);
    const [wishItem, setWishItem] = useState('');
    const [todoTask, setTodoTask] = useState('');
    const [error, setError] = useState(null);
    const [confirmDeleteWish, setConfirmDeleteWish] = useState(null);
    const [confirmDeleteTodo, setConfirmDeleteTodo] = useState(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        loadAll()
    }, [])

    async function loadAll() {
        setLoading(true)
        try {
            const [wishData, todoData] = await Promise.all([
                fetchPersonalWishlist(userId),
                fetchPersonalTodo(userId)
            ])
            // Promise.all → runs both fetches simultaneously instead of one by one
            setWishlist(wishData)
            setTodo(todoData)
        } catch (err) {
            setError(err.message)
        }finally {
            setLoading(false)
        }
    }

    async function handleAddWishlist() {
        if (!wishItem.trim()) {
            setError('Item cannot be empty');
            return;
        }
        const sanitizedItem = sanitizeInput(wishItem)
        try{
            await addPersonalWishlist(userId, displayName, sanitizedItem);
            setWishItem('');
            await loadAll();
        } catch (err) {
            setError(err.message);
        }
    }
    async function handleToggleWish(id, currentValue) {
        try {
            await togglePersonalWishlist(id, currentValue);
            await loadAll();
        }catch (err) {
            setError(err.message);
        }
    }
    async function handleDeleteWish(id) {
        try {
            await deletePersonalWishlist(id);
            setConfirmDeleteWish(null);
            await loadAll();
        } catch (err) {
            setError(err.message);
        }
    }
    async function handleAddTodo() {
        if (!todoTask.trim()) {
            setError('Task cannot be empty');
            return;
        }
        const sanitizedTask = sanitizeInput(todoTask)
        try{
            await addPersonalTodo(userId, displayName, sanitizedTask);
            setTodoTask('');
            await loadAll();
        } catch (err) {
            setError(err.message);
        }
    }

    async function handleToggleTodo(id, currentValue) {
        try {
            await togglePersonalTodo(id, currentValue);
            await loadAll();
        }catch (err) {
            setError(err.message);
        }
    }

    async function handleDeleteTodo(id) {
        try {
            await deletePersonalTodo(id);
            setConfirmDeleteTodo(null);
            await loadAll();
        } catch (err) {
            setError(err.message);
        }
    }

    const wishDone = wishlist.filter(item => item.done).length;
    const todoDone = todo.filter(task => task.done).length;
    if (loading) return <Spinner />
    return (
        <div>
        <h2 className="text-2xl font-bold text-gray-700 mb-2">🔒 Personal Space</h2>
        <p className="text-gray-400 text-sm mb-6">Only you can see this.</p>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        {/* ── WISHLIST ── */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
            <h3 className="font-semibold text-gray-700 mb-1">🛍️ To-Buy Wishlist</h3>
            <p className="text-sm text-gray-400 mb-4">{wishDone} of {wishlist.length} bought</p>

            <div className="flex gap-2 mb-4">
            <input
                type="text"
                placeholder="e.g. New earphones"
                value={wishItem}
                onChange={(e) => setWishItem(e.target.value)}
                className="border border-rose-200 rounded-lg px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-rose-300"
            />
            <button onClick={handleAddWishlist} className="bg-rose-400 text-white px-4 py-2 rounded-lg hover:bg-rose-500 transition-colors">
                Add
            </button>
            </div>

            {wishlist.length === 0 && <p className="text-gray-400 text-sm">Nothing on your wishlist yet.</p>}

            <div className="flex flex-col gap-2">
            {wishlist.map(w => (
                <div key={w.id} className="flex items-center gap-3">
                <input
                    type="checkbox"
                    checked={w.done}
                    onChange={() => handleToggleWish(w.id, w.done)}
                    className="accent-rose-400 w-4 h-4"
                    // accent-rose-400 → pink checkbox color
                />
                <span className={`flex-1 text-gray-700 ${w.done ? 'line-through text-gray-400' : ''}`}>
                    {w.item}
                </span>
                {confirmDeleteWish === w.id ? (
                    <div className="flex gap-2">
                    <button onClick={() => handleDeleteWish(w.id)} className="text-red-400 text-sm hover:text-red-500">Yes</button>
                    <button onClick={() => setConfirmDeleteWish(null)} className="text-gray-400 text-sm hover:text-gray-500">Cancel</button>
                    </div>
                ) : (
                    <button onClick={() => setConfirmDeleteWish(w.id)} className="text-gray-300 hover:text-red-400 transition-colors">🗑️</button>
                )}
                </div>
            ))}
            </div>
        </div>

        {/* ── TODO ── */}
        <div className="bg-white rounded-xl shadow p-4">
            <h3 className="font-semibold text-gray-700 mb-1">✅ To-Do List</h3>
            <p className="text-sm text-gray-400 mb-4">{todoDone} of {todo.length} done</p>

            <div className="flex gap-2 mb-4">
            <input
                type="text"
                placeholder="e.g. Clean the fridge"
                value={todoTask}
                onChange={(e) => setTodoTask(e.target.value)}
                className="border border-rose-200 rounded-lg px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-rose-300"
            />
            <button onClick={handleAddTodo} className="bg-rose-400 text-white px-4 py-2 rounded-lg hover:bg-rose-500 transition-colors">
                Add
            </button>
            </div>

            {todo.length === 0 && <p className="text-gray-400 text-sm">No tasks yet.</p>}

            <div className="flex flex-col gap-2">
            {todo.map(t => (
                <div key={t.id} className="flex items-center gap-3">
                <input
                    type="checkbox"
                    checked={t.done}
                    onChange={() => handleToggleTodo(t.id, t.done)}
                    className="accent-rose-400 w-4 h-4"
                />
                <span className={`flex-1 text-gray-700 ${t.done ? 'line-through text-gray-400' : ''}`}>
                    {t.task}
                </span>
                {confirmDeleteTodo === t.id ? (
                    <div className="flex gap-2">
                    <button onClick={() => handleDeleteTodo(t.id)} className="text-red-400 text-sm hover:text-red-500">Yes</button>
                    <button onClick={() => setConfirmDeleteTodo(null)} className="text-gray-400 text-sm hover:text-gray-500">Cancel</button>
                    </div>
                ) : (
                    <button onClick={() => setConfirmDeleteTodo(t.id)} className="text-gray-300 hover:text-red-400 transition-colors">🗑️</button>
                )}
                </div>
            ))}
            </div>
        </div>
    </div>
  )}