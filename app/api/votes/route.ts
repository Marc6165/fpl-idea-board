import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { getOrSetVoterId } from '@/lib/cookies';

export async function POST(request: Request) {
  const { ideaId, vote } = await request.json();
  if (!ideaId || ![-1, 0, 1].includes(vote)) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const voterId = getOrSetVoterId();

  const { data: existing } = await supabase
    .from('votes')
    .select('*')
    .eq('idea_id', ideaId)
    .eq('voter_id', voterId)
    .single();

  if (!existing) {
    if (vote === 0) return NextResponse.json({ ok: true });
    const { error } = await supabase.from('votes').insert({ idea_id: ideaId, voter_id: voterId, vote });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  } else {
    if (vote === 0) {
      const { error } = await supabase.from('votes').delete().match({ idea_id: ideaId, voter_id: voterId });
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      const { error } = await supabase.from('votes').update({ vote }).match({ idea_id: ideaId, voter_id: voterId });
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
} 