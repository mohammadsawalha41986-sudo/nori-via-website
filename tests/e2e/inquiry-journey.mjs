/** Real submissions against a disposable local database; never production. */
import 'dotenv/config';
import assert from 'node:assert/strict';
import { PrismaClient } from '@prisma/client';
import { chromium } from 'playwright';
const base = process.env.QA_BASE_URL || 'http://127.0.0.1:3000';
assert.ok(['localhost', '127.0.0.1'].includes(new URL(base).hostname));
assert.ok(['localhost', '127.0.0.1'].includes(new URL(process.env.DATABASE_URL).hostname));
const db = new PrismaClient();
const browser = await chromium.launch({ executablePath: process.env.QA_CHROMIUM, args: ['--no-sandbox'] });
try {
  for (const locale of ['en', 'ar']) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, extraHTTPHeaders: { 'x-forwarded-for': locale === 'en' ? '192.0.2.71' : '192.0.2.72' } });
    const page = await context.newPage();
    const email = `journey-${locale}-${Date.now()}@example.com`;
    await page.goto(`${base}/${locale}/start-a-project?need=delivery`);
    const form = page.locator('form').first();
    await page.waitForFunction(() => document.querySelector('input[value="delivery"]')?.checked);
    assert.equal(await form.locator('input[value="delivery"]').isChecked(), true);
    await form.locator('button[type="submit"]').click();
    await form.locator('button[type="submit"]').click();
    assert.equal(await form.locator('#description-error').count(), 1);
    await form.locator('#business').fill('Disposable QA restaurant');
    await form.locator('#city').fill('Riyadh');
    await form.locator('textarea').fill('Review delivery contribution and packaging cost for this QA request.');
    await form.locator('input[type="file"]').setInputFiles('resources/library/xlsx/noriva-restaurant-feasibility-study-template.xlsx');
    await form.locator('button[type="submit"]').click();
    await form.locator('#name').fill('QA Journey');
    await form.locator('#email').fill(email);
    await form.locator('#phone').fill('+966500000071');
    const [response] = await Promise.all([page.waitForResponse(r => r.url().endsWith('/api/inquiry') && r.request().method() === 'POST'), form.locator('button[type="submit"]').click()]);
    assert.equal(response.status(), 200, await response.text());
    await page.locator('[role="status"] h2').waitFor();
    const inquiry = await db.projectInquiry.findFirstOrThrow({ where: { email }, include: { attachments: true } });
    assert.equal(inquiry.locale, locale);
    assert.equal(inquiry.attachments.length, 1);
    assert.ok(inquiry.answers.some(a => a.key === 'city' && a.value === 'Riyadh'));
    console.log(`PASS ${locale} mobile three-step inquiry, validation, prefill, stored answers and spreadsheet attachment`);
    await page.goto(`${base}/${locale}/contact`);
    await page.locator('#c_name').fill('QA Contact');
    await page.locator('#c_email').fill(email);
    await page.locator('#c_message').fill('Disposable local QA contact form verification.');
    const [contact] = await Promise.all([page.waitForResponse(r => r.url().endsWith('/api/contact') && r.request().method() === 'POST'), page.locator('form button[type="submit"]').click()]);
    assert.equal(contact.status(), 200, await contact.text());
    await page.locator('#c_name').waitFor({ state: 'detached' });
    assert.equal(await page.locator('form [role="alert"]').count(), 0);
    await db.contactMessage.findFirstOrThrow({ where: { email } });
    console.log(`PASS ${locale} contact delivery, persistence and success state`);
    await context.close();
  }
} finally { await browser.close(); await db.$disconnect(); }
