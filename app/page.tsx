'use client'
import { useState } from 'react'
import { createClient } from '../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nome, setNome] = useState('')
  const [modo, setModo] = useState<'login' | 'cadastro'>('login')
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin() {
    setCarregando(true)
    setErro('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setErro('Email ou senha incorretos')
    } else {
      router.push('/dashboard')
    }
    setCarregando(false)
  }

  async function handleCadastro() {
    setCarregando(true)
    setErro('')
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nome } }
    })
    if (error) {
      setErro('Erro ao criar conta. Tente novamente.')
    } else {
      setErro('Conta criada. Verifique seu email para confirmar.')
    }
    setCarregando(false)
  }

  return (
    <main style={{ minHeight: '100vh', background: '#07090F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '0 24px' }}>
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: '#C9A84C', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '12px' }}>by Pietro Rodrigues</div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#fff', letterSpacing: '-0.02em' }}>Expert AI</div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', marginTop: '8px' }}>Construa seu posicionamento com inteligência</div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '32px' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
            <button onClick={() => { setModo('login'); setErro('') }} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: modo === 'login' ? '#C9A84C' : 'rgba(255,255,255,0.05)', color: modo === 'login' ? '#07090F' : 'rgba(255,255,255,0.4)', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Entrar</button>
            <button onClick={() => { setModo('cadastro'); setErro('') }} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: modo === 'cadastro' ? '#C9A84C' : 'rgba(255,255,255,0.05)', color: modo === 'cadastro' ? '#07090F' : 'rgba(255,255,255,0.4)', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Criar conta</button>
          </div>

          {modo === 'cadastro' && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px', letterSpacing: '0.05em' }}>NOME</label>
              <input type="text" value={nome} onChange={e => setNome(e.target.value)} placeholder="Seu nome completo" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px 14px', fontSize: '14px', color: '#fff', outline: 'none', boxSizing: 'border-box' }} />
            </div>
          )}

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px', letterSpacing: '0.05em' }}>EMAIL</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px 14px', fontSize: '14px', color: '#fff', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px', letterSpacing: '0.05em' }}>SENHA</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px 14px', fontSize: '14px', color: '#fff', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          {erro && <div style={{ fontSize: '13px', color: erro.includes('criada') ? '#4CAF50' : '#ff6b6b', marginBottom: '16px', textAlign: 'center' }}>{erro}</div>}

          <button onClick={modo === 'login' ? handleLogin : handleCadastro} disabled={carregando} style={{ width: '100%', background: '#C9A84C', border: 'none', borderRadius: '8px', padding: '14px', fontSize: '14px', fontWeight: '600', color: '#07090F', cursor: 'pointer' }}>
            {carregando ? 'Aguarde...' : modo === 'login' ? 'Entrar na plataforma' : 'Criar minha conta'}
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: 'rgba(255,255,255,0.2)' }}>Acesso exclusivo para alunos e assinantes</div>
      </div>
    </main>
  )
}