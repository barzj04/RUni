import {useState, useEffect} from 'react';
import {fetchSchedules, upsertSchedule} from '../services/scheduleService'
import Spinner from '../components/Spinner'

const DAYS=['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const MEALS=[ 'Lunch', 'Dinner']

export default function Schedule({userId, displayName}) {
    const [schedules, setSchedules] = useState({});
    const [mySchedule, setMySchedule] = useState({});
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [error, setError] = useState(null)
    const [partnerLastUpdated, setPartnerLastUpdated] = useState(null)

    useEffect (()=>{
        loadSchedules()
    },[])

    async function loadSchedules(){
        setLoading(true)
        try{
            const data = await fetchSchedules()
            const mapped ={}
            data.forEach(row=>{
                mapped[row.roommate]=row.schedule
                if (row.roommate !== displayName) {
                    setPartnerLastUpdated(row.updated_at)
                }
            })
            setSchedules(mapped)
            setMySchedule(mapped[displayName]||{})
        }catch(err){
                setError(err.message)
        }finally{
            setLoading(false)
        }
        
    }
    function toggleMeal (day,meal){
        setMySchedule(prev=>({
            ...prev,
            [day]:{
                ...prev[day],
                [meal]: !prev[day]?.[meal]
            }
        }))
    }

    async function handleSave() {
        setSaving(true)
        try {
        await upsertSchedule(userId, displayName, mySchedule)
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
        await loadSchedules()
        } catch (err) {
        setError(err.message)
        } finally {
        setSaving(false)
        }
    }

    const partnerName = displayName === 'Arleen'?'Rachel':'Arleen'
    const partnerSchedule = schedules[partnerName]||{}
    if (loading) return <Spinner />

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-700 mb-2">📅 Schedule</h2>
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-400 text-sm mb-6">Mark when you're free for meals. See where you overlap with {partnerName}.</p>
        <button
                onClick={loadSchedules}
                className="text-rose-400 hover:text-rose-500 text-sm font-medium flex items-center gap-1"
            >
                🔄 Refresh
            </button>
        </div>
        {partnerLastUpdated && (
            <p className="text-gray-400 text-xs mb-4">
                {partnerName} last updated their schedule on {new Date(partnerLastUpdated).toLocaleString('en-MY', { dateStyle: 'medium', timeStyle: 'short' })}
                {/* toLocaleString → formats date nicely based on Malaysian locale */}
            </p>
            )}
      {error && <p className="text-red-400 mb-4">{error}</p>}
      {saved && <p className="text-green-500 mb-4">✅ Schedule saved!</p>}

      {/* ── MY SCHEDULE ── */}
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <h3 className="font-semibold text-gray-700 mb-4">👤 Your Availability</h3>

        <div className="flex flex-col gap-3">
          {DAYS.map(day => (
            <div key={day} className="flex items-center gap-4">
              <span className="w-28 text-gray-600 font-medium text-sm">{day}</span>
              {MEALS.map(meal => (
                <label key={meal} className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={mySchedule[day]?.[meal] || false}
                    onChange={() => toggleMeal(day, meal)}
                    className="accent-rose-400 w-4 h-4"
                  />
                  <span className="text-sm text-gray-500">{meal}</span>
                </label>
              ))}
            </div>
          ))}
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-6 bg-rose-400 text-white px-6 py-2 rounded-lg hover:bg-rose-500 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Schedule'}
        </button>
      </div>

      {/* ── OVERLAP ── */}
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="font-semibold text-gray-700 mb-4">🤝 Overlap with {partnerName}</h3>

        <div className="flex flex-col gap-2">
          {DAYS.map(day => {
            const myLunch = mySchedule[day]?.Lunch
            const myDinner = mySchedule[day]?.Dinner
            const partnerLunch = partnerSchedule[day]?.Lunch
            const partnerDinner = partnerSchedule[day]?.Dinner
            const sharedLunch = myLunch && partnerLunch
            const sharedDinner = myDinner && partnerDinner
            // only show overlap if both are free for the same meal

            if (!sharedLunch && !sharedDinner) return null
            // skip days with no overlap

            return (
              <div key={day} className="flex items-center gap-3">
                <span className="w-28 text-gray-600 font-medium text-sm">{day}</span>
                <div className="flex gap-2">
                  {sharedLunch && (
                    <span className="bg-rose-100 text-rose-500 px-3 py-1 rounded-full text-sm">🌞 Lunch</span>
                  )}
                  {sharedDinner && (
                    <span className="bg-rose-100 text-rose-500 px-3 py-1 rounded-full text-sm">🌙 Dinner</span>
                  )}
                </div>
              </div>
            )
          })}

          {DAYS.every(day => !mySchedule[day]?.Lunch && !mySchedule[day]?.Dinner) && (
            <p className="text-gray-400 text-sm">No overlap yet — save your schedule first.</p>
          )}
        </div>
      </div>
    </div>
  )
}
