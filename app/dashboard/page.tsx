'use client'
import { useState } from 'react'

const ferramentas = [
  {
    num: '01',
    nome: 'Entrevista de Diagnóstico',
    desc: 'A IA analisa quem você é, como é percebido e o que precisa construir antes de qualquer estratégia.',
    status: 'ativo',
    slug: 'diagnostico'
  },
  {
    num: '02',
    nome: 'Posicionamento',
    desc: 'Identidade, imagem, autenticidade e comunicação construídos juntos. Entrega o Canvas do Expert completo.',
    status: 'bloqueado',
    slug: 'posicionamento'
  },
  {
    num: '03',
    nome: 'Audiência e Comunidade',
    desc: 'ICP, Persona, universo de marca, identidade da tribo e Canvas da Comunidade completo.',
    status: 'bloqueado',
    slug: 'comunidade'
  },
  {
    num: '04',
    nome: 'Narrativa Visceral',
    desc: 'A verdade que só você tem coragem de nomear transformada em narrativa, premissas e arquitetura da mensagem.',
    status: 'bloqueado',
    slug: 'narrativa'
  },
  {
    num: '05',
    nome: 'Máquina de Conteúdo',
    desc: '30 dias de conteúdo estratégico gerado com base na sua narrativa, suas premissas e seu ICP.',
    status: 'bloqueado',
    slug: 'conteudo'
  },
  {
    num: '06',
    nome: 'Ecossistema de Produtos',
    desc: 'Produto bestseller definido, esteira completa e jornada de ascensão do cliente mapeada.',
    status: 'bloqueado',
    slug: 'produtos'
  }
]

export default function Dashboard() {
  const [ativa, setAtiva] = useState('diagnostico')

  return (
    <div style={{ minHeight: '100vh', background: '#07090F', display: 'flex', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ width: '240px', background: '#0B0E17', borderRight: '0.5px solid rgba(255,255,255,0.06)', padding: '24px 0', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '0 20px 24px', borderBottom: '0.5px solid rgba(255,255,255,0.06)', marginBottom: '20px' }}>
          <div style={{ fontSize: '11px', color: '#C9A84C', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '4px' }}>by Pietro Rodrigues</div>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#fff' }}>Expert AI</div>
        </div>

        <div style={{ padding: '0 12px', flex: 1, overflowY: 'auto' }}>
          <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0 8px', marginBottom: '8px' }}>Ferramentas</div>
          {ferramentas.map(f => (
            <div key={f.slug} onClick={() => f.status === 'ativo' && setAtiva(f.slug)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 10px', borderRadius: '8px', marginBottom: '2px', cursor: f.status === 'ativo' ? 'pointer' : 'not-allowed', background: ativa === f.slug ? 'rgba(201,168,76,0.1)' : 'transparent' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0, background: ativa === f.slug ? '#C9A84C' : f.status === 'ativo' ? '#1F6FEB' : 'rgba(255,255,255,0.1)' }} />
              <div style={{ fontSize: '12px', color: ativa === f.slug ? '#C9A84C' : f.status === 'ativo' ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)', lineHeight: '1.3' }}>{f.nome}</div>
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

      <div style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        <div style={{ marginBottom: '28px' }}>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>Bem-vindo de volta</div>
          <div style={{ fontSize: '22px', fontWeight: '700', color: '#fff' }}>Suas <span style={{ color: '#C9A84C' }}>ferramentas</span></div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '16px 20px', marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>Progresso</div>
          <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '16%', background: '#C9A84C', borderRadius: '2px' }} />
          </div>
          <div style={{ fontSize: '13px', fontWeight: '500', color: '#C9A84C' }}>1 de 6</div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>ferramentas</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {ferramentas.map((f, i) => (
            <div key={f.slug} onClick={() => f.status === 'ativo' && setAtiva(f.slug)} style={{ background: ativa === f.slug ? 'rgba(201,168,76,0.06)' : 'rgba(255,255,255,0.02)', border: ativa === f.slug ? '0.5px solid #C9A84C' : '0.5px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '20px', cursor: f.status === 'ativo' ? 'pointer' : 'default', opacity: f.status === 'bloqueado' ? 0.45 : 1, transition: 'all 0.2s' }}>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>Ferramenta {f.num}</div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#fff', marginBottom: '6px', lineHeight: '1.3' }}>{f.nome}</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', lineHeight: '1.5', marginBottom: '14px' }}>{f.desc}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: f.status === 'ativo' ? '#1F6FEB' : 'rgba(255,255,255,0.15)' }} />
                <div style={{ fontSize: '11px', color: f.status === 'ativo' ? '#1F6FEB' : 'rgba(255,255,255,0.2)' }}>{f.status === 'ativo' ? 'Disponível' : 'Bloqueado'}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}