import {useState, useEffect} from 'react';
import { fetchGroceries,addGrocery,togglePaidBack, deleteGrocery, clearAllGroceries } from '../services/groceryService';

export default function Groceries({displayName}) {
    const [groceries, setGroceries] = useState([]);
    const[item, setItem] = useState("");
    const[price, setPrice] = useState("");
    const[paidBy, setPaidBy] = useState(displayName);
    const[error, setError] = useState(null);
    const[confirmDelete, setConfirmDelete] = useState(false);
    const[confirmClear, setConfirmClear] = useState(false);
    useEffect(() => {
        loadGroceries();
    }, []);

    async function loadGroceries() {
        try {
            const data = await fetchGroceries();
            setGroceries(data);
        } catch (err) {
            setError(err.message);
        }
    }

    async function handleAdd() {
        if (!item.trim()){
            setError("Please enter an item name.");
            return;  
        }
        const parsedPrice = parseFloat(price)|| 0;
        try {
            await addGrocery(item.trim (), parsedPrice, paidBy);
            setItem("");
            setPrice("");

            await loadGroceries();
        } catch (err) {
            setError(err.message);
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
    const total=groceries.reduce((sum, g) => sum + (g.price || 0), 0);
    const eachOwes = total / 2;
    const paidByMe = groceries.filter(g => g.paid_by === displayName).reduce((sum, g) => sum + (g.price || 0), 0);
    const balance = paidByMe - eachOwes;
    return (
        <div>
            <h1> Shared Groceries</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div>
                <input
                    type="text"
                    placeholder="Item name"
                    value={item}
                    onChange={(e) => setItem(e.target.value)}
                />
                <input
                type="number"
                placeholder="Price (RM)"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                />
                <select value = {paidBy} onChange={(e) => setPaidBy(e.target.value)}>
                    <option value={displayName}>{displayName}</option>
                    <option value="Rachel">Rachel</option>
                </select>
                <button onClick={handleAdd}>Add Item</button>
            </div>
            <div>
                <p>Total: RM {total.toFixed(2)}</p>
                <p>Each Owes: RM {eachOwes.toFixed(2)}</p>
                {Math.abs(balance) < 0.01 ? 
                    <p>All settled up!</p>
                    : balance >0 
                    ? <p>Rachel owes you RM {Math.abs(balance).toFixed(2)}</p> : <p>You owe Rachel RM {Math.abs(balance).toFixed(2)}</p>
                    
                }
            </div>
            {confirmClear ? (
                <div>
                    <p>Are you sure you want to clear all groceries?</p>
                    <button onClick={handleClearAll}>Yes</button>
                    <button onClick={() => setConfirmClear(false)}>No</button>
                </div>
            ) : (
                <button onClick={() => setConfirmClear(true)}>Clear All Groceries</button>
            )}
            
            {groceries.map(g => (
                <div key={g.id}>
                    <span>{g.item} </span>
                    <span>RM {g.price.toFixed(2)} </span>
                    <span>Paid by: {g.paid_by} </span>

                    <button onClick={() => handleTogglePaidBack(g.id, g.paid_back)}>
                        {g.paid_back ? "Mark as Unpaid" : "Mark as Paid"}
                    </button>

                    {confirmDelete === g.id ? (
                        <>
                        <button onClick={() => handleDelete(g.id)}>Confirm Delete</button>
                        <button onClick={() => setConfirmDelete(null)}>Cancel</button>
                        </>
                    ) : (
                        <button onClick={() => setConfirmDelete(g.id)}>Delete</button>
                    )
                    }
                </div>
            ))}
            </div>
    )
}

