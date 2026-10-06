// @ts-nocheck
import { calcStockStatus } from '../types/inventory';
import { validateRecord } from '../services/importExport';

describe('stock rules', () => {
  test('status thresholds', () => {
    expect(calcStockStatus(10, 5)).toBe('in_stock');
    expect(calcStockStatus(5, 5)).toBe('low_stock');
    expect(calcStockStatus(0, 5)).toBe('out_of_stock');
  });
  test('validation', () => {
    expect(validateRecord({ name: '', sku: 'a', category: 'c' })).toBe('name required');
    expect(validateRecord({ name: 'n', sku: 's', category: 'c', quantity: -1 })).toBe('invalid quantity');
    expect(validateRecord({ name: 'n', sku: 's', category: 'c', quantity: 2 })).toBeNull();
  });
});
