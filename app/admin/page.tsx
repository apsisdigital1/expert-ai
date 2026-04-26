'use client'
import { useState, useRef } from 'react'

type Livro = { id: string; titulo: string; tipo: string; criado_em: string }

export default function Admin() {
  const [titulo, setTitulo] = useState('')
  const [tipo, setTipo] = useState('livro')
  const [arquivo, setArquivo] = useState<File | null>(null)
  const [carregando, setCarregando] = useState(false)
  const [livros, setLivros] = useState<Livro[]>([])
  const [mensagem, setMensagem] = useState('')
  const [senha, setSenha] = useState('')
  const [autenticado, setAutenticado] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  function autenticar() {
    if (senha === 'pietro2024admin') {
      setAutenticado(true)
      carregarLivros()
    } else {
      setMensagem('Senha incorreta.')
    }
  }

  async function carregarLivros() {
    const res = await fetch('/api/admin/livros')
    const data = await res.json()
    setLivros(data.livros || [])
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type === 'application/pdf') setArquivo(file)
  }

  async function uploadLivro() {
    if (!arquivo || !titulo) { setMensagem('Preencha o título e selecione um arquivo.'); return }
    setCarregando(true)
    setMensagem('Processando o PDF. Aguarde...')
    const reader = new FileReader()
    reader.onload = async (e) => {
      const base64 = (e.target?.result as string).split(',')[1]
      try {
        const res = await fetch('/api/admin/upload-livro', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ titulo, tipo, base64 })
        })
        const data = await res.json()
        if (data.sucesso) {
          setMensagem('Livro adicionado com sucesso.')
          setTitulo('')
          setArquivo(null)
          carregarLivros()
        } else {
          setMensagem('Erro ao adicionar livro. Tente novamente.')
        }
      } catch {
        setMensagem('Erro ao conectar. Tente novamente.')
      }
      setCarregando(false)
    }
    reader.readAsDataURL(arquivo)
  }

  async function deletarLivro(id: string) {
    await fetch('/api/admin/deletar-livro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    carregarLivros()
  }

  if (!autenticado) return (
    <div style={{ minHeight: '100vh', background: '#07090F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: '400px', width: '100%', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '11px', color: '#C9A84C', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px' }}>by Pietro Rodrigues</div>
          <div style={{ fontSize: '20px', fontWeight: '700', color: '#fff' }}>Painel de Admin</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '28px' }}>
          <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>SENHA DE ACESSO</label>
          <input type="password" value={senha} onChange={e => setSenha(e.target.value)} onKeyDown={e => e.key === 'Enter' && autenticar()} placeholder="••••••••" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px 14px', fontSize: '14px', color: '#fff', outline: 'none', boxSizing: 'border-box', marginBottom: '16px' }} />
          {mensagem && <div style={{ fontSize: '13px', color: '#ff6b6b', marginBottom: '16px' }}>{mensagem}</div>}
          <button onClick={autenticar} style={{ width: '100%', background: '#C9A84C', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '14px', fontWeight: '600', color: '#07090F', cursor: 'pointer' }}>Entrar</button>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#07090F', fontFamily: 'system-ui, sans-serif', padding: '40px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '11px', color: '#C9A84C', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px' }}>Painel de Admin</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#fff' }}>Base de Conhecimento do <span style={{ color: '#C9A84C' }}>Estrategista</span></div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '28px', marginBottom: '24px' }}>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#fff', marginBottom: '20px' }}>Adicionar novo material</div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>TÍTULO</label>
            <input type="text" value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Ex: Positioning — Al Ries e Jack Trout" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px 14px', fontSize: '14px', color: '#fff', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>TIPO</label>
            <select value={tipo} onChange={e => setTipo(e.target.value)} style={{ width: '100%', background: '#1a1a2e', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px 14px', fontSize: '14px', color: '#fff', outline: 'none', boxSizing: 'border-box' }}>
              <option value="livro">Livro</option>
              <option value="artigo">Artigo</option>
              <option value="metodologia">Metodologia</option>
              <option value="case">Case</option>
            </select>
          </div>

          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            style={{ background: dragOver ? 'rgba(201,168,76,0.08)' : 'rgba(255,255,255,0.02)', border: arquivo ? '0.5px solid #C9A84C' : dragOver ? '0.5px solid #C9A84C' : '0.5px dashed rgba(255,255,255,0.15)', borderRadius: '8px', padding: '36px', textAlign: 'center', cursor: 'pointer', marginBottom: '16px', transition: 'all 0.2s' }}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>📄</div>
            <div style={{ fontSize: '14px', color: arquivo ? '#C9A84C' : 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>{arquivo ? arquivo.name : 'Arraste o PDF aqui ou clique para selecionar'}</div>
            {!arquivo && <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)' }}>Somente arquivos PDF</div>}
            <input ref={fileRef} type="file" accept=".pdf" style={{ display: 'none' }} onChange={e => setArquivo(e.target.files?.[0] || null)} />
          </div>

          {mensagem && <div style={{ fontSize: '13px', color: mensagem.includes('sucesso') ? '#4CAF50' : mensagem.includes('Processando') ? '#C9A84C' : '#ff6b6b', marginBottom: '16px' }}>{mensagem}</div>}

          <button onClick={uploadLivro} disabled={carregando} style={{ background: carregando ? 'rgba(201,168,76,0.4)' : '#C9A84C', border: 'none', borderRadius: '8px', padding: '12px 24px', fontSize: '14px', fontWeight: '600', color: '#07090F', cursor: carregando ? 'not-allowed' : 'pointer' }}>
            {carregando ? 'Processando PDF...' : 'Adicionar ao Estrategista'}
          </button>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '28px' }}>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#fff', marginBottom: '20px' }}>Materiais na base de conhecimento ({livros.length})</div>
          {livros.length === 0 && <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>Nenhum material adicionado ainda.</div>}