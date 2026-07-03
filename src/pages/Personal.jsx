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

export default function Personal({ userId, displayName }) {
    const [wishlist, setWishlist] = useState([]);
    const [todo, setTodo] = useState([]);
    const [wishItem, setWishItem] = useState('');
    const [todoTask, setTodoTask] = useState('');
    const [error, setError] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [confirmDeleteTodo, setConfirmDeleteTodo] = useState(null);
    
    useEffect(() => {
        loadAll()
    }, [])

    async function loadAll() {
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
        }
    }

    async function handleAddWishlist() {
        if (!wishItem.trim()) {
            setError('Item cannot be empty');
            return;
        }
        try{
            await addPersonalWishlist(userId, displayName, wishItem.trim());
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
            setConfirmDelete(null);
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
        try{
            await addPersonalTodo(userId, displayName, todoTask.trim());
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

    return(
        <div>
            <h2>Personal Space for - {displayName}</h2>
            {error && <p style={{color: 'red'}}>{error}</p>}
            {/* Wishlist Section */}
            <h3>To Buy Wishlist</h3>
            <p>{wishDone} of {wishlist.length} items purchased</p>
            <div>
                <input
                type="text"
                placeholder='e.g. laksa yum yum'
                value={wishItem}
                onChange={(e) => setWishItem(e.target.value)}
            />
            <button onClick={handleAddWishlist}>Add to Wishlist</button>
            </div>

            {wishlist.length === 0 && <p>Your wishlist is empty.</p>}
            {wishlist.map(w => (
                <div key={w.id}>
                    <input
                    type="checkbox"
                    checked={w.done}
                    onChange={() => handleToggleWish(w.id, w.done)}
                    /> 
                    {/* checkbox toggles the done state*/}
                    <span style={{textDecoration: w.done ? 'line-through' : 'none'}}>
                        {w.item} (added by {w.owner})
                    </span>
                    {/* strikethrough text when done */}
                    {confirmDelete === w.id ? (
                        <>
                            <button onClick={() => handleDeleteWish(w.id)}>Confirm Delete</button>
                            <button onClick={() => setConfirmDelete(null)}>Cancel</button>
                        </>
                    ) : (
                        <button onClick={() => setConfirmDelete(w.id)}>Delete</button>
                    )}
                </div>
            ))}
            {/* Todo Section */}
            <h3>To Do List</h3>
            <p>{todoDone} of {todo.length} tasks completed</p>
            <div>
                <input
                    type="text"
                    placeholder='e.g. finish project'
                    value={todoTask}
                    onChange={(e) => setTodoTask(e.target.value)}
                />
                <button onClick={handleAddTodo}>Add to Todo List</button>
            </div>
            {todo.length === 0 && <p>Your todo list is empty.</p>}
            {todo.map(t => (
                <div key={t.id}>
                    <input
                        type="checkbox"
                        checked={t.done}
                        onChange={() => handleToggleTodo(t.id, t.done)}
                    />
                    <span style={{textDecoration: t.done ? 'line-through' : 'none'}}>
                        {t.task}
                    </span>
                    {confirmDeleteTodo === t.id ? (
                        <>
                            <button onClick={() => handleDeleteTodo(t.id)}>Confirm Delete</button>
                            <button onClick={() => setConfirmDeleteTodo(null)}>Cancel</button>
                        </>
                    ) : (
                        <button onClick={() => setConfirmDeleteTodo(t.id)}>Delete</button>
                    )}
                </div>
            ))}
        </div>
    )}