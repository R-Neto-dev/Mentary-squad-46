import { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import './profile-menu.css'

interface ProfileMenuProps {
  lightTheme: boolean
  onThemeChange: (light: boolean) => void
}

export default function ProfileMenu({ lightTheme, onThemeChange }: ProfileMenuProps) {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const menuId = useId()
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!open) return
    const frame = requestAnimationFrame(() => {
      panel.current?.querySelector<HTMLElement>('[aria-checked="true"]')?.focus()
    })
    const outsideClick = (event: PointerEvent) => {
      if (event.target instanceof Node && !root.current?.contains(event.target)) setOpen(false)
    }
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); trigger.current?.focus() }
    }
    document.addEventListener('pointerdown', outsideClick)
    document.addEventListener('keydown', escape)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('pointerdown', outsideClick)
      document.removeEventListener('keydown', escape)
    }
  }, [open])

  return (
    <div className="profile-menu" ref={root} onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false)
    }}>
      <motion.button
        className="profile-trigger"
        type="button"
        ref={trigger}
        aria-label="Perfil e preferências"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen(!open)}
        onKeyDown={(event: React.KeyboardEvent<HTMLButtonElement>) => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); setOpen(true) }
        }}
        {...(reduceMotion ? {} : { whileTap: { scale: 0.92 } })}
      >
        <motion.span className="profile-avatar" animate={{ rotate: open && !reduceMotion ? -8 : 0 }}>
          <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="8" r="3.5" /><path d="M5 21v-2a7 7 0 0 1 14 0v2" /></svg>
        </motion.span>
        <motion.svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" animate={{ rotate: open ? 180 : 0 }} transition={{ duration: reduceMotion ? 0 : 0.18 }}><path d="m6 9 6 6 6-6" /></motion.svg>
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div className="profile-panel" initial={{ opacity: 0, y: reduceMotion ? 0 : -8, scale: reduceMotion ? 1 : 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: reduceMotion ? 0 : -5, scale: reduceMotion ? 1 : 0.98 }} transition={{ duration: reduceMotion ? 0 : 0.18 }}>
            <div className="profile-panel-heading"><strong>Preferências</strong><span>Deixe a Mentary do seu jeito.</span></div>
            <p className="profile-section-label" id={`${menuId}-label`}>Aparência</p>
            <div ref={panel} id={menuId} role="menu" aria-labelledby={`${menuId}-label`} onKeyDown={(event) => {
              const options = [...event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]')]
              const index = options.indexOf(document.activeElement as HTMLButtonElement)
              if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
                event.preventDefault()
                const next = event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1 : (index + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length
                options[next]?.focus()
              }
            }}>
              {[{ light: false, label: 'Fundo azul', detail: 'Visual original da Mentary' }, { light: true, label: 'Fundo branco', detail: 'Uma aparência mais clara' }].map((theme) => (
                <button key={theme.label} type="button" role="menuitemradio" aria-checked={lightTheme === theme.light} className="profile-theme-option" onClick={() => { onThemeChange(theme.light); setOpen(false); trigger.current?.focus() }}>
                  <span className={`profile-theme-swatch ${theme.light ? 'swatch-white' : 'swatch-blue'}`} aria-hidden="true" />
                  <span className="profile-option-text"><strong>{theme.label}</strong><small>{theme.detail}</small></span>
                  {lightTheme === theme.light && <svg className="profile-theme-check" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg>}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
