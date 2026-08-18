import { useEffect, useState } from 'react'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from './components/Toast'
import type { ThemeMode } from './data'
import { ChatDemo } from './pages/ChatDemo'
import { Gallery } from './pages/Gallery'

function routeFromHash() {
  return window.location.hash.startsWith('#/gallery') ? 'gallery' : 'demo'
}

export default function App() {
  const [route, setRoute] = useState<'demo' | 'gallery'>(routeFromHash)
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem('dsh-demo-theme')
    if (stored === 'light' || stored === 'dark') return stored
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    const onHash = () => { setRoute(routeFromHash()) }
    window.addEventListener('hashchange', onHash)
    return () => { window.removeEventListener('hashchange', onHash) }
  }, [])

  useEffect(() => {
    document.body.toggleAttribute('data-ds-dark-theme', theme === 'dark')
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('dsh-demo-theme', theme)
  }, [theme])

  return (
    <TooltipProvider delayDuration={400}>
      {route === 'gallery'
        ? <Gallery theme={theme} onTheme={setTheme} />
        : <ChatDemo theme={theme} onTheme={setTheme} />}
      <Toaster theme={theme} />
    </TooltipProvider>
  )
}
