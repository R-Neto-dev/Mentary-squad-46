import { useEffect, useRef, useState } from 'react'
import './App.css'
import ProfileMenu from './components/ui/profile-menu'

type ApiStatus = 'checking' | 'online' | 'offline'
type Screen = 'dashboard' | 'extraction'
type ExtractedQuestion = {
  id: string
  number: string
  statement: string
  alternatives: string[]
  answer: number | null
  warnings?: string[]
  type: 'MULTIPLA ESCOLHA' | 'DISCURSIVA'
}

const apiUrl = import.meta.env['VITE_API_URL'] ?? 'http://localhost:3000'

function App() {
  const [lightTheme, setLightTheme] = useState(() => {
    try { return localStorage.getItem('mentary-theme') === 'light' } catch { return false }
  })
  useEffect(() => {
    document.documentElement.dataset.theme = lightTheme ? 'light' : 'blue'
    try { localStorage.setItem('mentary-theme', lightTheme ? 'light' : 'blue') } catch { /* O tema funciona mesmo sem armazenamento. */ }
  }, [lightTheme])
  const requestRef = useRef<AbortController | null>(null)
  const [ocrInfo, setOcrInfo] = useState('')
  const [savedQuestions, setSavedQuestions] = useState<ExtractedQuestion[]>(() => {
    try { const value: unknown = JSON.parse(localStorage.getItem('mentary-extractor-saved') ?? '[]')
      return Array.isArray(value) ? value.filter(q => q && typeof q.statement === 'string' && Array.isArray(q.alternatives) && q.alternatives.every((a: unknown) => typeof a === 'string') && typeof q.id === 'string' && (q.answer === null || (Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.alternatives.length) )).map(q => ({ ...q, type: q.alternatives.length ? q.type : 'DISCURSIVA' as const })) : []
    } catch { return [] }
  })
  const [apiStatus, setApiStatus] = useState<ApiStatus>('checking')
  const [screen, setScreen] = useState<Screen>('extraction')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState('')
  const [extracting, setExtracting] = useState(false)
  const [questions, setQuestions] = useState<ExtractedQuestion[]>([])
  const [extractionMessage, setExtractionMessage] = useState('')
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([])
  const [editingQuestions, setEditingQuestions] = useState<string[]>([])

  const [deletedQuestion, setDeletedQuestion] = useState<{
    question: ExtractedQuestion; index: number; selected: boolean; saved: boolean
  } | null>(null)

  const deleteQuestion = (id: string) => {
    const index = questions.findIndex((question) => question.id === id)
    if (index < 0) return
    setDeletedQuestion({ question: questions[index]!, index,
      selected: selectedQuestions.includes(id), saved: savedQuestions.some((question) => question.id === id) })
    setQuestions((current) => current.filter((question) => question.id !== id))
    setSelectedQuestions((current) => current.filter((questionId) => questionId !== id))
    setEditingQuestions((current) => current.filter((questionId) => questionId !== id))
    setExtractionMessage('')
  }

  const undoDelete = () => {
    if (!deletedQuestion) return
    const { question, index, selected } = deletedQuestion
    setQuestions((current) => [...current.slice(0, index), question, ...current.slice(index)])
    if (selected) setSelectedQuestions((current) => [...current, question.id])
    setDeletedQuestion(null)
  }

  const handleFile = (file?: File) => {
    if (extracting || !file) return
    setOcrInfo('')
    setDeletedQuestion(null)
    setFileError('')
    setQuestions([])
    setSelectedQuestions([])
    setEditingQuestions([])
    setExtractionMessage('')
    if (!file) return
    if (!/\.(pdf|jpg|jpeg|png|webp|bmp|txt|csv|xls|xlsx|json)$/i.test(file.name)) {
      setSelectedFile(null); setFileError('Formato não suportado. Escolha um dos tipos indicados.'); return
    }
    if (file.size > 10 * 1024 * 1024) {
      setSelectedFile(null)
      setFileError('O arquivo ultrapassa o limite de 10 MB.')
      return
    }
    setSelectedFile(file)
  }

  const extractQuestions = async () => {
    if (!selectedFile) return
    setDeletedQuestion(null)
    setExtracting(true)
    setOcrInfo('')
    const controller = new AbortController()
    requestRef.current = controller
    setFileError('')
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      const response = await fetch(`${apiUrl}/extract`, { method: 'POST', body: formData, signal: controller.signal })
      const data = await response.json() as {
        message?: string
        questions?: Array<{ statement: string; options: string[]; answer?: number | null; warnings?: string[]; source?: { row?: number } }>
        data?: { ocr?: { confidence: number }; format?: string; text?: string; questions?: Array<{ statement: string; options: string[]; answer?: number | null; warnings?: string[]; source?: { row?: number } }> }
      }
      if (!response.ok) throw new Error(data.message ?? 'Falha ao extrair o PDF.')
      const extractedQuestions = (data.data?.questions ?? data.questions ?? []).map((question, index) => ({
        id: `question-${index + 1}`,
        number: String(question.source?.row ?? index + 1),
        statement: question.statement.replace(/_{3,}/g, '').trim(),
        alternatives: question.options,
        answer: typeof question.answer === 'number' && Number.isInteger(question.answer) && question.answer >= 0 && question.answer < question.options.length ? question.answer : null,
        warnings: question.warnings,
        type: question.options.length ? 'MULTIPLA ESCOLHA' as const : 'DISCURSIVA' as const,
      }))
      setQuestions(extractedQuestions)
      setSelectedQuestions(extractedQuestions.map((question) => question.id))
      setExtractionMessage(extractedQuestions.length ? `${extractedQuestions.length} questão(ões) extraída(s). Revise antes de salvar.` : 'Nenhuma questão numerada foi identificada. Confira se há enunciados e alternativas legíveis no arquivo.')
      if (data.data?.ocr) setOcrInfo(`Leitura por OCR · confiança média: ${Math.round(data.data.ocr.confidence)}%. Revise principalmente números, símbolos e gabaritos.`)
      else setOcrInfo('Leitura direta do texto. Gabaritos só são preenchidos quando identificados explicitamente no arquivo.')
    } catch (error) {
      setFileError(controller.signal.aborted ? 'Extração cancelada.' : error instanceof Error ? error.message : 'Falha ao extrair o arquivo.')
    } finally {
      requestRef.current = null
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
            answer: question.answer === alternativeIndex ? null
              : question.answer !== null && question.answer > alternativeIndex ? question.answer - 1 : question.answer,
          }
        : question
    )))
  }

  const toggleEditing = (id: string) => {
    setEditingQuestions((current) => current.includes(id)
      ? current.filter((questionId) => questionId !== id)
      : [...current, id])
  }

  const selectedNumbering = new Map(questions
    .filter((question) => selectedQuestions.includes(question.id))
    .map((question, index) => [question.id, String(index + 1)]))
  const displayQuestions = questions.map((question) => ({
    ...question, number: selectedNumbering.get(question.id) ?? question.number,
  }))

  const selectedForReview = displayQuestions.filter(q => selectedQuestions.includes(q.id))
  const reviewErrors = (items: ExtractedQuestion[]) => items.flatMap(q => [
    ...(!q.statement.trim() ? [`Questão ${q.number}: enunciado vazio.`] : []),
    ...(q.type === 'MULTIPLA ESCOLHA' && (q.alternatives.length < 2 || q.alternatives.some(a => !a.trim())) ? [`Questão ${q.number}: preencha pelo menos duas alternativas.`] : []),
  ])
  const questionsWithoutAnswer = selectedForReview.filter(q =>
    q.type === 'MULTIPLA ESCOLHA' && (q.answer === null || !Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.alternatives.length))
  const saveSelectedQuestions = () => {
    if (!selectedForReview.length) { setFileError('Selecione pelo menos uma questão para salvar.'); return }
    const errors = [...reviewErrors(selectedForReview), ...questionsWithoutAnswer.map(q => `Questão ${q.number}: informe um gabarito válido antes de salvar.`)]
    if (errors.length) { setFileError(errors.join(' ')); return }
    try {
      localStorage.setItem('mentary-extractor-saved', JSON.stringify(selectedForReview))
      setSavedQuestions(selectedForReview)
      setFileError('')
      setExtractionMessage(`${selectedForReview.length} questão(ões) salva(s) neste navegador. Este salvamento substitui o lote anterior.`)
    } catch { setFileError('Não foi possível salvar no navegador. Exporte o JSON para guardar sua revisão.') }
  }
  const exportQuestions = (format: 'json' | 'csv') => {
    if (!selectedForReview.length) return
    const errors = reviewErrors(selectedForReview)
    if (errors.length) { setFileError(errors.join(' ')); return }
    const cell = (value: unknown) => {
      let text = String(value ?? '')
      if (/^[\s]*[=+@-]/.test(text)) text = "'" + text
      return '"' + text.replaceAll('"', '""') + '"'
    }
    const rows = selectedForReview.map(q => ({number:Number(q.number),statement:q.statement,type:q.type,options:q.type === 'DISCURSIVA' ? [] : q.alternatives,answer_index:q.type === 'DISCURSIVA' ? null : q.answer,gabarito:q.type === 'DISCURSIVA' || q.answer === null ? null : String.fromCharCode(65 + q.answer)}))
    const content = format === 'json' ? JSON.stringify({questions:rows}, null, 2)
      : '\ufeff' + [['number','statement','type','options','gabarito'], ...rows.map(q => [q.number,q.statement,q.type,q.options.join(' | '),q.gabarito])].map(row => row.map(cell).join(';')).join('\r\n')
    const url = URL.createObjectURL(new Blob([content], {type:format === 'json' ? 'application/json' : 'text/csv;charset=utf-8'}))
    const link = document.createElement('a'); link.href = url; link.download = `mentary-questoes.${format}`; link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  const restoreSaved = () => {
    setQuestions(savedQuestions); setSelectedQuestions(savedQuestions.map(q => q.id)); setEditingQuestions([]); setDeletedQuestion(null)
    setFileError(''); setExtractionMessage('Lote salvo carregado para revisão.'); setOcrInfo('')
  }
  useEffect(() => () => requestRef.current?.abort(), [])

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
    <div className={`app-shell${lightTheme ? ' theme-light' : ''}`}>
      <header className="mentary-header">
        <a className="mentary-home" href="/" onClick={(event) => { event.preventDefault(); setScreen('dashboard') }} aria-label="Mentary - início">
          <img src="/marca_mentary_horizontal.webp" alt="Mentary" width="200" />
        </a>
        <ProfileMenu lightTheme={lightTheme} onThemeChange={setLightTheme} />
      </header>
      <aside className="mascot-column" aria-label="Mascote da Mentary">
        <img className="mentary-mascot" src="/capivara.png" alt="Capivara da Mentary com óculos de realidade virtual" width="1280" height="1280" />
      </aside>
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
              <span className="step-indicator">{extracting ? 'Lendo material.' : questions.length ? '2 de 3 · Revisar e exportar' : '1 de 3 · Enviar material'}</span>
            </div>

            <label
              aria-disabled={extracting}
              className={`upload-area ${selectedFile ? 'has-file' : ''}`}
              htmlFor="material-upload"
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault()
                handleFile(event.dataTransfer.files[0])
              }}
            >
              <span className="upload-icon">{selectedFile ? 'V' : '↑'}</span>
              <strong>{selectedFile ? selectedFile.name : 'Arraste seu arquivo aqui'}</strong>
              <span>{selectedFile ? 'Arquivo selecionado. Clique para trocar.' : 'ou clique para procurar no computador'}</span>
              <small>PDF, imagens, TXT, CSV, XLS/XLSX ou JSON · até 10 MB</small>
              <input
                id="material-upload"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp,.bmp,.txt,.csv,.xls,.xlsx,.json"
                disabled={extracting}
                onChange={(event) => handleFile(event.target.files?.[0])}
              />
            </label>
            {fileError && <p className="file-error" role="alert">{fileError}</p>}
            {selectedFile && <button className="primary-button extract-button" type="button" onClick={extractQuestions} disabled={extracting}>
              {extracting ? 'Extraindo questões...' : 'Iniciar extração'}
            </button>}
            {extracting && <div className="extraction-progress" role="status" aria-live="polite"><progress aria-label="Extração em andamento" /><span>Lendo o arquivo. O OCR pode levar alguns minutos.</span><button type="button" className="alternative-add" onClick={() => requestRef.current?.abort()}>Cancelar extração</button></div>}
            {ocrInfo && <p className="review-note">{ocrInfo}</p>}
            {savedQuestions.length > 0 && <div className="saved-lot"><span>{savedQuestions.length} questão(ões) guardada(s) neste navegador.</span><button type="button" className="alternative-add" disabled={extracting} onClick={restoreSaved}>Abrir lote salvo</button></div>}
            {extractionMessage && <p className="extraction-message">{extractionMessage}</p>}
            {deletedQuestion && (
              <div className="delete-notice" role="status">
                <span>Questão {deletedQuestion.question.number} excluída.</span>
                <button type="button" onClick={undoDelete}>Desfazer</button>
              </div>
            )}
            {questions.length > 0 && (
              <section className="questions-result">
                <div className="questions-header">
                  <div>
                    <h2>Questões extraídas</h2>
                    <p>Selecione as questões que deseja salvar.</p>
                  </div>
                  <button className="primary-button save-button" type="button" onClick={saveSelectedQuestions} disabled={!selectedQuestions.length || questionsWithoutAnswer.length > 0} aria-describedby={questionsWithoutAnswer.length ? "answer-required" : undefined}>
                    Salvar selecionadas ({selectedQuestions.length})
                  </button>
                </div>
                {questionsWithoutAnswer.length > 0 && <p id="answer-required" className="question-warning" role="status">
                  Salvamento bloqueado: informe o gabarito da(s) questão(ões) {questionsWithoutAnswer.map(q => q.number).join(', ')}. Clique no lápis para editar ou desmarque as que não deseja salvar.
                </p>}
                <div className="review-tools">
                  <button type="button" className="alternative-add" onClick={() => setSelectedQuestions(questions.map(q => q.id))}>Selecionar todas</button>
                  <button type="button" className="alternative-add" onClick={() => setSelectedQuestions([])}>Desmarcar todas</button>
                  <button type="button" className="alternative-add" disabled={!selectedQuestions.length} onClick={() => exportQuestions('json')}>Exportar JSON</button>
                  <button type="button" className="alternative-add" disabled={!selectedQuestions.length} onClick={() => exportQuestions('csv')}>Exportar CSV</button>
                  <span>{selectedForReview.filter(q => q.type === 'MULTIPLA ESCOLHA' && q.answer === null).length} objetiva(s) selecionada(s) sem gabarito</span>
                </div>
                <p className="review-note">O salvamento guarda apenas o lote selecionado neste navegador. Gabaritos extraídos precisam de conferência humana.</p>
                {displayQuestions.map((question) => (
                  <article className={`question-card ${selectedQuestions.includes(question.id) ? 'selected' : ''}`} key={question.id}>
                    <div className="question-toolbar">
                      <label className="question-select">
                        <input type="checkbox" checked={selectedQuestions.includes(question.id)} onChange={() => toggleQuestion(question.id)} />
                        <span className="question-number">{question.number} | Questão</span>
                      </label>
                      <button
                        className="edit-button"
                        type="button"
                        onClick={() => toggleEditing(question.id)}
                        aria-label={editingQuestions.includes(question.id) ? `Fechar edição da questão ${question.number}` : `Editar questão ${question.number}`}
                        title={editingQuestions.includes(question.id) ? 'Fechar edição' : 'Editar questão'}
                      >
                        {editingQuestions.includes(question.id) ? (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg>
                        ) : (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m16 3 5 5M4 15 16 3l5 5L9 20l-6 1 1-6Z" /></svg>
                        )}
                      </button>
                    </div>
                    {editingQuestions.includes(question.id) ? (
                      <>
                        <div className="question-edit-actions">
                          <span>Revise o enunciado e as alternativas.</span>
                          <button className="delete-question" type="button" onClick={() => deleteQuestion(question.id)}
                            aria-label={`Excluir questão ${question.number}`}>Excluir questão</button>
                        </div>
                        <label className="field-label" htmlFor={`statement-${question.id}`}>Enunciado</label>
                        <textarea
                          id={`statement-${question.id}`}
                          className="question-edit"
                          value={question.statement}
                          onChange={(event) => updateQuestion(question.id, { statement: event.target.value })}
                          rows={3}
                        />
                        <div className="answer-field">
                          <label className="field-label" htmlFor={`type-${question.id}`}>Tipo de questão</label>
                          <select id={`type-${question.id}`} value={question.type} onChange={event => updateQuestion(question.id, { type: event.target.value as ExtractedQuestion['type'], answer: null, warnings: [] })}>
                            <option value="MULTIPLA ESCOLHA">Múltipla escolha</option>
                            <option value="DISCURSIVA">Discursiva (resposta escrita)</option>
                          </select>
                        </div>
                        {question.type === 'DISCURSIVA' && <p className="review-note">Resposta escrita. Não exige alternativas nem gabarito de múltipla escolha. Se as alternativas não foram reconhecidas, altere o tipo e adicione-as manualmente.</p>}
                        {question.type === 'MULTIPLA ESCOLHA' && <>
                        <div className="answer-field">
                          <label className="field-label" htmlFor={`answer-${question.id}`}>Gabarito</label>
                          <select id={`answer-${question.id}`} value={question.answer ?? ''}
                            disabled={question.alternatives.length === 0}
                            onChange={(event) => updateQuestion(question.id, { answer: event.target.value === '' ? null : Number(event.target.value) })}>
                            <option value="">Não informado</option>
                            {question.alternatives.map((_, index) => (
                              <option key={index} value={index}>Alternativa {String.fromCharCode(65 + index)}</option>
                            ))}
                          </select>
                          {question.alternatives.length === 0 && <small>Adicione alternativas para informar o gabarito.</small>}
                        </div>
                        {question.alternatives.length === 0 && <button className="alternative-add" type="button" onClick={() => addAlternative(question.id)}>+ Adicionar alternativa</button>}
                        {question.alternatives.length > 0 && (
                          <fieldset className="alternatives-edit">
                            <legend>Alternativas</legend>
                            {question.alternatives.map((alternative, alternativeIndex) => (
                              <label key={`${question.id}-${alternativeIndex}`} className={`alternative-field ${question.answer === alternativeIndex ? 'correct-alternative-edit' : ''}`}>
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
                        </>}
                      </>
                    ) : (
                      <>
                        <p className="question-statement">{question.statement}</p>
                        {question.type === 'MULTIPLA ESCOLHA' && question.alternatives.length > 0 && (
                          <ol className="alternatives" type="A">
                            {question.alternatives.map((alternative, index) => (
                              <li key={`${question.id}-${index}`} className={question.answer === index ? 'correct-alternative' : ''}>
                                <span className="alternative-letter" aria-hidden="true">{String.fromCharCode(65 + index)}</span>
                                <span className="alternative-text">{alternative}</span>
                                {question.answer === index && <span className="correct-indicator"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="m8 12 3 3 5-6" /></svg><span className="sr-only">Alternativa correta</span></span>}
                              </li>
                            ))}
                          </ol>
                        )}
                      </>
                    )}
                    {question.warnings?.filter(() => question.type === 'MULTIPLA ESCOLHA').map((warning, index) => <p className="question-warning" key={index}>{warning}</p>)}
                    <small className="question-type">{question.type === 'DISCURSIVA' ? 'DISCURSIVA · Resposta escrita · Gabarito de alternativas não se aplica' : `MULTIPLA ESCOLHA · ${question.answer === null ? 'Gabarito não informado' : 'Gabarito: alternativa ' + String.fromCharCode(65 + question.answer)}`}</small>
                  </article>
                ))}
              </section>
            )}
            {savedQuestions.length > 0 && (
              <p className="saved-summary">Último lote salvo: {savedQuestions.length} questão(ões). Exporte um arquivo para guardar fora deste navegador.</p>
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
            <span className="metric-icon purple">?</span>
            <div>
              <p>Escolas acompanhadas</p>
              <strong>12</strong>
              <small>+2 este mês</small>
            </div>
          </article>
          <article className="metric-card">
            <span className="metric-icon blue">?</span>
            <div>
              <p>Avaliações aplicadas</p>
              <strong>48</strong>
              <small>+8 este mês</small>
            </div>
          </article>
          <article className="metric-card">
            <span className="metric-icon green">?</span>
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
          {apiStatus === 'offline' && 'API offline - confira o backend'}
        </div>
          </>
        )}
      </main>
    </div>
  )
}

export default App
