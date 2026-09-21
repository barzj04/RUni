import {useState, useEffect} from 'react';
import {fetchSchedules, upsertSchedule} from '../services/scheduleService'
import Spinner from '../components/Spinner'

const DAYS=['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const MEALS=[ 'Lunch', 'Dinner']

function getMonday(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - (d.getDay() === 0 ? 6 : d.getDay() - 1))
  return d
}

// local YYYY-MM-DD (avoids the UTC shift toISOString would cause)
function toKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function getWeekDates(monday) {
  return DAYS.map((day, i) => {
    const date = new Date(monday)
    date.setDate(monday.getDate() + i)
    return date
  })
}

function getISOWeek(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7)
}

// old data was saved as { Monday: {...} } for a single week; new data is { "2026-09-21": { Monday: {...} } }
function normalise(schedule, currentWeekKey) {
  if (!schedule) return {}
  if (DAYS.some(d => d in schedule)) return { [currentWeekKey]: schedule }
  return schedule
}

export default function Schedule({userId, displayName}) {
    const [schedules, setSchedules] = useState({});
    const [mySchedule, setMySchedule] = useState({}); // all weeks, keyed by Monday date
    const [weekStart, setWeekStart] = useState(() => getMonday(new Date()))
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
                mapped[row.roommate]=normalise(row.schedule, toKey(getMonday(new Date())))
                if (row.roommate !== displayName) {
                    setPartnerLastUpdated(row.updated_at)
                    console.log('partner updated_at:', row.updated_at)
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
            [weekKey]:{
                ...prev[weekKey],
                [day]:{
                    ...prev[weekKey]?.[day],
                    [meal]: !prev[weekKey]?.[day]?.[meal]
                }
            }
        }))
    }

    const weekKey = toKey(weekStart)
    const myWeek = mySchedule[weekKey] || {}

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
    const partnerSchedule = schedules[partnerName]?.[weekKey]||{}
    const weekDates = getWeekDates(weekStart)
    const todayStr = new Date().toDateString()
    const thisWeekKey = toKey(getMonday(new Date()))
    const weekDiff = Math.round((weekStart - getMonday(new Date())) / (7 * 86400000))
    const weekLabel = `${weekDates[0].toLocaleDateString('en-MY', { day: 'numeric', month: 'short' })} – ${weekDates[6].toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })}`
    function shiftWeek(n) {
      const d = new Date(weekStart)
      d.setDate(d.getDate() + n * 7)
      setWeekStart(d)
    }
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

      {/* ── WEEK NAVIGATOR ── */}
      <div className="bg-white rounded-xl shadow p-4 mb-6 flex flex-wrap items-center justify-between gap-3">
        <button onClick={() => shiftWeek(-1)} className="px-3 py-1 rounded-lg bg-rose-100 text-rose-500 hover:bg-rose-200">◀</button>
        <div className="text-center">
          <p className="font-semibold text-gray-700">
            Week {getISOWeek(weekStart)} · {weekLabel}
          </p>
          <p className="text-xs text-gray-400">
            {weekDiff === 0 ? 'This week' : weekDiff > 0 ? `${weekDiff} week${weekDiff > 1 ? 's' : ''} ahead` : `${-weekDiff} week${weekDiff < -1 ? 's' : ''} ago`}
          </p>
        </div>
        <button onClick={() => shiftWeek(1)} className="px-3 py-1 rounded-lg bg-rose-100 text-rose-500 hover:bg-rose-200">▶</button>
        <div className="w-full flex items-center justify-center gap-3">
          <input
            type="date"
            value={toKey(weekStart)}
            onChange={(e) => e.target.value && setWeekStart(getMonday(new Date(e.target.value + 'T00:00:00')))}
            className="border border-rose-200 rounded-lg px-2 py-1 text-sm text-gray-600"
          />
          {weekKey !== thisWeekKey && (
            <button onClick={() => setWeekStart(getMonday(new Date()))} className="text-rose-400 hover:text-rose-500 text-sm font-medium">
              Back to this week
            </button>
          )}
        </div>
      </div>

      {/* ── MY SCHEDULE ── */}
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <h3 className="font-semibold text-gray-700 mb-4">👤 Your Availability</h3>

        <div className="flex flex-col gap-3">
            {DAYS.map((day, i) => {
            const date = weekDates[i]
            const isToday = date.toDateString() === todayStr
            // true if this day is today

            return (
                <div key={day} className={`flex items-center gap-4 p-2 rounded-lg ${isToday ? 'bg-rose-50 border border-rose-200' : ''}`}>
                {/* highlight today with a rose background and border */}
                <div className="w-36">
                    <p className={`font-medium text-sm ${isToday ? 'text-rose-500' : 'text-gray-600'}`}>
                    {day}
                    {isToday && <span className="ml-2 text-xs bg-rose-400 text-white px-2 py-0.5 rounded-full">Today</span>}
                    </p>
                    <p className="text-xs text-gray-400">
                    {date.toLocaleDateString('en-MY', { day: 'numeric', month: 'short' })}
                    {/* e.g. "6 Jul" */}
                    </p>
                </div>
                {MEALS.map(meal => (
                    <label key={meal} className="flex items-center gap-1 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={myWeek[day]?.[meal] || false}
                        onChange={() => toggleMeal(day, meal)}
                        className="accent-rose-400 w-4 h-4"
                    />
                    <span className="text-sm text-gray-500">{meal}</span>
                    </label>
                ))}
                </div>
            )
            })}
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
          {DAYS.map((day, i) => {
            const date = weekDates[i]
            const isToday = date.toDateString() === todayStr
            const myLunch = myWeek[day]?.Lunch
            const myDinner = myWeek[day]?.Dinner
            const partnerLunch = partnerSchedule[day]?.Lunch
            const partnerDinner = partnerSchedule[day]?.Dinner
            const sharedLunch = myLunch && partnerLunch
            const sharedDinner = myDinner && partnerDinner

            if (!sharedLunch && !sharedDinner) return null

            return (
                <div key={day} className={`flex items-center gap-3 p-2 rounded-lg ${isToday ? 'bg-rose-50' : ''}`}>
                <div className="w-36">
                    <p className={`font-medium text-sm ${isToday ? 'text-rose-500' : 'text-gray-600'}`}>{day}</p>
                    <p className="text-xs text-gray-400">{date.toLocaleDateString('en-MY', { day: 'numeric', month: 'short' })}</p>
                </div>
                <div className="flex gap-2">
                    {sharedLunch && <span className="bg-rose-100 text-rose-500 px-3 py-1 rounded-full text-sm">🌞 Lunch</span>}
                    {sharedDinner && <span className="bg-rose-100 text-rose-500 px-3 py-1 rounded-full text-sm">🌙 Dinner</span>}
                </div>
                </div>
            )
            })}

          {DAYS.every(day => !myWeek[day]?.Lunch && !myWeek[day]?.Dinner) && (
            <p className="text-gray-400 text-sm">No overlap yet — save your schedule first.</p>
          )}
        </div>
      </div>
    </div>
  )
}
