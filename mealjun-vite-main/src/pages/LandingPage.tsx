import { useEffect } from 'react'
import HeroSection from '../components/landing/HeroSection'
import AboutSection from '../components/landing/AboutSection'
import GallerySection from '../components/landing/GallerySection'
import ProductSection from '../components/landing/ProductSection'
import ReviewSection from '../components/landing/ReviewSection'
import ContactSection from '../components/landing/ContactSection'
import Navbar from '../components/landing/Navbar'
import Footer from '../components/landing/Footer'
import { getVisitorLocation } from '../utils/geolocation'
import { analyticsTrackingAPI } from '../services/api'

type LandingPageProps = {
  addToCart: (product: any) => void
  cartItemCount: number
}

export default function LandingPage({
  addToCart,
  cartItemCount,
}: LandingPageProps) {
  useEffect(() => {
    // Track visitor location on page load
    const trackVisitor = async () => {
      try {
        const locationData = await getVisitorLocation()

        if (locationData) {
          // Send location data to backend
          await analyticsTrackingAPI.trackVisitor({
            visitor_city: locationData.visitor_city,
            visitor_province: locationData.visitor_province,
            visitor_country: locationData.visitor_country,
          })
        }
      } catch (error) {
        console.error('Error tracking visitor:', error)
      }
    }

    trackVisitor()
  }, [])

  useEffect(() => {
    if (!window.location.hash) return

    const scrollToHash = () => {
      const element = document.querySelector(window.location.hash)
      element?.scrollIntoView({ behavior: 'smooth' })
    }

    window.setTimeout(scrollToHash, 100)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Navbar cartItemCount={cartItemCount} />
      <main>
        <HeroSection />
        <AboutSection />
        <GallerySection />
        <ProductSection addToCart={addToCart} />
        <ReviewSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
