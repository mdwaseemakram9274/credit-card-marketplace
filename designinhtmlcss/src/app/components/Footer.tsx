import { CreditCard, Mail, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-black text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-1.5 rounded-lg">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">CreditCard.com</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed max-w-2xl">
              India's most trusted credit card comparison platform. Compare, apply, and start earning rewards today.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 group">
                <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <a href="mailto:support@creditcard.com" className="hover:text-white transition-colors text-sm">
                  support@creditcard.com
                </a>
              </li>
              <li className="flex items-center gap-3 group">
                <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <a href="tel:+911234567890" className="hover:text-white transition-colors text-sm">
                  +91 1234 567 890
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              © 2026 CreditCard.com. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <a href="#" className="text-gray-500 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors">
                Disclaimer
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}