import Header from '../components/common/Header'
import Footer from '../components/common/Footer'
import HeroSlider from '../components/home/HeroSlider'
import BrandCarousel from '../components/home/BrandCarousel'
import Newsletter from '../components/home/Newsletter'

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <HeroSlider />
        <BrandCarousel />
        <Newsletter />
      </main>
      <Footer />
    </div>
  )
}

export default Home
