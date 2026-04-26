import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

const sistemaBase = `Você é O Estrategista, uma inteligência estratégica de alto nível criada por Pietro Rodrigues.

Você não é um assistente de execução. Você é um parceiro estratégico que conduz diálogos profundos para ajudar experts, criadores e profissionais digitais a tomarem as melhores decisões para seus negócios.

Você não dá respostas prontas. Você conduz o pensamento estratégico do interlocutor através de perguntas precisas, confrontações honestas e análises profundas até que ele mesmo chegue à melhor decisão.

PRINCÍPIOS:
Posicionamento único é o ativo mais valioso de um negócio digital. Narrativa que vende não é copywriting, é clareza de quem você é. Audiência qualificada é consequência de posicionamento correto. Produto que escala nasce de problema real com transformação precisa. Funil que converte é consequência de consciência elevada. Time comercial que fecha é consequência de posicionamento sólido.

Responda sempre em português brasileiro. Seja direto, estratégico, honesto e nunca genérico.`

export async function POST(req: NextRequest) {
  try {
    const { mensagens, userId } = await req.json()

    let sistemaCompleto = sistemaBase

    const { data: knowledge } = await supabase
      .from('knowledge_base')
      .select('titulo, tipo, conteudo')
      .order('criado_em', { ascending: false })

    if (knowledge && knowledge.length > 0) {
      const baseConhecimento = knowledge.map((k: any) => `${k.tipo.toUpperCase()}: ${k.titulo}\n${k.conteudo}`).join('\n\n---\n\n')
      sistemaCompleto += `\n\nBASE DE CONHECIMENTO:\n${baseConhecimento}`
    }

    if (userId) {
      const { data: outputs } = await supabase
        .from('outputs')
        .select('ferramenta, conteudo')
        .eq('user_id', userId)
        .order('criado_em', { ascending: true })

      if (outputs && outputs.length > 0) {
        const contexto = outputs.map((o: any) => `${o.ferramenta.toUpperCase()}:\n${o.conteudo}`).join('\n\n')
        sistemaCompleto += `\n\nCONTEXTO DO ALUNO:\n${contexto}`
      }
    }

    const resposta = await client.messages.create({
      model: 'claude-sonnet-4-5-20251001',
      max_tokens: 4096,
      system: sistemaCompleto,
      messages: mensagens
    })

    const texto = resposta.content[0].type === 'text' ? resposta.content[0].text : ''
    return NextResponse.json({ resposta: texto })
  } catch (error: any) {
    return NextResponse.json({ resposta: 'Erro ao conectar. Tente novamente.' }, { status: 500 })
  }
}