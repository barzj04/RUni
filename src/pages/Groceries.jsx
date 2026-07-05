import {useState, useEffect} from 'react';
import { fetchGroceries,addGrocery,togglePaidBack, deleteGrocery, clearAllGroceries } from '../services/groceryService';
import { sanitizeInput } from '../utils/sanitize'
import Spinner from '../components/Spinner'
import { calculateBill } from '../utils/billSplitting'

export default function Groceries({displayName}) {
    const [groceries, setGroceries] = useState([]);
    const[item, setItem] = useState("");
    const[price, setPrice] = useState("");
    const[paidBy, setPaidBy] = useState(displayName);
    const[error, setError] = useState(null);
    const[confirmDelete, setConfirmDelete] = useState(false);
    const[confirmClear, setConfirmClear] = useState(false);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        loadGroceries();
    }, []);

    async function loadGroceries() {
        setLoading(true)
        try {
            const data = await fetchGroceries();
            setGroceries(data);
        } catch (err) {
            setError(err.message);
        }finally {
            setLoading(false)
        }
    }

    async function handleAdd() {
        if (!item.trim()) {
        setError('Please enter an item name.')
        return
        }
        const parsedPrice = parseFloat(price) || 0
        const sanitizedItem = sanitizeInput(item)
       
        try {
        await addGrocery(sanitizedItem, parsedPrice, paidBy)
        setItem('')
        setPrice('')
        await loadGroceries()
        } catch (err) {
        setError(err.message)
        }
    }
    async function handleTogglePaidBack(id, currentValue) {
        try {
            await togglePaidBack(id, currentValue);
            await loadGroceries();
        } catch (err) {
            setError(err.message);
        }
    }
    async function handleDelete(id) {
        try {
            await deleteGrocery(id);
            setConfirmDelete(null);
            await loadGroceries();
        } catch (err) {
            setError(err.message);
        }
    }
    async function handleClearAll() {
        try {
            await clearAllGroceries();
            setConfirmClear(false);
            await loadGroceries();
        } catch (err) {
            setError(err.message);
        }
    }
    const { total, eachOwes, paidByMe, balance } = calculateBill(groceries, displayName)
    if (loading) return <Spinner />
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-700 mb-6"> Shared Groceries</h2>
            {error && <p className="text-red-400 mb-4">{error}</p>}
            <div className="bg-white rounded-xl shadow p-4 mb-6 flex gap-2 flex-wrap">
                <input
                    type="text"
                    placeholder="Item name"
                    value={item}
                    onChange={(e) => setItem(e.target.value)}
                    className="border border-rose-200 rounded-lg px-3 py-2 flex-1 foucs:outline-none focus:ring-2 focus:ring-rose-300"
                />
                <input
                type="number"
                placeholder="Price (RM)"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="border border-rose-200 rounded-lg px-3 py-2 w-32 focus:outline-none focus:ring-2 focus:ring-rose-300"
                />
                <select value = {paidBy} onChange={(e) => setPaidBy(e.target.value)}
                    className="border border-rose-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-300">
                    <option value={displayName}>{displayName}</option>
                    <option value="Rachel">Rachel</option>
                </select>
                <button onClick={handleAdd} className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-500 transition-colors">
                    Add Item
                </button>
            </div>
            <div className="bg-white rounded-xl shadow p-4 mb-6">
                <h3 className="font-semibold text-gray-700 mb-3">💰 Bill Summary</h3>
                <p className="text-gray-600">Total: <span className='font-bold'>RM {total.toFixed(2)}</span></p>
                <p className="text-gray-600">Each Owes: <span className='font-bold'>RM {eachOwes.toFixed(2)}</span></p>
                {Math.abs(balance) < 0.01 ? 
                    'All settled up!'
                    : balance >0 
                    ? <p>Rachel owes you RM {Math.abs(balance).toFixed(2)}</p> : <p>You owe Rachel RM {Math.abs(balance).toFixed(2)}</p>
                    
                }
            </div>
            <div className="mb-4">

                {confirmClear ? (
                    <div className="bg-white rounded-xl shadow-sm p-4 flex gap-2 items-center">
                        <p className="text-gray-600 flex-1">Are you sure you want to clear all groceries?</p>
                        <button onClick={handleClearAll} className="bg-rose-400 text-white px-4 py-2 rounded-lg hover:bg-rose-500 transition-colors">
                            Yes
                        </button>
                        <button onClick={() => setConfirmClear(false)} className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                            Cancel
                        </button>
                    </div>
            ) : (
                <button onClick={() => setConfirmClear(true)} className="text-sm font-medium">
                    Clear All Groceries
                </button>
            )}
            </div>
            <div className="flex flex-col gap-3">
                {groceries.map(g => (
                    <div key={g.id} className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3 flex-wrap">
                        <div className="flex-1">
                            <p className="text-gray-700 font-medium">{g.item}</p>
                            <p className="text-gray-400 text-sm">RM {(g.price || 0).toFixed(2)} - Paid by: {g.paid_by}</p>
                        </div>
                        
                        <button onClick={() => handleTogglePaidBack(g.id, g.paid_back)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${g.paid_back ? 'bg-green-100 text-green-600 ': 'bg-rose-100 text-rose-500 hover:bg-rose-200'}`}>
                            {g.paid_back ? "Paid back ✓" : "Mark as Paid"}
                        </button>

                        {confirmDelete === g.id ? (
                            <div className="flex gap-2">
                                <button onClick={() => handleDelete(g.id)} className="bg-red-400 text-sm hover:bg-gray-500 ">
                                    Confirm Delete
                                </button>
                                <button onClick={() => setConfirmDelete(null)} className="bg-gray-400 text-sm hover:bg-gray-500">
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <button onClick={() => setConfirmDelete(g.id)} className="hover:bg-gray-200 rounded-full transition-colors">
                                🗑️ Delete
                            </button>
                        )
                        }
                    </div>
                ))}
            </div>
        </div>
    )
}

