import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const sistema = `Você é o Expert AI criado por Pietro Rodrigues. O aluno enviou um documento sobre narrativa. Analise considerando narrativa visceral, premissas, manifesto do movimento e arquitetura da mensagem. Identifique o que está sólido, o que está raso e o que falta. Faça perguntas complementares uma de cada vez e ao final entregue a narrativa completa. Responda sempre em português brasileiro.`

export async function POST(req: NextRequest) {
  const { base64 } = await req.json()
  const resposta = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2048,
    system: sistema,
    messages: [{
      role: 'user',
      content: [
        { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: base64 } },
        { type: 'text', text: 'Analise este documento e faça o diagnóstico da minha narrativa.' }
      ]
    }]
  })
  const texto = resposta.content[0].type === 'text' ? resposta.content[0].text : ''
  return NextResponse.json({ resposta: texto })
}