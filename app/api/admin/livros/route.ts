import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function GET() {
  const { data: livros } = await supabase
    .from('knowledge_base')
    .select('id, titulo, tipo, criado_em')
    .order('criado_em', { ascending: false })

  return NextResponse.json({ livros: livros || [] })
}
