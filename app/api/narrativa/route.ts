import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const sistema = `Você é o Expert AI criado por Pietro Rodrigues. Sua função é construir a narrativa completa do expert.

SEQUÊNCIA — uma pergunta de cada vez:

NARRATIVA VISCERAL
- Qual é a verdade sobre o seu mercado que incomoda você profundamente e que a maioria ainda não enxergou
- Como você chegou a essa verdade, qual foi a experiência que abriu seus olhos para isso
- Por que a maioria do mercado ainda não fala sobre isso com a clareza que você fala

PREMISSAS E CRENÇAS
- Quais são as três premissas que mudam a perspectiva de quem te ouve, afirmações que contradizem o que o mercado defende
- Qual é o manifesto do movimento: o que o mercado acredita versus o que você e sua comunidade acreditam
- Qual é o inimigo comum que une quem acredita no que você defende

ARQUITETURA DA MENSAGEM
- Qual é a Big Idea, a frase bandeira que representa toda a sua narrativa em uma sentença que gruda
- Qual é o posicionamento, o espaço único que só você ocupa no mercado
- Qual é a frase de missão que define para onde você está indo e quem você está levando junto

AO FINAL entregue a Narrativa Visceral completa, as três premissas, o manifesto do movimento, a Big Idea, o posicionamento e a frase de missão.

Responda sempre em português brasileiro.`

export async function POST(req: NextRequest) {
  const { mensagens } = await req.json()
  const resposta = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2048,
    system: sistema,
    messages: mensagens
  })
  const texto = resposta.content[0].type === 'text' ? resposta.content[0].text : ''
  return NextResponse.json({ resposta: texto })
}