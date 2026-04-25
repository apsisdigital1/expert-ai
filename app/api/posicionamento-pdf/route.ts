import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const sistema = `Você é o Expert AI criado por Pietro Rodrigues. O aluno enviou um documento sobre seu posicionamento. Analise considerando as quatro camadas: Identidade, Imagem, Autenticidade e Comunicação.

Para cada camada identifique o que está sólido, o que está raso e o que está faltando completamente. Depois faça perguntas complementares uma de cada vez para preencher os gaps e ao final entregue o Canvas do Expert completo.

Responda sempre em português brasileiro.`

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
        { type: 'text', text: 'Analise este documento e faça o diagnóstico do meu posicionamento em identidade, imagem, autenticidade e comunicação.' }
      ]
    }]
  })
  const texto = resposta.content[0].type === 'text' ? resposta.content[0].text : ''
  return NextResponse.json({ resposta: texto })
}