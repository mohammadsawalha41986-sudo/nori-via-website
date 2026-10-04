import { describe, expect, it } from 'vitest';
import { calculateInvoiceAmounts, invoiceInputSchema } from '@/lib/invoice';

describe('invoice calculations', () => {
  it('calculates Saudi VAT in halalas and returns a stable total', () => {
    expect(calculateInvoiceAmounts(100, 15)).toEqual({
      subtotal: '100.00',
      vatAmount: '15.00',
      totalAmount: '115.00',
    });
  });

  it('rounds fractional halalas once and supports a zero-tax invoice', () => {
    expect(calculateInvoiceAmounts(10.105, 0)).toEqual({
      subtotal: '10.11',
      vatAmount: '0.00',
      totalAmount: '10.11',
    });
  });

  it('requires client and service names and rejects invalid amounts', () => {
    expect(invoiceInputSchema.safeParse({
      clientName: 'A', serviceName: 'Consulting', subtotal: 200, vatPercent: 15,
    }).success).toBe(false);
    expect(invoiceInputSchema.safeParse({
      clientName: 'Client Name', serviceName: 'Consulting', subtotal: 0, vatPercent: 15,
    }).success).toBe(false);
  });
});
