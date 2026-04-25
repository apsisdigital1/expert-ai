import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const sistema = `Você é o Expert AI criado por Pietro Rodrigues. O aluno enviou um documento sobre seus produtos. Analise a esteira atual, identifique gaps na sequência de produtos, problemas de precificação ou pontes quebradas entre produtos. Entregue uma análise completa e construa o ecossistema otimizado com produto de entrada, bestseller, continuação e alto ticket com as pontes entre cada nível. Responda sempre em português brasileiro.`

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
        { type: 'text', text: 'Analise minha esteira de produtos atual e construa o ecossistema completo otimizado.' }
      ]
    }]
  })
  const texto = resposta.content[0].type === 'text' ? resposta.content[0].text : ''
  return NextResponse.json({ resposta: texto })
}