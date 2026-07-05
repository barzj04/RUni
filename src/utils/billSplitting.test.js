import {describe, it, expect} from 'vitest';
import {calculateBill} from './billSplitting';

describe('calculateBill', () => {
    it('should calculate the total amount spent by each person', () => {
        const groceries = [
            {price: 10, paid_by: 'Arleen' },
            {price: 20, paid_by: 'Rachel' },
        ]
        const result = calculateBill(groceries, 'Arleen');
        expect(result.total).toBe(30);

    })

    it('should calculate the amount owed by each person', () => {
        const groceries = [
            {price: 10, paid_by: 'Arleen' },
            {price: 20, paid_by: 'Rachel' },
        ]
        const result = calculateBill(groceries, 'Arleen');
        expect(result.eachOwes).toBe(15);
    })
    it('calculates balance correctly when partner owes me', () => {
        const groceries = [
            {price: 20, paid_by: 'Arleen' },
            {price: 10, paid_by: 'Rachel' },
        ]
        const result = calculateBill(groceries, 'Arleen');
        expect(result.balance).toBe(5);
    })
    it('calculates balance correctly when I owe partner', () => {
        const groceries = [
            {price: 10, paid_by: 'Arleen' },
            {price: 20, paid_by: 'Rachel' },
        ]
        const result = calculateBill(groceries, 'Arleen');
        expect(result.balance).toBe(-5);
    })
    it('returns 0 balance when both have paid equally', () => {
        const groceries = [
            {price: 15, paid_by: 'Arleen' },
            {price: 15, paid_by: 'Rachel' },
        ]
        const result = calculateBill(groceries, 'Arleen');
        expect(result.balance).toBe(0);
    })

    it('handles empty groceries array', () => {
        const result = calculateBill([], 'Arleen');
        expect(result.total).toBe(0);
        expect(result.eachOwes).toBe(0);
        expect(result.balance).toBe(0);
    })

    it('handles missing price gracefully', () => {
        const groceries = [
            {price: null, paid_by: 'Arleen' },
            {price: 10, paid_by: 'Rachel' },
         ]
         const result = calculateBill(groceries, 'Arleen');
         expect(result.total).toBe(10);
    })
})