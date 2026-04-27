import { Sparkles, Lightbulb, Target, Zap, Rocket, Users } from 'lucide-react'

const features = [
  {
    icon: Lightbulb,
    title: 'Learn Best Practices',
    description: 'Understand what designers need from PMs'
  },
  {
    icon: Target,
    title: 'Create Better Briefs',
    description: 'Guided questions for complete requirements'
  },
  {
    icon: Sparkles,
    title: 'Visual Site-Maps',
    description: 'Drag-and-drop page hierarchy builder'
  },
  {
    icon: Zap,
    title: 'User Journeys',
    description: 'Map user paths with decision logic'
  },
  {
    icon: Rocket,
    title: 'Prompt Library',
    description: '100+ AI prompts for building apps'
  },
  {
    icon: Users,
    title: 'PM-Friendly',
    description: 'No coding or design skills required'
  }
]

const BrandCarousel = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary mb-4">
            Everything You Need as a PM
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From learning design fundamentals to building complete applications - all in one toolkit
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="bg-gradient-to-br from-primary to-accent w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                  <Icon className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default BrandCarousel
