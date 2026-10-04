import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { InvoicePrintButton } from '@/components/admin/InvoicePrintButton';
import { LinkButton, PageHeader } from '@/components/admin/ui';

export const dynamic = 'force-dynamic';

function money(amount: number, currency: string) {
  return new Intl.NumberFormat('ar-SA', { style: 'currency', currency }).format(amount);
}

function date(value: Date | null) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('ar-SA', { dateStyle: 'long', timeZone: 'Asia/Riyadh' }).format(value);
}

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const invoice = await prisma.invoice.findUnique({ where: { id } });
  if (!invoice) notFound();

  const subtotal = Number(invoice.subtotal);
  const vatAmount = Number(invoice.vatAmount);
  const totalAmount = Number(invoice.totalAmount);

  return (
    <div className="invoice-admin-page" dir="rtl">
      <div className="invoice-toolbar mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <PageHeader title={`فاتورة ${invoice.invoiceNumber}`} description="راجع البيانات، ثم اختر حفظ PDF أو الطباعة." />
        </div>
        <div className="flex shrink-0 gap-2">
          <LinkButton href="/admin/invoices" variant="secondary">كل الفواتير</LinkButton>
          <InvoicePrintButton />
        </div>
      </div>

      <article className="invoice-document mx-auto max-w-[850px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="h-2 bg-[#f5106e]" />
        <div className="p-8 sm:p-12">
          <header className="flex flex-wrap items-start justify-between gap-6 border-b border-slate-200 pb-7">
            <div className="max-w-[60%]">
              {invoice.companyLogoUrl ? (
                // The saved logo may be a local media URL or an external brand asset.
                // eslint-disable-next-line @next/next/no-img-element
                <img src={invoice.companyLogoUrl} alt={invoice.companyName} className="mb-4 max-h-16 max-w-56 object-contain object-right" />
              ) : (
                <div className="mb-4 text-xl font-bold tracking-wide text-[#111c3a]">NORIVA <span className="text-[#f5106e]">GLOBAL</span></div>
              )}
              <h2 className="text-lg font-semibold text-slate-900">{invoice.companyName}</h2>
              <div className="mt-2 space-y-1 text-sm leading-6 text-slate-500">
                {invoice.companyAddress && <p>{invoice.companyAddress}</p>}
                {invoice.companyPhone && <p dir="ltr" className="text-right">{invoice.companyPhone}</p>}
                {invoice.companyEmail && <p dir="ltr" className="text-right">{invoice.companyEmail}</p>}
                {invoice.companyCommercialRegNumber && <p>السجل التجاري: <bdi dir="ltr">{invoice.companyCommercialRegNumber}</bdi></p>}
                {invoice.companyTaxNumber && <p>الرقم الضريبي: <bdi dir="ltr">{invoice.companyTaxNumber}</bdi></p>}
              </div>
            </div>
            <div className="min-w-48 text-left" dir="ltr">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f5106e]">INVOICE</p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#111c3a]">فاتورة</h1>
              <p className="mt-3 text-sm font-semibold text-slate-800">{invoice.invoiceNumber}</p>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between gap-5"><dt className="text-slate-500">تاريخ الإصدار</dt><dd className="font-medium text-slate-800">{date(invoice.issueDate)}</dd></div>
                {invoice.dueDate && <div className="flex justify-between gap-5"><dt className="text-slate-500">تاريخ الاستحقاق</dt><dd className="font-medium text-slate-800">{date(invoice.dueDate)}</dd></div>}
              </dl>
            </div>
          </header>

          <section className="grid gap-7 py-7 sm:grid-cols-2">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">فاتورة إلى</h2>
              <p className="mt-2 text-base font-semibold text-slate-900">{invoice.clientName}</p>
              {invoice.clientCompany && <p className="mt-1 text-sm text-slate-600">{invoice.clientCompany}</p>}
              <div className="mt-2 space-y-1 text-sm leading-6 text-slate-500">
                {invoice.clientAddress && <p>{invoice.clientAddress}</p>}
                {invoice.clientPhone && <p dir="ltr" className="text-right">{invoice.clientPhone}</p>}
                {invoice.clientEmail && <p dir="ltr" className="text-right">{invoice.clientEmail}</p>}
                {invoice.clientTaxNumber && <p>الرقم الضريبي: <bdi dir="ltr">{invoice.clientTaxNumber}</bdi></p>}
              </div>
            </div>
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">المبلغ المستحق</p>
              <p className="mt-2 text-2xl font-bold tracking-tight text-[#111c3a]" dir="ltr">{money(totalAmount, invoice.currency)}</p>
              <p className="mt-1 text-xs text-slate-500">حالة الفاتورة: {invoice.status === 'PAID' ? 'مدفوعة' : 'صادرة'}</p>
            </div>
          </section>

          <section>
            <table className="w-full border-collapse text-right" dir="rtl">
              <thead>
                <tr className="border-y border-slate-200 bg-slate-50 text-xs text-slate-500">
                  <th className="px-4 py-3 font-semibold">الخدمة المقدمة</th>
                  <th className="w-40 px-4 py-3 text-left font-semibold">المبلغ</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100 align-top">
                  <td className="px-4 py-5">
                    <p className="font-semibold text-slate-900">{invoice.serviceName}</p>
                    {invoice.serviceDescription && <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">{invoice.serviceDescription}</p>}
                  </td>
                  <td className="px-4 py-5 text-left font-medium text-slate-800" dir="ltr">{money(subtotal, invoice.currency)}</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className="ml-auto mt-6 max-w-sm space-y-3 text-sm">
            <div className="flex justify-between gap-5 text-slate-600"><span>المجموع قبل الضريبة</span><span dir="ltr">{money(subtotal, invoice.currency)}</span></div>
            <div className="flex justify-between gap-5 text-slate-600"><span>ضريبة القيمة المضافة ({Number(invoice.vatPercent)}%)</span><span dir="ltr">{money(vatAmount, invoice.currency)}</span></div>
            <div className="flex justify-between gap-5 border-t border-slate-300 pt-3 text-base font-bold text-[#111c3a]"><span>الإجمالي المستحق</span><span dir="ltr">{money(totalAmount, invoice.currency)}</span></div>
          </section>

          {(invoice.paymentDetails || invoice.notes) && (
            <section className="mt-10 grid gap-6 border-t border-slate-200 pt-6 sm:grid-cols-2">
              {invoice.paymentDetails && <div><h2 className="text-xs font-semibold text-slate-500">بيانات الدفع</h2><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{invoice.paymentDetails}</p></div>}
              {invoice.notes && <div><h2 className="text-xs font-semibold text-slate-500">ملاحظات</h2><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{invoice.notes}</p></div>}
            </section>
          )}

          <footer className="mt-12 border-t border-slate-200 pt-5 text-center text-xs text-slate-400">
            شكرًا لثقتكم بـ NORIVA GLOBAL
          </footer>
        </div>
      </article>
    </div>
  );
}
