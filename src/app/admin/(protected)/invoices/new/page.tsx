import Link from 'next/link';
import { AdminForm } from '@/components/admin/AdminForm';
import { Card, Field, Grid, inputClass, PageHeader } from '@/components/admin/ui';
import { issueInvoice } from '@/server/invoice-actions';

export const metadata = { title: 'New invoice' };

export default function NewInvoicePage() {
  return (
    <>
      <PageHeader
        title="إصدار فاتورة"
        description="أدخل بيانات العميل والخدمة. تُحفظ بيانات الشركة تلقائيًا من إعدادات الموقع وقت الإصدار."
        action={<Link href="/admin/invoices" className="rounded-md border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700">رجوع للفواتير</Link>}
      />

      <AdminForm action={issueInvoice} submitLabel="إصدار الفاتورة ومعاينتها" className="space-y-5">
        <div dir="rtl" className="space-y-5">
          <Card title="بيانات العميل" description="ستظهر هذه المعلومات داخل الفاتورة PDF.">
            <Grid>
              <Field label="اسم العميل" htmlFor="clientName" required>
                <input id="clientName" name="clientName" required maxLength={160} className={inputClass} />
              </Field>
              <Field label="اسم الشركة" htmlFor="clientCompany">
                <input id="clientCompany" name="clientCompany" maxLength={160} className={inputClass} />
              </Field>
              <Field label="البريد الإلكتروني" htmlFor="clientEmail">
                <input id="clientEmail" name="clientEmail" type="email" maxLength={160} dir="ltr" className={inputClass} />
              </Field>
              <Field label="رقم الهاتف" htmlFor="clientPhone">
                <input id="clientPhone" name="clientPhone" maxLength={60} dir="ltr" className={inputClass} />
              </Field>
              <Field label="العنوان" htmlFor="clientAddress">
                <input id="clientAddress" name="clientAddress" maxLength={400} className={inputClass} />
              </Field>
              <Field label="الرقم الضريبي للعميل (اختياري)" htmlFor="clientTaxNumber">
                <input id="clientTaxNumber" name="clientTaxNumber" maxLength={100} dir="ltr" className={inputClass} />
              </Field>
            </Grid>
          </Card>

          <Card title="الخدمة والمبلغ" description="أدخل المبلغ قبل الضريبة، وحدد نسبة الضريبة عند انطباقها.">
            <Grid>
              <Field label="الخدمة المقدمة" htmlFor="serviceName" required>
                <input id="serviceName" name="serviceName" required maxLength={200} placeholder="مثال: دراسة جدوى مطعم" className={inputClass} />
              </Field>
              <Field label="المبلغ قبل الضريبة" htmlFor="subtotal" required>
                <input id="subtotal" name="subtotal" type="number" min="0.01" max="99999999.99" step="0.01" required dir="ltr" className={inputClass} />
              </Field>
              <Field label="نسبة الضريبة (%)" htmlFor="vatPercent" hint="اتركها 0 إذا لم تنطبق الضريبة على هذه الفاتورة.">
                <input id="vatPercent" name="vatPercent" type="number" min="0" max="100" step="0.01" defaultValue="0" dir="ltr" className={inputClass} />
              </Field>
              <Field label="العملة" htmlFor="currency">
                <select id="currency" name="currency" defaultValue="SAR" className={inputClass}>
                  <option value="SAR">ريال سعودي (SAR)</option>
                  <option value="USD">دولار أمريكي (USD)</option>
                </select>
              </Field>
              <Field label="تاريخ الاستحقاق" htmlFor="dueDate">
                <input id="dueDate" name="dueDate" type="date" dir="ltr" className={inputClass} />
              </Field>
              <Field label="تفاصيل الخدمة" htmlFor="serviceDescription" className="sm:col-span-2">
                <textarea id="serviceDescription" name="serviceDescription" rows={4} maxLength={2000} className={inputClass} />
              </Field>
            </Grid>
          </Card>

          <Card title="ملاحظات إضافية">
            <Field label="ملاحظات أو شروط الدفع" htmlFor="notes">
              <textarea id="notes" name="notes" rows={3} maxLength={2000} className={inputClass} />
            </Field>
          </Card>

          <p className="text-xs leading-6 text-slate-500">
            تُحفظ الفاتورة مع نسخة من بيانات الشركة الحالية. لإضافة الرقم الضريبي والسجل التجاري وبيانات التحويل، حدّثها أولًا من{' '}
            <Link href="/admin/settings" className="font-medium text-slate-800 underline">إعدادات الموقع ← تفاصيل الفواتير</Link>.
          </p>
        </div>
      </AdminForm>
    </>
  );
}
