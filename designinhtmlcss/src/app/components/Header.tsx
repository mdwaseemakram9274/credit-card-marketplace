import { Menu, X, CreditCard } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-1.5 rounded-lg">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-black">CreditCard.com</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#home" className="text-black hover:text-purple-600 font-medium transition-colors">
              Home
            </a>
            <a href="#cards" className="text-black hover:text-purple-600 font-medium transition-colors">
              Credit Cards
            </a>
            <a href="#benefits" className="text-black hover:text-purple-600 font-medium transition-colors">
              Benefits
            </a>
            <a href="#types" className="text-black hover:text-purple-600 font-medium transition-colors">
              Types
            </a>
            <a href="#faqs" className="text-black hover:text-purple-600 font-medium transition-colors">
              FAQs
            </a>
          </div>

          {/* CTA Button - Desktop */}
          <button className="hidden md:block bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-all">
            Apply Now
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-black"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-4">
              <a
                href="#home"
                className="text-black hover:text-purple-600 font-medium transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </a>
              <a
                href="#cards"
                className="text-black hover:text-purple-600 font-medium transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Credit Cards
              </a>
              <a
                href="#benefits"
                className="text-black hover:text-purple-600 font-medium transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Benefits
              </a>
              <a
                href="#types"
                className="text-black hover:text-purple-600 font-medium transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Types
              </a>
              <a
                href="#faqs"
                className="text-black hover:text-purple-600 font-medium transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQs
              </a>
              <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-all mt-2">
                Apply Now
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}