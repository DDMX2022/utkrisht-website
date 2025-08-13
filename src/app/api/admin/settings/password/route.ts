import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { email, currentPassword, newPassword } = await req.json();
    if (!email || !currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    const user = await db.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    const ok = await bcrypt.compare(currentPassword, user.hashedPassword);
    if (!ok) return NextResponse.json({ error: 'Invalid current password' }, { status: 401 });
    const hashed = await bcrypt.hash(newPassword, 10);
    await db.user.update({ where: { id: user.id }, data: { hashedPassword: hashed } });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
