import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/db';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, email, phone, message, service } = data;
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const inquiry = await db.contactInquiry.create({
      data: {
        name,
        email,
        phone: phone || '',
        message,
        service: service || null,
      },
    });

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

    if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS && CONTACT_EMAIL) {
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        secure: Number(SMTP_PORT) === 465,
        auth: { user: SMTP_USER, pass: SMTP_PASS },
      });

      const subject = `New Contact Inquiry from ${name}`;
      const text = `New inquiry received.\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || '-'}\nService: ${service || '-'}\n\nMessage:\n${message}`;

      await transporter.sendMail({
        from: CONTACT_FROM || SMTP_USER,
        to: CONTACT_EMAIL,
        replyTo: email,
        subject,
        text,
      });
    } else if (NODE_ENV !== 'production') {
      const testAccount = await nodemailer.createTestAccount();
      const transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: { user: testAccount.user, pass: testAccount.pass },
      });

      const info = await transporter.sendMail({
        from: 'Utkrisht Contact <no-reply@example.com>',
        to: 'demo@example.com',
        replyTo: email,
        subject: `New Contact Inquiry from ${name}`,
        text: `New inquiry received.\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || '-'}\nService: ${service || '-'}\n\nMessage:\n${message}`,
      });

      previewUrl = nodemailer.getTestMessageUrl(info) || undefined;
      console.log('[ETHEREAL_PREVIEW_URL]', previewUrl);
    } else {
      console.warn('[CONTACT_MAIL] SMTP not configured. Skipping send.');
    }

    return NextResponse.json({ success: true, inquiry, ...(previewUrl ? { previewUrl } : {}) });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 });
  }
}
