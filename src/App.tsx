import { Routes, Route, useLocation } from 'react-router'
import { AnimatePresence } from 'framer-motion'
import Home from './pages/Home'
import Showcase from './pages/Showcase'
import Comments from './pages/Comments'
import Create from './pages/Create'
import Leaderboard from './pages/Leaderboard'
import Insights from './pages/Insights'
import Install from './pages/Install'
import { ThemeProvider } from './context/ThemeContext'
import { ToastProvider } from './context/ToastContext'
import { ScrollProgress } from './components/ScrollProgress'
import { PageTransition } from './components/PageTransition'
import { Navbar } from './components/Navbar'
import Footer from './components/Footer'
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
                <Route path="/showcase" element={<Showcase />} />
                <Route path="/comments" element={<Comments />} />
                <Route path="/create" element={<Create />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/insights" element={<Insights />} />
                <Route path="/install" element={<Install />} />
              </Routes>
            </PageTransition>
          </AnimatePresence>
        </div>
        <Footer />
      </ToastProvider>
    </ThemeProvider>
  )
}
