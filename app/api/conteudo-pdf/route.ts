import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const sistema = `Você é o Expert AI criado por Pietro Rodrigues. O aluno enviou um documento sobre conteúdo. Analise o calendário ou estratégia de conteúdo existente, identifique o que está funcionando e o que está faltando e gere um calendário editorial otimizado de 30 dias baseado na metodologia de Pietro Rodrigues com os cinco tipos de conteúdo do expert. Responda sempre em português brasileiro.`

export async function POST(req: NextRequest) {
  const { base64 } = await req.json()
  const resposta = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 4096,
    system: sistema,
    messages: [{
      role: 'user',
      content: [
        { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: base64 } },
        { type: 'text', text: 'Analise meu conteúdo atual e gere um calendário editorial otimizado de 30 dias.' }
      ]
    }]
  })
  const texto = resposta.content[0].type === 'text' ? resposta.content[0].text : ''
  return NextResponse.json({ resposta: texto })
}