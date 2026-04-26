import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { ferramenta, conteudo, userId } = await req.json()

    if (!userId) {
      return NextResponse.json({ erro: 'Usuário não identificado' }, { status: 401 })
    }

    const { data: existing } = await supabase
      .from('outputs')
      .select('id')
      .eq('user_id', userId)
      .eq('ferramenta', ferramenta)
      .single()

    if (existing) {
      await supabase
        .from('outputs')
        .update({ conteudo, atualizado_em: new Date().toISOString() })
        .eq('id', existing.id)
    } else {
      await supabase
        .from('outputs')
        .insert({ user_id: userId, ferramenta, conteudo })
    }

    return NextResponse.json({ sucesso: true })
  } catch (error) {
    return NextResponse.json({ erro: 'Erro ao salvar' }, { status: 500 })
  }
}