import { Menu, X, CreditCard, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';

// Bank data for dropdown
const allBanks = [
  { id: 'hdfc', name: 'HDFC Bank', logo: '🏦' },
  { id: 'sbi', name: 'State Bank of India', logo: '🏛️' },
  { id: 'icici', name: 'ICICI Bank', logo: '🏢' },
  { id: 'axis', name: 'Axis Bank', logo: '🏦' },
  { id: 'kotak', name: 'Kotak Mahindra', logo: '🏦' },
  { id: 'bob', name: 'Bank of Baroda', logo: '🏦' },
  { id: 'indusind', name: 'IndusInd Bank', logo: '🏦' },
  { id: 'yes', name: 'YES Bank', logo: '🏦' },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBanksDropdownOpen, setIsBanksDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-1.5 rounded-lg">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <span className="text-h3 font-bold">CreditCard.com</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/#cards" className="text-button text-black hover:text-purple-600 transition-colors">
              Credit Cards
            </Link>
            
            {/* Banks Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => setIsBanksDropdownOpen(true)}
              onMouseLeave={() => setIsBanksDropdownOpen(false)}
            >
              <button className="text-button flex items-center gap-1 text-black hover:text-purple-600 transition-colors">
                Banks
                <ChevronDown className={`w-4 h-4 transition-transform ${isBanksDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Dropdown Menu */}
              {isBanksDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  {allBanks.map((bank) => (
                    <Link
                      key={bank.id}
                      to={`/lender/${bank.id}`}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-xl">{bank.logo}</span>
                      <span className="text-body text-gray-700 hover:text-purple-600">
                        {bank.name}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            <Link to="/admin" className="text-button text-black hover:text-purple-600 transition-colors">
              Admin
            </Link>
          </div>

          {/* CTA Button - Desktop */}
          <button className="text-button hidden md:block bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2.5 rounded-lg transition-all">
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
              <Link
                to="/#cards"
                className="text-button text-black hover:text-purple-600 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Credit Cards
              </Link>
              
              {/* Banks Dropdown Mobile */}
              <div>
                <button
                  onClick={() => setIsBanksDropdownOpen(!isBanksDropdownOpen)}
                  className="text-button flex items-center justify-between w-full text-black hover:text-purple-600 transition-colors py-2"
                >
                  Banks
                  <ChevronDown className={`w-4 h-4 transition-transform ${isBanksDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isBanksDropdownOpen && (
                  <div className="ml-4 mt-2 space-y-2">
                    {allBanks.map((bank) => (
                      <Link
                        key={bank.id}
                        to={`/lender/${bank.id}`}
                        className="text-body flex items-center gap-2 text-gray-700 hover:text-purple-600 py-2 transition-colors"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsBanksDropdownOpen(false);
                        }}
                      >
                        <span className="text-base">{bank.logo}</span>
                        <span>{bank.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              
              <Link
                to="/admin"
                className="text-button text-black hover:text-purple-600 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>
              <button className="text-button bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2.5 rounded-lg transition-all mt-2">
                Apply Now
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}