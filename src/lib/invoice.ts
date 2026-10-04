import { z } from 'zod';

const optionalText = (max: number) => z.string().trim().max(max).default('');
const optionalEmail = z.preprocess(
  (value) => (typeof value === 'string' ? value.trim() : ''),
  z.union([z.email(), z.literal('')]).default(''),
);

export const invoiceInputSchema = z.object({
  clientName: z.string().trim().min(2, 'Enter the client name.').max(160),
  clientCompany: optionalText(160),
  clientEmail: optionalEmail,
  clientPhone: optionalText(60),
  clientAddress: optionalText(400),
  clientTaxNumber: optionalText(100),
  serviceName: z.string().trim().min(2, 'Enter the service name.').max(200),
  serviceDescription: optionalText(2000),
  subtotal: z.coerce.number().finite().min(0.01).max(99999999.99),
  vatPercent: z.coerce.number().finite().min(0).max(100).default(0),
  currency: z.enum(['SAR', 'USD']).default('SAR'),
  dueDate: z.string().trim().regex(/^$|^\d{4}-\d{2}-\d{2}$/, 'Enter a valid due date.').default(''),
  notes: optionalText(2000),
});

/** Calculates money in minor units to avoid binary floating-point drift. */
export function calculateInvoiceAmounts(subtotal: number, vatPercent: number) {
  const subtotalMinor = Math.round((subtotal + Number.EPSILON) * 100);
  const vatMinor = Math.round((subtotalMinor * vatPercent) / 100);
  const totalMinor = subtotalMinor + vatMinor;

  return {
    subtotal: (subtotalMinor / 100).toFixed(2),
    vatAmount: (vatMinor / 100).toFixed(2),
    totalAmount: (totalMinor / 100).toFixed(2),
  };
}
