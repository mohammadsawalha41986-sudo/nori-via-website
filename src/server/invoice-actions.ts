'use server';

import { randomUUID } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireUser } from '@/lib/auth';
import { calculateInvoiceAmounts, invoiceInputSchema } from '@/lib/invoice';
import { prisma } from '@/lib/db';
import { toFieldErrors, type ActionState } from './helpers';

export async function issueInvoice(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  const parsed = invoiceInputSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: 'Please check the invoice details.', fieldErrors: toFieldErrors(parsed.error) };
  }

  const [settings, totals] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 'singleton' } }),
    Promise.resolve(calculateInvoiceAmounts(parsed.data.subtotal, parsed.data.vatPercent)),
  ]);
  const now = new Date();
  const invoiceNumber = `NVR-${now.getUTCFullYear()}-${randomUUID().slice(0, 8).toUpperCase()}`;
  const invoice = await prisma.invoice.create({
    data: {
      invoiceNumber,
      companyName: settings?.companyNameAr.trim() || settings?.companyNameEn.trim() || 'NORIVA GLOBAL',
      companyEmail: settings?.contactEmail || settings?.inquiryEmail || '',
      companyPhone: settings?.phone || '',
      companyAddress: settings?.addressAr || settings?.addressEn || '',
      companyTaxNumber: settings?.invoiceTaxNumber || '',
      companyCommercialRegNumber: settings?.invoiceCommercialRegNumber || '',
      companyLogoUrl: settings?.logoUrl || null,
      paymentDetails: settings?.invoicePaymentDetails || '',
      clientName: parsed.data.clientName,
      clientCompany: parsed.data.clientCompany,
      clientEmail: parsed.data.clientEmail,
      clientPhone: parsed.data.clientPhone,
      clientAddress: parsed.data.clientAddress,
      clientTaxNumber: parsed.data.clientTaxNumber,
      serviceName: parsed.data.serviceName,
      serviceDescription: parsed.data.serviceDescription,
      currency: parsed.data.currency,
      subtotal: totals.subtotal,
      vatPercent: parsed.data.vatPercent.toFixed(2),
      vatAmount: totals.vatAmount,
      totalAmount: totals.totalAmount,
      issueDate: now,
      dueDate: parsed.data.dueDate ? new Date(`${parsed.data.dueDate}T12:00:00.000Z`) : null,
      notes: parsed.data.notes,
      createdById: user.id,
    },
    select: { id: true },
  });

  revalidatePath('/admin/invoices');
  redirect(`/admin/invoices/${invoice.id}`);
}
