import { Routes, Route, useLocation } from 'react-router'
import { AnimatePresence } from 'framer-motion'
import Home from './pages/Home'
import { ThemeProvider } from './context/ThemeContext'
import { ToastProvider } from './context/ToastContext'
import { ScrollProgress } from './components/ScrollProgress'
import { PageTransition } from './components/PageTransition'
import { Navbar } from './components/Navbar'
import { useEasterEggs } from './hooks/useEasterEggs'

function EasterEggHandler() {
  useEasterEggs();
  return null;
}

export default function App() {
  const location = useLocation();

  return (
    <ThemeProvider>
      <ToastProvider>
        <EasterEggHandler />
        <ScrollProgress />
        <Navbar />
        <div className="pt-16">
          <AnimatePresence mode="wait">
            <PageTransition key={location.pathname}>
              <Routes location={location}>
                <Route path="/" element={<Home />} />
              </Routes>
            </PageTransition>
          </AnimatePresence>
        </div>
      </ToastProvider>
    </ThemeProvider>
  )
}
