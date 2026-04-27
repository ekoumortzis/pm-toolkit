import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Button from '../common/Button'
import { useNavigate } from 'react-router-dom'

const slides = [
  {
    title: 'Learn How Designers Want Requirements',
    subtitle: 'Stop getting revisions. Start delivering clear, actionable briefs.',
    description: 'Discover what designers actually need: site-maps, user journeys, and decision logic - not lengthy documents.',
    cta: 'View Guidelines',
    ctaLink: '/dashboard',
    bgGradient: 'from-primary to-primary/80'
  },
  {
    title: 'Build Better Briefs with Visual Tools',
    subtitle: 'Guided questions. Visual builders. Export-ready deliverables.',
    description: 'Create professional site-maps and user journeys with our drag-and-drop builders. No design experience needed.',
    cta: 'Try Brief Creator',
    ctaLink: '/dashboard',
    bgGradient: 'from-accent to-accent/80'
  },
  {
    title: 'Build Apps Without Writing Code',
    subtitle: 'Copy. Paste. Build. Your AI-powered prompt library.',
    description: 'Access 100+ ready-to-use prompts for building complete applications with AI tools like Claude and Bolt.',
    cta: 'Browse Prompts',
    ctaLink: '/dashboard',
    bgGradient: 'from-primary/90 to-accent/90'
  }
]

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <div className="relative h-[600px] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`
            absolute inset-0 transition-opacity duration-1000
            ${index === currentSlide ? 'opacity-100' : 'opacity-0'}
          `}
        >
          <div className={`h-full bg-gradient-to-r ${slide.bgGradient} flex items-center`}>
            <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 text-white">
              <div className="max-w-3xl">
                <h1 className="text-5xl md:text-6xl font-bold mb-4">
                  {slide.title}
                </h1>
                <p className="text-2xl md:text-3xl mb-4 text-secondary">
                  {slide.subtitle}
                </p>
                <p className="text-lg md:text-xl mb-8 text-white/90">
                  {slide.description}
                </p>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate(slide.ctaLink)}
                  className="text-primary hover:scale-105 transform transition-transform"
                >
                  {slide.cta}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all"
      >
        <ChevronLeft size={32} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all"
      >
        <ChevronRight size={32} />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`
              w-3 h-3 rounded-full transition-all
              ${index === currentSlide ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/75'}
            `}
          />
        ))}
      </div>
    </div>
  )
}

export default HeroSlider
