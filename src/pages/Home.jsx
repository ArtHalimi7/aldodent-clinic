import { Helmet } from 'react-helmet-async'
import Hero from '../components/Hero'
import HorizontalParallax from '../components/HorizontalParallax'
import SignatureProcess from '../components/SignatureProcess'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Testimonials from '../components/Testimonials'

const Home = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user && user.role === 'admin') {
      navigate('/admin', { replace: true })
    }
  }, [user, navigate])

  return (
    <>
      <Helmet>
        <title>AldoDent — Klinikë Dentare Premium në Prishtinë, Kosovë</title>
        <meta name="description" content="AldoDent ofron shërbime dentare premium në Prishtinë: implantologji, estetikë dentare, ortodonci, kirurgji orale. Rezervoni konsultën tuaj falas sot." />
        <link rel="canonical" href="https://aldodent.netlify.app/" />
      </Helmet>
      <Hero />
      <HorizontalParallax />
      <SignatureProcess />
      <Testimonials />
    </>
  )
}

export default Home