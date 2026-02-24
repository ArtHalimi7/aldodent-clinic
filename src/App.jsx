import { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import PageLoader from './components/PageLoader'

// Lazy load pages
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Gallery = lazy(() => import('./pages/Gallery'))
const Services = lazy(() => import('./pages/Services'))
const Booking = lazy(() => import('./pages/Booking'))
const Contact = lazy(() => import('./pages/Contact'))

function App() {
  return (
    <HelmetProvider>
      <Router>
        <PageLoader>
          <Navbar />
          <Suspense fallback={<div className="min-h-screen bg-[#1e3a8a]" />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/services" element={<Services />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </Suspense>
          <Footer />
        </PageLoader>
      </Router>
    </HelmetProvider>
  )
}

export default App
