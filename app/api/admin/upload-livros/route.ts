import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { config } from 'dotenv'

config({ path: '.env.local' })

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

const caminhoPDF = process.argv[2]
const titulo = process.argv[3]
const tipo = process.argv[4] || 'livro'

if (!caminhoPDF || !titulo) {
  console.log('Uso: node scripts/upload-livros <caminho-do-pdf> "<titulo>" "<tipo>"')
  process.exit(1)
}

console.log(`Processando: ${titulo}`)

const pdfBuffer = readFileSync(caminhoPDF)
const base64 = pdfBuffer.toString('base64')

const resposta = await client.messages.create({
  model: 'claude-haiku-4-5-20251001',
  max_tokens: 4096,
  messages: [{
    role: 'user',
    content: [
      { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: base64 } },
      { type: 'text', text: 'Extraia os conceitos, frameworks, ideias e insights mais importantes deste material em português brasileiro. Organize de forma estruturada cobrindo os principais ensinamentos, metodologias e aplicações práticas. Seja completo e profundo.' }
    ]
  }]
})

const conteudo = resposta.content[0].text
await supabase.from('knowledge_base').insert({ titulo, tipo, conteudo })

console.log(`✓ ${titulo} adicionado com sucesso ao Estrategista.`)