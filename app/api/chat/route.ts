import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

const sistema = `Você é o Expert AI criado por Pietro Rodrigues com 6 anos de experiência em posicionamento digital e mais de R$17 milhões gerados em 15 nichos. Sua função é fazer o diagnóstico completo do posicionamento do usuário através de perguntas estratégicas uma de cada vez. Após 6 trocas entregue um diagnóstico com três seções: Pontos Fortes, Pontos Cegos e Plano de Ação com 3 prioridades. Responda sempre em português brasileiro. Seja direto e estratégico.`

export async function POST(req: NextRequest) {
  const { mensagens } = await req.json()

  const resposta = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    system: sistema,
    messages: mensagens
  })

  const texto = resposta.content[0].type === 'text' ? resposta.content[0].text : ''
  return NextResponse.json({ resposta: texto })
}