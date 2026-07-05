export function calculateBill(groceries,displayName) {
    const total = groceries.reduce((sum, g) => sum + (g.price || 0), 0);
    const eachOwes = total / 2;
    const paidByMe = groceries.filter(g => g.paid_by === displayName).reduce((sum, g) => sum + (g.price || 0), 0);
    const balance = paidByMe - eachOwes;
    return { total, eachOwes, paidByMe, balance };
}