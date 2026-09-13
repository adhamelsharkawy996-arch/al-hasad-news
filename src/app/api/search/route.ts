import { NextRequest, NextResponse } from 'next/server';
import { searchArticles } from '@/lib/data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const results = searchArticles(query);
  return NextResponse.json(results);
}
