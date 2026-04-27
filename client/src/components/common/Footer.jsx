import { Link } from 'react-router-dom'
import { Mail, Github, Linkedin, Twitter } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary text-white mt-auto">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">PM Toolkit</h3>
            <p className="text-secondary text-sm">
              Empowering Project Managers to create better briefs and build apps without coding.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-secondary hover:text-accent transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-secondary hover:text-accent transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-secondary hover:text-accent transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-secondary hover:text-accent transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary hover:text-accent transition-colors">
                  Guidelines
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary hover:text-accent transition-colors">
                  Prompt Library
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-secondary hover:text-accent transition-colors">
                <Mail size={20} />
              </a>
              <a href="#" className="text-secondary hover:text-accent transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="text-secondary hover:text-accent transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-secondary hover:text-accent transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar with EU Flag */}
        <div className="border-t border-secondary/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-secondary text-sm">
              © {currentYear} PM Toolkit. All rights reserved.
            </p>

            {/* EU Flag */}
            <div className="flex items-center space-x-3">
              <span className="text-secondary text-sm">Proudly made in the EU</span>
              <div className="w-8 h-6 bg-blue-800 rounded flex items-center justify-center relative">
                {/* EU Stars */}
                {[...Array(12)].map((_, i) => {
                  const angle = (i * 30 - 90) * (Math.PI / 180)
                  const x = 50 + 35 * Math.cos(angle)
                  const y = 50 + 35 * Math.sin(angle)
                  return (
                    <div
                      key={i}
                      className="absolute text-yellow-400"
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        transform: 'translate(-50%, -50%)',
                        fontSize: '6px'
                      }}
                    >
                      ★
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
