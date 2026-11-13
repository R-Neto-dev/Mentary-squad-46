import { useEffect, useState } from 'react'
import './App.css'

type ApiStatus = 'checking' | 'online' | 'offline'
type Screen = 'dashboard' | 'extraction'
type ExtractedQuestion = {
  id: string
  number: string
  statement: string
  alternatives: string[]
  answer: number | null
  type: 'MULTIPLA ESCOLHA'
}

const apiUrl = import.meta.env['VITE_API_URL'] ?? 'http://localhost:3000'

function App() {
  const [apiStatus, setApiStatus] = useState<ApiStatus>('checking')
  const [screen, setScreen] = useState<Screen>('dashboard')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState('')
  const [extracting, setExtracting] = useState(false)
  const [questions, setQuestions] = useState<ExtractedQuestion[]>([])
  const [extractionMessage, setExtractionMessage] = useState('')
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([])
  const [savedQuestions, setSavedQuestions] = useState<ExtractedQuestion[]>([])
  const [editingQuestions, setEditingQuestions] = useState<string[]>([])

  const handleFile = (file?: File) => {
    setFileError('')
    setQuestions([])
    setSelectedQuestions([])
    setSavedQuestions([])
    setEditingQuestions([])
    setExtractionMessage('')
    if (!file) return
    if (file.size > 25 * 1024 * 1024) {
      setSelectedFile(null)
      setFileError('O arquivo ultrapassa o limite de 25 MB.')
      return
    }
    setSelectedFile(file)
  }

  const extractQuestions = async () => {
    if (!selectedFile) return
    setExtracting(true)
    setFileError('')
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      const response = await fetch(`${apiUrl}/extract`, { method: 'POST', body: formData })
      const data = await response.json() as {
        message?: string
        questions?: Array<{ statement: string; options: string[]; source?: { row?: number } }>
        data?: { questions?: Array<{ statement: string; options: string[]; source?: { row?: number } }> }
      }
      if (!response.ok) throw new Error(data.message ?? 'Falha ao extrair o PDF.')
      const extractedQuestions = (data.data?.questions ?? data.questions ?? []).map((question, index) => ({
        id: `question-${index + 1}`,
        number: String(question.source?.row ?? index + 1),
        statement: question.statement,
        alternatives: question.options,
        answer: null,
        type: 'MULTIPLA ESCOLHA' as const,
      }))
      setQuestions(extractedQuestions)
      setSelectedQuestions(extractedQuestions.map((question) => question.id))
      setExtractionMessage(data.message ?? '')
    } catch (error) {
      setFileError(error instanceof Error ? error.message : 'Falha ao extrair o PDF.')
    } finally {
      setExtracting(false)
    }

  }

  const toggleQuestion = (id: string) => {
    setSelectedQuestions((current) => current.includes(id)
      ? current.filter((questionId) => questionId !== id)
      : [...current, id])
  }

  const updateQuestion = (id: string, changes: Partial<ExtractedQuestion>) => {
    setQuestions((current) => current.map((question) => (
      question.id === id ? { ...question, ...changes } : question
    )))
  }

  const updateAlternative = (questionId: string, alternativeIndex: number, value: string) => {
    setQuestions((current) => current.map((question) => {
      if (question.id !== questionId) return question
      const alternatives = [...question.alternatives]
      alternatives[alternativeIndex] = value
      return { ...question, alternatives }
    }))
  }

  const addAlternative = (questionId: string) => {
    setQuestions((current) => current.map((question) => (
      question.id === questionId
        ? { ...question, alternatives: [...question.alternatives, ''] }
        : question
    )))
  }

  const removeAlternative = (questionId: string, alternativeIndex: number) => {
    setQuestions((current) => current.map((question) => (
      question.id === questionId
        ? {
            ...question,
            alternatives: question.alternatives.filter((_, index) => index !== alternativeIndex),
          }
        : question
    )))
  }

  const toggleEditing = (id: string) => {
    setEditingQuestions((current) => current.includes(id)
      ? current.filter((questionId) => questionId !== id)
      : [...current, id])
  }

  const saveSelectedQuestions = () => {
    setSavedQuestions(questions.filter((question) => selectedQuestions.includes(question.id)))
    setExtractionMessage(`${selectedQuestions.length} questão(ões) salva(s) com sucesso.`)
  }

  useEffect(() => {
    let active = true

    fetch(`${apiUrl}/health`)
      .then((response) => {
        if (!response.ok) throw new Error('API indisponível')
        if (active) setApiStatus('online')
      })
      .catch(() => {
        if (active) setApiStatus('offline')
      })

    return () => {
      active = false
    }
  }, [])

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Mentary - início">
          <span className="brand-mark">M</span>
          <span>mentary</span>
        </a>
        <div className="topbar-actions">
          <span className="role-label">{screen === 'dashboard' ? 'Visão geral' : 'Extrator de questões'}</span>
          <button className="avatar" type="button" aria-label="Perfil do usuário">
            R
          </button>
        </div>
      </header>

      <main className="content">
        {screen === 'extraction' ? (
          <section className="extraction-screen">
            <button className="back-button" type="button" onClick={() => setScreen('dashboard')}>
              ← Voltar para o painel
            </button>
            <div className="extraction-heading">
              <div>
                <p className="eyebrow">CAPACIDADE 1</p>
                <h1>Extrair questões</h1>
                <p className="subtitle">
                  Envie um material educacional e transforme-o em questões estruturadas para revisão.
                </p>
              </div>
              <span className="step-indicator">1 de 3 · Enviar material</span>
            </div>

            <label
              className={`upload-area ${selectedFile ? 'has-file' : ''}`}
              htmlFor="material-upload"
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault()
                handleFile(event.dataTransfer.files[0])
              }}
            >
              <span className="upload-icon">{selectedFile ? '✓' : '↑'}</span>
              <strong>{selectedFile ? selectedFile.name : 'Arraste seu arquivo aqui'}</strong>
              <span>{selectedFile ? 'Arquivo selecionado. Clique para trocar.' : 'ou clique para procurar no computador'}</span>
              <small>PDF, JPG, PNG, CSV, XLSX ou JSON · até 25 MB</small>
              <input
                id="material-upload"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.csv,.xlsx,.json"
                onChange={(event) => handleFile(event.target.files?.[0])}
              />
            </label>
            {fileError && <p className="file-error" role="alert">{fileError}</p>}
            {selectedFile && <button className="primary-button extract-button" type="button" onClick={extractQuestions} disabled={extracting}>
              {extracting ? 'Extraindo questões...' : 'Iniciar extração'}
            </button>}
            {extractionMessage && <p className="extraction-message">{extractionMessage}</p>}
            {questions.length > 0 && (
              <section className="questions-result">
                <div className="questions-header">
                  <div>
                    <h2>Questões extraídas</h2>
                    <p>Selecione as questões que deseja salvar.</p>
                  </div>
                  <button className="primary-button save-button" type="button" onClick={saveSelectedQuestions} disabled={!selectedQuestions.length}>
                    Salvar selecionadas ({selectedQuestions.length})
                  </button>
                </div>
                {questions.map((question) => (
                  <article className={`question-card ${selectedQuestions.includes(question.id) ? 'selected' : ''}`} key={question.id}>
                    <div className="question-toolbar">
                      <label className="question-select">
                        <input type="checkbox" checked={selectedQuestions.includes(question.id)} onChange={() => toggleQuestion(question.id)} />
                        <span>Questão {question.number}</span>
                      </label>
                      <button
                        className="edit-button"
                        type="button"
                        onClick={() => toggleEditing(question.id)}
                        aria-label={editingQuestions.includes(question.id) ? `Fechar edição da questão ${question.number}` : `Editar questão ${question.number}`}
                        title={editingQuestions.includes(question.id) ? 'Fechar edição' : 'Editar questão'}
                      >
                        {editingQuestions.includes(question.id) ? '✓' : '✎'}
                      </button>
                    </div>
                    {editingQuestions.includes(question.id) ? (
                      <>
                        <label className="field-label" htmlFor={`statement-${question.id}`}>Enunciado</label>
                        <textarea
                          id={`statement-${question.id}`}
                          className="question-edit"
                          value={question.statement}
                          onChange={(event) => updateQuestion(question.id, { statement: event.target.value })}
                          rows={3}
                        />
                        {question.alternatives.length > 0 && (
                          <fieldset className="alternatives-edit">
                            <legend>Alternativas</legend>
                            {question.alternatives.map((alternative, alternativeIndex) => (
                              <label key={`${question.id}-${alternativeIndex}`} className="alternative-field">
                                <span>{String.fromCharCode(65 + alternativeIndex)}</span>
                                <input
                                  value={alternative}
                                  onChange={(event) => updateAlternative(question.id, alternativeIndex, event.target.value)}
                                />
                                <button
                                  className="alternative-remove"
                                  type="button"
                                  onClick={() => removeAlternative(question.id, alternativeIndex)}
                                  aria-label={`Excluir alternativa ${String.fromCharCode(65 + alternativeIndex)}`}
                                  title="Excluir alternativa"
                                >
                                  ×
                                </button>
                              </label>
                            ))}
                            <button className="alternative-add" type="button" onClick={() => addAlternative(question.id)}>
                              + Adicionar alternativa
                            </button>
                          </fieldset>
                        )}
                      </>
                    ) : (
                      <>
                        <p className="question-statement">{question.statement}</p>
                        {question.alternatives.length > 0 && (
                          <ol className="alternatives" type="A">
                            {question.alternatives.map((alternative) => <li key={alternative}>{alternative}</li>)}
                          </ol>
                        )}
                      </>
                    )}
                    <small className="question-type">{question.type} · Gabarito não informado</small>
                  </article>
                ))}
              </section>
            )}
            {savedQuestions.length > 0 && (
              <p className="saved-summary">{savedQuestions.length} questão(ões) pronta(s) para o Banco de Questões.</p>
            )}
          </section>
        ) : (
          <>
        <section className="welcome">
          <div>
            <p className="eyebrow">PAINEL EDUCACIONAL</p>
            <h1>Olá, Reginaldo!</h1>
            <p className="subtitle">
              Acompanhe os resultados da sua rede e transforme dados em decisões pedagógicas.
            </p>
          </div>
          <button className="primary-button" type="button" onClick={() => setScreen('extraction')}>
            + Novo material
          </button>
        </section>

        <section className="metrics" aria-label="Resumo da rede">
          <article className="metric-card">
            <span className="metric-icon purple">◈</span>
            <div>
              <p>Escolas acompanhadas</p>
              <strong>12</strong>
              <small>+2 este mês</small>
            </div>
          </article>
          <article className="metric-card">
            <span className="metric-icon blue">▣</span>
            <div>
              <p>Avaliações aplicadas</p>
              <strong>48</strong>
              <small>+8 este mês</small>
            </div>
          </article>
          <article className="metric-card">
            <span className="metric-icon green">↗</span>
            <div>
              <p>Média da rede</p>
              <strong>72,4%</strong>
              <small className="positive">+4,2% vs. período anterior</small>
            </div>
          </article>
          <article className="metric-card">
            <span className="metric-icon orange">!</span>
            <div>
              <p>Descritores críticos</p>
              <strong>07</strong>
              <small className="warning">Requer atenção</small>
            </div>
          </article>
        </section>

        <section className="dashboard-grid">
          <article className="panel performance-panel">
            <div className="panel-heading">
              <div>
                <h2>Desempenho da rede</h2>
                <p>Média geral por período</p>
              </div>
              <select aria-label="Período do desempenho" defaultValue="semestre">
                <option value="semestre">Último semestre</option>
                <option value="ano">Último ano</option>
              </select>
            </div>
            <div className="chart" aria-label="Gráfico de desempenho crescente">
              <div className="chart-lines">
                <span>80%</span><span>60%</span><span>40%</span><span>20%</span>
              </div>
              <div className="bars">
                {[52, 58, 55, 66, 70, 76].map((height, index) => (
                  <div className="bar-column" key={index}>
                    <div className="bar" style={{ height: `${height}%` }} />
                    <span>{['Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out'][index]}</span>
                  </div>
                ))}
              </div>
            </div>
          </article>

          <article className="panel activity-panel">
            <div className="panel-heading">
              <div>
                <h2>Atividade recente</h2>
                <p>Últimas atualizações da plataforma</p>
              </div>
              <button className="text-button" type="button">Ver tudo</button>
            </div>
            <ul className="activity-list">
              <li><span className="activity-dot green-dot" /><div><strong>Simulado concluído</strong><small>Escola Horizonte · há 2 horas</small></div></li>
              <li><span className="activity-dot purple-dot" /><div><strong>Novo material processado</strong><small>12 questões extraídas · ontem</small></div></li>
              <li><span className="activity-dot orange-dot" /><div><strong>Alerta de desempenho</strong><small>Descritor EF07MA05 · ontem</small></div></li>
            </ul>
          </article>
        </section>

        <div className={`api-status ${apiStatus}`}>
          <span />
          {apiStatus === 'checking' && 'Conectando à API...'}
          {apiStatus === 'online' && 'API conectada'}
          {apiStatus === 'offline' && 'API offline — confira o backend'}
        </div>
          </>
        )}
      </main>
    </div>
  )
}

export default App
