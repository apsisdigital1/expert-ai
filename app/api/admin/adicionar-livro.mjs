import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { PDFDocument } from 'pdf-lib'

const __dirname = dirname(fileURLToPath(import.meta.url))
const envPath = resolve(__dirname, '../.env.local')
const envContent = readFileSync(envPath, 'utf8')

function getEnv(key) {
  const match = envContent.match(new RegExp(`${key}=(.+)`))
  return match ? match[1].trim() : null
}

const client = new Anthropic({ apiKey: getEnv('ANTHROPIC_API_KEY') })
const supabase = createClient(getEnv('NEXT_PUBLIC_SUPABASE_URL'), getEnv('SUPABASE_SERVICE_KEY'))

const caminhoPDF = process.argv[2]
const titulo = process.argv[3]
const tipo = process.argv[4] || 'livro'

if (!caminhoPDF || !titulo) {
  console.log('Uso: node scripts/adicionar-livro.mjs <caminho-pdf> "<titulo>" "<tipo>"')
  process.exit(1)
}

console.log('Processando:', titulo)
const pdfBytes = readFileSync(caminhoPDF)
const pdfDoc = await PDFDocument.load(pdfBytes)
const totalPages = pdfDoc.getPageCount()
console.log('Total de páginas:', totalPages)

const chunkSize = 80
const chunks = Math.ceil(totalPages / chunkSize)
let conteudoTotal = ''

for (let i = 0; i < chunks; i++) {
  const start = i * chunkSize
  const end = Math.min(start + chunkSize, totalPages)
  console.log(`Processando páginas ${start + 1} a ${end}...`)

  const novoPDF = await PDFDocument.create()
  const indices = Array.from({ length: end - start }, (_, j) => start + j)
  const paginas = await novoPDF.copyPages(pdfDoc, indices)
  paginas.forEach(p => novoPDF.addPage(p))
  const chunkBytes = await novoPDF.save()
  const base64 = Buffer.from(chunkBytes).toString('base64')

  const resposta = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2048,
    messages: [{ role: 'user', content: [
      { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: base64 } },
      { type: 'text', text: `Extraia os conceitos e insights mais importantes desta parte do livro "${titulo}" em português brasileiro.` }
    ]}]
  })

  conteudoTotal += resposta.content[0].text + '\n\n'
}

console.log('Salvando no banco...')
const { error } = await supabase.from('knowledge_base').insert({ titulo, tipo, conteudo: conteudoTotal })
if (error) console.log('Erro:', error.message)
else console.log('✓', titulo, 'adicionado com sucesso.')