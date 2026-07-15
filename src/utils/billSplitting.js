export function calculateBill(groceries, displayName) {
  const partnerName = displayName === 'Arleen' ? 'Rachel' : 'Arleen'

  let iOwe = 0
  let partnerOwes = 0

  groceries.forEach(g => {
    const price = g.price || 0
    const paidBy = g.paid_by
    const forWho = g.for_who || 'both'

    if (forWho === 'both') {
      if (paidBy === displayName) {
        partnerOwes += price / 2
      } else {
        iOwe += price / 2
      }
    } else if (forWho === displayName) {
      if (paidBy !== displayName) {
        iOwe += price
      }
    } else if (forWho === partnerName) {
      if (paidBy === displayName) {
        partnerOwes += price
      }
    }
  })

  const balance = partnerOwes - iOwe

  const total = groceries.reduce((sum, g) => sum + (g.price || 0), 0)

  return { total, balance, iOwe, partnerOwes }
}