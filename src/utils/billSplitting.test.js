import { describe, it, expect } from 'vitest'
import { calculateBill } from './billSplitting'

describe('calculateBill', () => {

  it('splits shared item 50/50 when partner paid', () => {
    const groceries = [{ price: 20, paid_by: 'Rachel', for_who: 'both' }]
    const result = calculateBill(groceries, 'Arleen')
    expect(result.balance).toBe(-10)
  })

  it('splits shared item 50/50 when I paid', () => {
    const groceries = [{ price: 20, paid_by: 'Arleen', for_who: 'both' }]
    const result = calculateBill(groceries, 'Arleen')
    expect(result.balance).toBe(10)
  })

  it('charges full amount to me when item is mine and partner paid', () => {
    const groceries = [{ price: 20, paid_by: 'Rachel', for_who: 'Arleen' }]
    const result = calculateBill(groceries, 'Arleen')
    expect(result.balance).toBe(-20)
  })

  it('charges full amount to partner when item is theirs and I paid', () => {
    const groceries = [{ price: 20, paid_by: 'Arleen', for_who: 'Rachel' }]
    const result = calculateBill(groceries, 'Arleen')
    expect(result.balance).toBe(20)
  })

  it('no debt when I pay for my own item', () => {
    const groceries = [{ price: 20, paid_by: 'Arleen', for_who: 'Arleen' }]
    const result = calculateBill(groceries, 'Arleen')
    expect(result.balance).toBe(0)
  })

  it('no debt when partner pays for their own item', () => {
    const groceries = [{ price: 20, paid_by: 'Rachel', for_who: 'Rachel' }]
    const result = calculateBill(groceries, 'Arleen')
    expect(result.balance).toBe(0)
  })

  it('handles empty grocery list', () => {
    const result = calculateBill([], 'Arleen')
    expect(result.total).toBe(0)
    expect(result.balance).toBe(0)
  })

  it('handles missing for_who defaults to both', () => {
    const groceries = [{ price: 20, paid_by: 'Arleen', for_who: null }]
    const result = calculateBill(groceries, 'Arleen')
    expect(result.balance).toBe(10)
  })
})