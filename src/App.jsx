import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import Home from './pages/Home'
import About from './pages/About'
import Gallery from './pages/Gallery'
import Services from './pages/Services'
import Booking from './pages/Booking'
import Contact from './pages/Contact'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import PageLoader from './components/PageLoader'

function App() {
  return (
    <HelmetProvider>
      <Router>
        <PageLoader>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/services" element={<Services />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
          <Footer />
        </PageLoader>
      </Router>
    </HelmetProvider>
  )
}

export default App
