import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { ideaSchema } from '@/lib/validators';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  let query = supabase.from('ideas_with_delta').select('*').order('score', { ascending: false });
  if (category && ['forfeit', 'reward', 'rule'].includes(category)) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ideas: data });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = ideaSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const { data, error } = await supabase.from('ideas').insert(parsed.data).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ idea: data }, { status: 201 });
} 