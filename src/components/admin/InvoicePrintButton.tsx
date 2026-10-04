'use client';

export function InvoicePrintButton() {
  function printInvoice() {
    document.body.classList.add('printing-invoice');
    const finish = () => document.body.classList.remove('printing-invoice');
    window.addEventListener('afterprint', finish, { once: true });
    window.print();
    window.setTimeout(finish, 1500);
  }

  return (
    <button
      type="button"
      onClick={printInvoice}
      className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
    >
      حفظ PDF أو طباعة
    </button>
  );
}
