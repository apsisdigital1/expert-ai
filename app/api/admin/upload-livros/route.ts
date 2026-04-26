import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const { titulo, tipo, base64 } = await req.json()
    const resposta = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: [
          { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: base64 } },
          { type: 'text', text: 'Extraia os 10 conceitos mais importantes em português brasileiro.' }
        ]
      }]
    })
    const conteudo = resposta.content[0].type === 'text' ? resposta.content[0].text : ''
    await supabase.from('knowledge_base').insert({ titulo, tipo, conteudo })
    return NextResponse.json({ sucesso: true })
  } catch (error) {
    return NextResponse.json({ sucesso: false }, { status: 500 })
  }
}