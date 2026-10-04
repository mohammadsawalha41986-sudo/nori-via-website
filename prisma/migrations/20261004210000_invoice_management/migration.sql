ALTER TABLE "SiteSettings"
  ADD COLUMN "invoiceTaxNumber" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "invoiceCommercialRegNumber" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "invoicePaymentDetails" TEXT NOT NULL DEFAULT '';

CREATE TABLE "Invoice" (
  "id" TEXT NOT NULL,
  "invoiceNumber" TEXT NOT NULL,
  "companyName" TEXT NOT NULL,
  "companyEmail" TEXT NOT NULL DEFAULT '',
  "companyPhone" TEXT NOT NULL DEFAULT '',
  "companyAddress" TEXT NOT NULL DEFAULT '',
  "companyTaxNumber" TEXT NOT NULL DEFAULT '',
  "companyCommercialRegNumber" TEXT NOT NULL DEFAULT '',
  "companyLogoUrl" TEXT,
  "paymentDetails" TEXT NOT NULL DEFAULT '',
  "clientName" TEXT NOT NULL,
  "clientCompany" TEXT NOT NULL DEFAULT '',
  "clientEmail" TEXT NOT NULL DEFAULT '',
  "clientPhone" TEXT NOT NULL DEFAULT '',
  "clientAddress" TEXT NOT NULL DEFAULT '',
  "clientTaxNumber" TEXT NOT NULL DEFAULT '',
  "serviceName" TEXT NOT NULL,
  "serviceDescription" TEXT NOT NULL DEFAULT '',
  "currency" TEXT NOT NULL DEFAULT 'SAR',
  "subtotal" DECIMAL(12,2) NOT NULL,
  "vatPercent" DECIMAL(5,2) NOT NULL DEFAULT 0,
  "vatAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
  "totalAmount" DECIMAL(12,2) NOT NULL,
  "issueDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "dueDate" TIMESTAMP(3),
  "notes" TEXT NOT NULL DEFAULT '',
  "status" TEXT NOT NULL DEFAULT 'ISSUED',
  "createdById" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Invoice_invoiceNumber_key" ON "Invoice"("invoiceNumber");
CREATE INDEX "Invoice_createdAt_idx" ON "Invoice"("createdAt");
CREATE INDEX "Invoice_clientName_idx" ON "Invoice"("clientName");
