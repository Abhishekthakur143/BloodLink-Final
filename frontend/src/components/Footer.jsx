import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8 mt-auto">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Brand */}
        <div>
          <h3 className="text-2xl font-bold text-primary mb-3">BloodLink</h3>
          <p className="text-sm text-gray-400">Connecting donors with those in need. Saving lives, one drop at a time.</p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/search-requests" className="hover:text-primary transition">Find Blood</Link></li>
            <li><Link to="/camps" className="hover:text-primary transition">Blood Camps</Link></li>
            <li><Link to="/sos" className="hover:text-primary transition">Emergency SOS</Link></li>
            <li><Link to="/ai-chat" className="hover:text-primary transition">AI Assistant</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-3">Contact Us</h4>
          <p className="text-sm text-gray-400">Email: support@bloodlink.app</p>
          <p className="text-sm text-gray-400">Helpline: +91 1800-123-4567</p>
          <p className="text-sm text-gray-400 mt-2">24/7 Blood Donation Support</p>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-xs text-gray-500">
        © 2024 BloodLink. All rights reserved. Made with ❤️ to save lives.
      </div>
    </footer>
  );
}