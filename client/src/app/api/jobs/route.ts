import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://remotive.com/api/remote-jobs');

    if (!res.ok) {
      return NextResponse.json({ error: 'Upstream error', status: res.status }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
