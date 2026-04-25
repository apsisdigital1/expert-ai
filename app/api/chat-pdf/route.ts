import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

const sistema = `Você é o Expert AI criado por Pietro Rodrigues. O aluno enviou um documento com informações sobre seu posicionamento. Sua função é analisar o documento, identificar o que já está construído e fazer perguntas complementares para preencher o que estiver faltando.

Analise o documento considerando as seguintes camadas da metodologia de Pietro Rodrigues:

1. IDENTIDADE — história, crenças, provas, inegociáveis
2. IMAGEM — como quer ser percebido, sinais que emite, sensação alvo
3. AUTENTICIDADE — o que expõe, o que não expõe, o que nunca faz por alcance
4. COMUNICAÇÃO — tom, dicionário, regras de linguagem
5. AUDIÊNCIA — ICP, persona, palavras reais do cliente
6. COMUNIDADE — universo de marca, identidade da tribo, inimigo comum
7. NARRATIVA — verdade visceral, premissas, movimento
8. CONTEÚDO — tipos de conteúdo, máquina editorial, calendário
9. PRODUTOS — bestseller, esteira, jornada de ascensão

Após analisar entregue em formato claro:
- O que já está construído e está sólido
- O que está incompleto ou raso
- As perguntas complementares para preencher os gaps, uma de cada vez

Responda sempre em português brasileiro.`

export async function POST(req: NextRequest) {
  const { base64, ferramenta } = await req.json()

  const resposta = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2048,
    system: sistema,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'document',
            source: {
              type: 'base64',
              media_type: 'application/pdf',
              data: base64
            }
          },
          {
            type: 'text',
            text: 'Analise este documento e faça o diagnóstico do meu posicionamento identificando o que está sólido e o que precisa ser construído.'
          }
        ]
      }
    ]
  })

  const texto = resposta.content[0].type === 'text' ? resposta.content[0].text : ''
  return NextResponse.json({ resposta: texto })
}