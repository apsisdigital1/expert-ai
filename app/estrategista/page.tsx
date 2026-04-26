'use client'
import { useState, useRef, useEffect } from 'react'

type Mensagem = { role: 'user' | 'assistant'; content: string }

export default function Estrategista() {
  const [mensagens, setMensagens] = useState<Mensagem[]>([{
    role: 'assistant',
    content: 'Você chegou ao Estrategista.\n\nEste não é um assistente de execução. É um parceiro estratégico construído com o conhecimento de Pietro Rodrigues e uma base profunda de estratégia de negócios, marketing e posicionamento.\n\nAqui você não recebe respostas prontas. Você é conduzido a encontrar as melhores decisões para o seu negócio através de um diálogo estratégico real.\n\nMe conta: qual é a decisão mais importante que você precisa tomar no seu negócio agora?'
  }])
  const [input, setInput] = useState('')
  const [carregando, setCarregando] = useState(false)
  const fimRef = useRef<HTMLDivElement>(null)

  useEffect(() => { fimRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [mensagens])

  async function enviar() {
    if (!input.trim() || carregando) return
    const novaMensagem: Mensagem = { role: 'user', content: input }
    const novaLista = [...mensagens, novaMensagem]
    setMensagens(novaLista)
    setInput('')
    setCarregando(true)
    try {
      const res = await fetch('/api/estrategista', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensagens: novaLista })
      })
      const data = await res.json()
      setMensagens(prev => [...prev, { role: 'assistant', content: data.resposta }])
    } catch {
      setMensagens(prev => [...prev, { role: 'assistant', content: 'Erro ao conectar. Tente novamente.' }])
    } finally {
      setCarregando(false)
    }
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
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 10px', borderRadius: '8px', marginBottom: '2px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0, background: 'rgba(255,255,255,0.1)' }} />
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)', lineHeight: '1.3' }}>{nome}</div>
          </div>
        ))}
        <div style={{ marginTop: '16px', borderTop: '0.5px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
          <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0 8px', marginBottom: '8px' }}>Exclusivo</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 10px', borderRadius: '8px', background: 'rgba(201,168,76,0.1)' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#C9A84C' }} />
            <div style={{ fontSize: '12px', color: '#C9A84C' }}>O Estrategista</div>
          </div>
        </div>
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

  return (
    <div style={{ minHeight: '100vh', background: '#07090F', display: 'flex', fontFamily: 'system-ui, sans-serif' }}>
      {sidebar}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', maxHeight: '100vh' }}>
        <div style={{ padding: '20px 28px', borderBottom: '0.5px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '10px', color: '#C9A84C', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>Desbloqueado</div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#fff' }}>O <span style={{ color: '#C9A84C' }}>Estrategista</span></div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>Parceiro estratégico alimentado com o conhecimento de Pietro Rodrigues</div>
          </div>
          <button onClick={() => setMensagens([{ role: 'assistant', content: 'Você chegou ao Estrategista.\n\nEste não é um assistente de execução. É um parceiro estratégico construído com o conhecimento de Pietro Rodrigues e uma base profunda de estratégia de negócios, marketing e posicionamento.\n\nAqui você não recebe respostas prontas. Você é conduzido a encontrar as melhores decisões para o seu negócio através de um diálogo estratégico real.\n\nMe conta: qual é a decisão mais importante que você precisa tomar no seu negócio agora?' }])} style={{ background: 'transparent', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 14px', fontSize: '12px', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>Nova conversa</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {mensagens.map((m, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', flexDirection: m.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-start' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0, background: m.role === 'assistant' ? 'rgba(201,168,76,0.15)' : 'rgba(31,111,235,0.15)', border: m.role === 'assistant' ? '0.5px solid rgba(201,168,76,0.3)' : '0.5px solid rgba(31,111,235,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '500', color: m.role === 'assistant' ? '#C9A84C' : '#1F6FEB' }}>
                {m.role === 'assistant' ? 'ES' : 'EU'}
              </div>
              <div style={{ maxWidth: '75%', padding: '12px 16px', borderRadius: '10px', background: m.role === 'assistant' ? 'rgba(255,255,255,0.04)' : 'rgba(201,168,76,0.08)', border: m.role === 'assistant' ? '0.5px solid rgba(255,255,255,0.06)' : '0.5px solid rgba(201,168,76,0.2)', fontSize: '14px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
                {m.content}
              </div>
            </div>
          ))}
          {carregando && (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(201,168,76,0.15)', border: '0.5px solid rgba(201,168,76,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#C9A84C' }}>ES</div>
              <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.06)', fontSize: '14px', color: 'rgba(255,255,255,0.3)' }}>Pensando...</div>
            </div>
          )}
          <div ref={fimRef} />
        </div>

        <div style={{ padding: '16px 28px', borderTop: '0.5px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && enviar()} placeholder="Traga sua decisão ou desafio estratégico..." style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px 16px', fontSize: '14px', color: '#fff', outline: 'none', fontFamily: 'system-ui, sans-serif' }} />
            <button onClick={enviar} disabled={carregando} style={{ background: '#C9A84C', border: 'none', borderRadius: '8px', padding: '12px 20px', fontSize: '14px', fontWeight: '600', color: '#07090F', cursor: 'pointer' }}>Enviar</button>
          </div>
        </div>
      </div>
    </div>
  )
}