import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/db';
import nodemailer from 'nodemailer';

const DEFAULT_CONTACT_EMAIL = 'utkrisht.interiors@gmail.com';

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildEmail({
  name,
  email,
  phone,
  message,
  category,
  source,
  inquiryId,
}: {
  name: string;
  email: string;
  phone?: string;
  message: string;
  category?: string;
  source: string;
  inquiryId?: string;
}) {
  const text = [
    `New lead received via ${source}`,
    '',
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone || '-'}`,
    `Category: ${category || '-'}`,
    `Source: ${source}`,
    inquiryId ? `Lead ID: ${inquiryId}` : null,
    '',
    'Message:',
    message,
  ]
    .filter((line) => line !== null)
    .join('\n');

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:10px 16px;color:#6b7280;font-size:13px;font-weight:600;white-space:nowrap;border-bottom:1px solid #f3f4f6;">${label}</td>
      <td style="padding:10px 16px;color:#111827;font-size:14px;border-bottom:1px solid #f3f4f6;">${value}</td>
    </tr>`;

  const html = `
  <div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;background:#f3f4f6;padding:24px;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
      <div style="background:#111827;color:#ffffff;padding:20px 24px;">
        <p style="margin:0;font-size:12px;letter-spacing:.05em;text-transform:uppercase;color:#fbbf24;font-weight:700;">New Lead</p>
        <h1 style="margin:6px 0 0;font-size:20px;">${escapeHtml(name)}</h1>
        <p style="margin:6px 0 0;font-size:13px;color:#d1d5db;">via ${escapeHtml(source)}</p>
      </div>
      <table style="width:100%;border-collapse:collapse;">
        ${row('Category', escapeHtml(category || 'General Inquiry'))}
        ${row('Email', `<a href="mailto:${escapeHtml(email)}" style="color:#111827;text-decoration:none;">${escapeHtml(email)}</a>`)}
        ${row('Phone', phone ? `<a href="tel:${escapeHtml(phone)}" style="color:#111827;text-decoration:none;">${escapeHtml(phone)}</a>` : '-')}
        ${inquiryId ? row('Lead ID', escapeHtml(inquiryId)) : ''}
      </table>
      <div style="padding:16px 24px;">
        <p style="margin:0 0 6px;font-size:13px;font-weight:600;color:#6b7280;">Message</p>
        <p style="margin:0;font-size:14px;color:#111827;white-space:pre-wrap;line-height:1.5;">${escapeHtml(message)}</p>
      </div>
      <div style="padding:16px 24px;background:#f9fafb;border-top:1px solid #e5e7eb;">
        <a href="mailto:${escapeHtml(email)}" style="display:inline-block;background:#111827;color:#ffffff;text-decoration:none;font-size:13px;font-weight:600;padding:10px 18px;border-radius:999px;">
          Reply to ${escapeHtml(name.split(' ')[0])}
        </a>
        ${inquiryId ? '<p style="margin:12px 0 0;font-size:12px;color:#9ca3af;">Track and update this lead\'s status in the admin Leads tab.</p>' : ''}
      </div>
    </div>
  </div>`;

  return { text, html };
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, email, phone, message, service, source } = data;
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    const leadSource = source || 'Website Contact Form';

    let inquiry = null;
    try {
      inquiry = await db.contactInquiry.create({
        data: {
          name,
          email,
          phone: phone || '',
          message,
          service: service || null,
        },
      });
    } catch (dbErr) {
      console.error('[CONTACT_DB] Failed to save inquiry, continuing to send email anyway', dbErr);
    }

    // Send email via SMTP if env is configured, otherwise use Ethereal in dev
    const {
      SMTP_HOST,
      SMTP_PORT,
      SMTP_USER,
      SMTP_PASS,
      CONTACT_EMAIL,
      CONTACT_FROM,
      NODE_ENV,
    } = process.env as Record<string, string | undefined>;

    let previewUrl: string | undefined;
    const recipientEmail = CONTACT_EMAIL || DEFAULT_CONTACT_EMAIL;
    const subject = service
      ? `New Lead: ${service} — ${name}`
      : `New Contact Inquiry from ${name}`;
    const { text, html } = buildEmail({
      name,
      email,
      phone,
      message,
      category: service,
      source: leadSource,
      inquiryId: inquiry?.id,
    });

    try {
      if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
        const transporter = nodemailer.createTransport({
          host: SMTP_HOST,
          port: Number(SMTP_PORT),
          secure: Number(SMTP_PORT) === 465,
          auth: { user: SMTP_USER, pass: SMTP_PASS },
          connectionTimeout: 10000,
          socketTimeout: 10000,
        });

        await transporter.sendMail({
          from: CONTACT_FROM || `Utkrisht Interiors <${SMTP_USER}>`,
          to: recipientEmail,
          replyTo: email,
          subject,
          text,
          html,
        });
      } else if (NODE_ENV !== 'production') {
        const testAccount = await nodemailer.createTestAccount();
        const transporter = nodemailer.createTransport({
          host: testAccount.smtp.host,
          port: testAccount.smtp.port,
          secure: testAccount.smtp.secure,
          auth: { user: testAccount.user, pass: testAccount.pass },
          connectionTimeout: 10000,
          socketTimeout: 10000,
        });

        const info = await transporter.sendMail({
          from: `Utkrisht Interiors <${DEFAULT_CONTACT_EMAIL}>`,
          to: recipientEmail,
          replyTo: email,
          subject,
          text,
          html,
        });

        previewUrl = nodemailer.getTestMessageUrl(info) || undefined;
        console.log('[ETHEREAL_PREVIEW_URL]', previewUrl);
      } else {
        console.warn('[CONTACT_MAIL] SMTP not configured. Skipping send.');
      }
    } catch (mailErr) {
      console.error('[CONTACT_MAIL] Failed to send email', mailErr);
    }

    return NextResponse.json({ success: true, inquiry, ...(previewUrl ? { previewUrl } : {}) });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 });
  }
}
