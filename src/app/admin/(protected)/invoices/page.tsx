import Link from 'next/link';
import { prisma } from '@/lib/db';
import { Badge, Card, EmptyRow, LinkButton, PageHeader } from '@/components/admin/ui';

export const metadata = { title: 'Invoices' };
export const dynamic = 'force-dynamic';

function money(value: number, currency: string) {
  return new Intl.NumberFormat('ar-SA', { style: 'currency', currency }).format(value);
}

function date(value: Date) {
  return new Intl.DateTimeFormat('ar-SA', { dateStyle: 'medium', timeZone: 'Asia/Riyadh' }).format(value);
}

export default async function InvoicesPage() {
  const [invoices, count, total] = await Promise.all([
    prisma.invoice.findMany({ orderBy: { createdAt: 'desc' }, take: 100 }),
    prisma.invoice.count(),
    prisma.invoice.aggregate({ _sum: { totalAmount: true } }),
  ]);

  return (
    <>
      <PageHeader
        title="الفواتير"
        description="إصدار الفواتير وحفظ بياناتها، ثم معاينتها أو حفظها PDF بهوية NORIVA."
        action={<LinkButton href="/admin/invoices/new">إصدار فاتورة جديدة</LinkButton>}
      />

      <div className="mb-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white px-5 py-4">
          <span className="block text-2xl font-semibold text-slate-900">{count}</span>
          <span className="mt-1 block text-xs text-slate-500">عدد الفواتير الصادرة</span>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white px-5 py-4">
          <span className="block text-2xl font-semibold text-slate-900" dir="ltr">
            {money(Number(total._sum.totalAmount ?? 0), 'SAR')}
          </span>
          <span className="mt-1 block text-xs text-slate-500">إجمالي قيمة الفواتير بالريال</span>
        </div>
      </div>

      <Card title="سجل الفواتير" description="تظهر أحدث 100 فاتورة صادرة.">
        {invoices.length === 0 ? (
          <EmptyRow>لم تصدر أي فاتورة بعد.</EmptyRow>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-right text-sm" dir="rtl">
              <thead>
                <tr className="border-b border-slate-200 text-xs text-slate-500">
                  <th className="px-3 py-3 font-medium">رقم الفاتورة</th>
                  <th className="px-3 py-3 font-medium">العميل</th>
                  <th className="px-3 py-3 font-medium">الخدمة</th>
                  <th className="px-3 py-3 font-medium">تاريخ الإصدار</th>
                  <th className="px-3 py-3 font-medium">المبلغ المستحق</th>
                  <th className="px-3 py-3 font-medium">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-slate-50">
                    <td className="px-3 py-3 font-medium" dir="ltr">
                      <Link href={`/admin/invoices/${invoice.id}`} className="text-slate-900 underline decoration-slate-300 underline-offset-4">
                        {invoice.invoiceNumber}
                      </Link>
                    </td>
                    <td className="px-3 py-3">
                      <span className="block font-medium text-slate-800">{invoice.clientName}</span>
                      {invoice.clientCompany && <span className="text-xs text-slate-500">{invoice.clientCompany}</span>}
                    </td>
                    <td className="max-w-56 truncate px-3 py-3 text-slate-600">{invoice.serviceName}</td>
                    <td className="px-3 py-3 text-slate-600">{date(invoice.issueDate)}</td>
                    <td className="px-3 py-3 font-semibold text-slate-900" dir="ltr">
                      {money(Number(invoice.totalAmount), invoice.currency)}
                    </td>
                    <td className="px-3 py-3"><Badge tone={invoice.status === 'PAID' ? 'green' : 'brand'}>{invoice.status === 'PAID' ? 'مدفوعة' : 'صادرة'}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}
