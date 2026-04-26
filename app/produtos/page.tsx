'use client'
import { useState, useRef, useEffect } from 'react'

type Mensagem = { role: 'user' | 'assistant'; content: string }
type Modo = 'escolha' | 'chat' | 'upload'
type Status = 'conversando' | 'analisando' | 'concluido'

export default function Produtos() {
  const [modo, setModo] = useState<Modo>('escolha')
  const [mensagens, setMensagens] = useState<Mensagem[]>([])
  const [input, setInput] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [arquivo, setArquivo] = useState<File | null>(null)
  const [processando, setProcessando] = useState(false)
  const [status, setStatus] = useState<Status>('conversando')
  const fimRef = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => { fimRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [mensagens])

  function iniciarChat() {
    setModo('chat')
    setMensagens([{ role: 'assistant', content: 'Vamos construir seu ecossistema de produtos.\n\nA maioria dos experts tem conhecimento para criar dez produtos mas vende um de forma confusa e sem clareza sobre para onde o cliente vai depois.\n\nAntes de qualquer coisa preciso entender o que você tem hoje. Me conta: quais produtos ou serviços você vende atualmente e qual deles gera mais receita?' }])
  }

  async function enviar() {
    if (!input.trim() || carregando) return
    const novaMensagem: Mensagem = { role: 'user', content: input }
    const novaLista = [...mensagens, novaMensagem]
    setMensagens(novaLista)
    setInput('')
    setCarregando(true)
    try {
      const res = await fetch('/api/produtos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mensagens: novaLista }) })
      const data = await res.json()
      setMensagens(prev => [...prev, { role: 'assistant', content: data.resposta }])
    } catch { setMensagens(prev => [...prev, { role: 'assistant', content: 'Erro ao conectar.' }]) }
    finally { setCarregando(false) }
  }

  async function concluirFerramenta() {
    setStatus('analisando')
    setCarregando(true)
    const mensagemAnalise: Mensagem = { role: 'user', content: 'Quero concluir essa etapa. Faz uma análise completa de tudo que foi entregue até agora sobre ecossistema de produtos, esteira e jornada de ascensão. Lista o que está completo e o que ainda está faltando.' }
    const novaLista = [...mensagens, mensagemAnalise]
    setMensagens(novaLista)
    try {
      const res = await fetch('/api/produtos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mensagens: novaLista }) })
      const data = await res.json()
      setMensagens(prev => [...prev, { role: 'assistant', content: data.resposta }])
    } catch { setMensagens(prev => [...prev, { role: 'assistant', content: 'Erro ao analisar.' }]) }
    finally { setCarregando(false) }
  }

  async function confirmarConclusao() {
    setStatus('concluido')
    const conteudo = mensagens.map(m => `${m.role === 'user' ? 'ALUNO' : 'IA'}: ${m.content}`).join('\n\n')
    await fetch('/api/salvar-output', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ferramenta: 'produtos', conteudo }) })
    setMensagens(prev => [...prev, { role: 'assistant', content: 'Ecossistema de Produtos concluído e salvo. Você completou todas as ferramentas.\n\nO Estrategista foi desbloqueado e já tem acesso a tudo que você construiu. Acesse agora em /estrategista.' }])
  }

  async function processarPDF() {
    if (!arquivo) return
    setProcessando(true)
    setModo('chat')
    const reader = new FileReader()
    reader.onload = async (e) => {
      const base64 = (e.target?.result as string).split(',')[1]
      setMensagens([{ role: 'assistant', content: 'Recebi seu documento. Vou analisar sua esteira atual e construir o ecossistema completo.' }])
      try {
        const res = await fetch('/api/produtos-pdf', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ base64 }) })
        const data = await res.json()
        setMensagens(prev => [...prev, { role: 'assistant', content: data.resposta }])
      } catch { setMensagens(prev => [...prev, { role: 'assistant', content: 'Erro ao processar.' }]) }
      finally { setProcessando(false) }
    }
    reader.readAsDataURL(arquivo)
  }

  const sidebar = (
    <div style={{ width: '240px', background: '#0B0E17', borderRight: '0.5px solid rgba(255,255,255,0.06)', padding: '24px 0', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '0 20px 24px', borderBottom: '0.5px solid rgba(255,255,255,0.06)', marginBottom: '20px' }}>
        <div style={{ fontSize: '11px', color: '#C9A84C', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '4px' }}>by Pietro Rodrigues</div>
        <div style={{ fontSize: '16px', fontWeight: '700', color: '#fff' }}>Expert AI</div>
      </div>
      <div style={{ padding: '0 12px', flex: 1 }}>
        <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0 8px', marginBottom: '8px' }}>Ferramentas</div>
        {['Entrevista de Diagnóstico', 'Posicionamento', 'Audiência e Comunidade', 'Narrativa Visceral', 'Máquina de Conteúdo', 'Ecossistema de Produtos'].map((nome, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 10px', borderRadius: '8px', marginBottom: '2px', background: i === 5 ? 'rgba(201,168,76,0.1)' : 'transparent' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0, background: i === 5 ? '#C9A84C' : 'rgba(255,255,255,0.1)' }} />
            <div style={{ fontSize: '12px', color: i === 5 ? '#C9A84C' : 'rgba(255,255,255,0.2)', lineHeight: '1.3' }}>{nome}</div>
          </div>
        ))}
      </div>
      <div style={{ padding: '16px 20px 0', borderTop: '0.5px solid rgba(255,255,255,0.06)', marginTop: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(31,111,235,0.15)', border: '0.5px solid rgba(31,111,235,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#1F6FEB', fontWeight: '500' }}>PR</div>
          <div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Pietro</div>
            <div style={{ fontSize: '10px', color: '#C9A84C', background: 'rgba(201,168,76,0.1)', padding: '1px 6px', borderRadius: '10px', display: 'inline-block', marginTop: '2px' }}>Aluno</div>
          </div>
        </div>
      </div>
    </div>
  )

  if (modo === 'escolha') return (
    <div style={{ minHeight: '100vh', background: '#07090F', display: 'flex', fontFamily: 'system-ui, sans-serif' }}>
      {sidebar}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <div style={{ maxWidth: '600px', width: '100%' }}>
          <div style={{ marginBottom: '40px' }}>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>Ferramenta 06</div>
            <div style={{ fontSize: '26px', fontWeight: '700', color: '#fff', marginBottom: '12px' }}>Ecossistema de <span style={{ color: '#C9A84C' }}>Produtos</span></div>
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.6' }}>Produto bestseller definido, esteira completa estruturada e jornada de ascensão do cliente mapeada do primeiro produto até o alto ticket.</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div onClick={iniciarChat} style={{ background: 'rgba(255,255,255,0.02)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '28px', cursor: 'pointer' }} onMouseEnter={e => (e.currentTarget.style.borderColor = '#C9A84C')} onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}>
              <div style={{ fontSize: '28px', marginBottom: '16px' }}>💬</div>
              <div style={{ fontSize: '15px', fontWeight: '600', color: '#fff', marginBottom: '8px' }}>Construir do zero</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', lineHeight: '1.5' }}>A IA constrói seu produto bestseller, define a esteira completa e mapeia a jornada de ascensão.</div>
              <div style={{ marginTop: '20px', fontSize: '12px', color: '#C9A84C' }}>Iniciar →</div>
            </div>
            <div onClick={() => setModo('upload')} style={{ background: 'rgba(255,255,255,0.02)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '28px', cursor: 'pointer' }} onMouseEnter={e => (e.currentTarget.style.borderColor = '#C9A84C')} onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}>
              <div style={{ fontSize: '28px', marginBottom: '16px' }}>📄</div>
              <div style={{ fontSize: '15px', fontWeight: '600', color: '#fff', marginBottom: '8px' }}>Já tenho material</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', lineHeight: '1.5' }}>Suba sua esteira atual e a IA analisa e otimiza o ecossistema completo.</div>
              <div style={{ marginTop: '20px', fontSize: '12px', color: '#C9A84C' }}>Enviar documento →</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  if (modo === 'upload') return (
    <div style={{ minHeight: '100vh', background: '#07090F', display: 'flex', fontFamily: 'system-ui, sans-serif' }}>
      {sidebar}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <div style={{ maxWidth: '500px', width: '100%' }}>
          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>Ferramenta 06</div>
            <div style={{ fontSize: '22px', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>Envie seu <span style={{ color: '#C9A84C' }}>documento</span></div>
          </div>
          <div onClick={() => fileRef.current?.click()} style={{ background: 'rgba(255,255,255,0.02)', border: arquivo ? '0.5px solid #C9A84C' : '0.5px dashed rgba(255,255,255,0.15)', borderRadius: '12px', padding: '40px', textAlign: 'center', cursor: 'pointer', marginBottom: '16px' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>📎</div>
            <div style={{ fontSize: '14px', color: arquivo ? '#C9A84C' : 'rgba(255,255,255,0.4)' }}>{arquivo ? arquivo.name : 'Clique para selecionar um PDF'}</div>
            <input ref={fileRef} type="file" accept=".pdf" style={{ display: 'none' }} onChange={e => setArquivo(e.target.files?.[0] || null)} />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setModo('escolha')} style={{ flex: 1, background: 'transparent', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px', fontSize: '13px', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>Voltar</button>
            <button onClick={processarPDF} disabled={!arquivo || processando} style={{ flex: 2, background: arquivo ? '#C9A84C' : 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '13px', fontWeight: '600', color: arquivo ? '#07090F' : 'rgba(255,255,255,0.2)', cursor: arquivo ? 'pointer' : 'not-allowed' }}>
              {processando ? 'Analisando...' : 'Analisar documento'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#07090F', display: 'flex', fontFamily: 'system-ui, sans-serif' }}>
      {sidebar}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', maxHeight: '100vh' }}>
        <div style={{ padding: '20px 28px', borderBottom: '0.5px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>Ferramenta 06</div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#fff' }}>Ecossistema de <span style={{ color: '#C9A84C' }}>Produtos</span></div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {status === 'conversando' && <button onClick={concluirFerramenta} style={{ background: 'rgba(201,168,76,0.1)', border: '0.5px solid rgba(201,168,76,0.3)', borderRadius: '8px', padding: '8px 14px', fontSize: '12px', color: '#C9A84C', cursor: 'pointer' }}>Concluir ferramenta</button>}
            {status === 'analisando' && <button onClick={confirmarConclusao} style={{ background: '#C9A84C', border: 'none', borderRadius: '8px', padding: '8px 14px', fontSize: '12px', fontWeight: '600', color: '#07090F', cursor: 'pointer' }}>Confirmar conclusão</button>}
            {status === 'concluido' && <div style={{ background: 'rgba(76,175,80,0.1)', border: '0.5px solid rgba(76,175,80,0.3)', borderRadius: '8px', padding: '8px 14px', fontSize: '12px', color: '#4CAF50' }}>✓ Concluído</div>}
            <button onClick={() => { setModo('escolha'); setMensagens([]); setStatus('conversando') }} style={{ background: 'transparent', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 14px', fontSize: '12px', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>Reiniciar</button>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {mensagens.map((m, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', flexDirection: m.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-start' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0, background: m.role === 'assistant' ? 'rgba(201,168,76,0.15)' : 'rgba(31,111,235,0.15)', border: m.role === 'assistant' ? '0.5px solid rgba(201,168,76,0.3)' : '0.5px solid rgba(31,111,235,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '500', color: m.role === 'assistant' ? '#C9A84C' : '#1F6FEB' }}>
                {m.role === 'assistant' ? 'AI' : 'EU'}
              </div>
              <div style={{ maxWidth: '75%', padding: '12px 16px', borderRadius: '10px', background: m.role === 'assistant' ? 'rgba(255,255,255,0.04)' : 'rgba(201,168,76,0.08)', border: m.role === 'assistant' ? '0.5px solid rgba(255,255,255,0.06)' : '0.5px solid rgba(201,168,76,0.2)', fontSize: '14px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
                {m.content}
              </div>
            </div>
          ))}
          {carregando && (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(201,168,76,0.15)', border: '0.5px solid rgba(201,168,76,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#C9A84C' }}>AI</div>
              <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.06)', fontSize: '14px', color: 'rgba(255,255,255,0.3)' }}>Analisando...</div>
            </div>
          )}
          <div ref={fimRef} />
        </div>
        <div style={{ padding: '16px 28px', borderTop: '0.5px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && enviar()} placeholder="Responda aqui..." disabled={status === 'concluido'} style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px 16px', fontSize: '14px', color: '#fff', outline: 'none', fontFamily: 'system-ui, sans-serif', opacity: status === 'concluido' ? 0.5 : 1 }} />
            <button onClick={enviar} disabled={carregando || status === 'concluido'} style={{ background: '#C9A84C', border: 'none', borderRadius: '8px', padding: '12px 20px', fontSize: '14px', fontWeight: '600', color: '#07090F', cursor: 'pointer', opacity: status === 'concluido' ? 0.5 : 1 }}>Enviar</button>
          </div>
        </div>
      </div>
    </div>
  )
}