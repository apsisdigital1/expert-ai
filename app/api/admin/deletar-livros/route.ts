import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function POST(req: NextRequest) {
  const { id } = await req.json()
  await supabase.from('knowledge_base').delete().eq('id', id)
  return NextResponse.json({ sucesso: true })
}