import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import sqlite from '@/lib/data';
import { setAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    const user = sqlite.prepare('SELECT * FROM admin_users WHERE username = ? AND is_active = 1').get(username) as any;
    
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    
    const token = await setAuthCookie({ id: user.id, username: user.username });
    return NextResponse.json({ success: true, user: { id: user.id, username: user.username } });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
