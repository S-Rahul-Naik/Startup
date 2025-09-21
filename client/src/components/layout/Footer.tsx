import React from 'react';
import { Link } from 'react-router-dom';
import { 
  AcademicCapIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Our Team', href: '/about#team' },
      { name: 'Contact', href: '/contact' },
    ],
    services: [
      { name: 'Academic Projects', href: '/projects' },
      { name: 'Project Consultation', href: '/services' },
      { name: 'Training Programs', href: '/training' },
      { name: 'Workshops', href: '/workshops' },
    ],
    domains: [
      { name: 'Embedded Systems', href: '/projects?domain=embedded' },
      { name: 'Machine Learning', href: '/projects?domain=ml' },
      { name: 'IoT Projects', href: '/projects?domain=iot' },
      { name: 'VLSI Design', href: '/projects?domain=vlsi' },
      { name: 'Python Projects', href: '/projects?domain=python' },
      { name: 'Android Apps', href: '/projects?domain=android' },
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Documentation', href: '/docs' },
      { name: 'API Reference', href: '/api' },
      { name: 'Status', href: '/status' },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', href: 'https://facebook.com/', icon: 'facebook' },
    { name: 'Twitter', href: 'https://twitter.com/', icon: 'twitter' },
    { name: 'Instagram', href: 'https://www.instagram.com/edutech_2k25/?hl=en', icon: 'instagram' },
    { name: 'LinkedIn', href: 'https://linkedin.com/company/edutech', icon: 'linkedin' },
    { name: 'YouTube', href: 'https://www.youtube.com/@EduTech2k25', icon: 'youtube' },

  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              {/* <img
                src="/images/edutech-footer-logo.png"
                alt="EduTech Logo"
                className="w-24 h-24 object-contain rounded-lg shadow-lg"
                style={{ background: 'transparent' }}
              />
              <span className="text-xl font-bold">EduTech</span> */}
            </div>
              <div className="flex items-center mb-4">
                <a href="/#hero" className="flex items-center group" style={{ textDecoration: 'none' }}>
                  <img
                    src="/images/edutech-footer-logo.png"
                    alt="EduTech Logo"
                    className="w-20 h-20 md:w-28 md:h-28 object-contain rounded-lg shadow-lg transition-transform duration-200 group-hover:scale-105"
                    style={{ background: 'transparent' }}
                  />
                  <span className="ml-4 text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 via-pink-400 to-orange-400 bg-clip-text text-transparent drop-shadow-lg">
                    EduTech
                  </span>
                </a>
              </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Your trusted partner for academic excellence. We provide cutting-edge projects, 
              expert mentorship, and comprehensive support to accelerate your learning journey.
              Founded by Sugali Rahul Naik.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <PhoneIcon className="w-5 h-5 text-primary-400" />
                <span className="text-gray-300">+91 7672039975</span>
              </div>
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="w-5 h-5 text-primary-400" />
                <span className="text-gray-300">edutech956@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPinIcon className="w-5 h-5 text-primary-400" />
                <span className="text-gray-300">
                  India
                </span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div className="min-w-[160px] flex flex-col items-start justify-start">
            <h3 className="text-lg font-bold mb-4 text-white tracking-wide">Company</h3>
            <ul className="flex flex-col gap-2 w-full">
              {footerLinks.company.map((link) => (
                <li key={link.name} className="w-full">
                  <Link
                    to={link.href}
                    className="block w-full text-gray-300 hover:text-primary-400 transition-colors text-base px-1 py-1 rounded focus:outline-none focus:ring-2 focus:ring-primary-400"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Services</h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-primary-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Domains Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Domains</h3>
            <ul className="space-y-2">
              {footerLinks.domains.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-primary-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Subscription */}
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-gray-400 text-sm">
              © {currentYear} Edu Tech. All rights reserved.
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary-400 transition-colors"
                  aria-label={social.name}
                >
                  <SocialIcon name={social.icon} />
                </a>
              ))}
            </div>

            {/* Legal Links */}
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-primary-400 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-primary-400 transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-gray-400 hover:text-primary-400 transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Social Media Icons Component
const SocialIcon: React.FC<{ name: string }> = ({ name }) => {
  const iconClasses = "w-5 h-5";
  
  switch (name) {
    case 'facebook':
      return (
        <svg className={iconClasses} fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      );
    case 'twitter':
      return (
        <svg className={iconClasses} fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.665 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      );
    case 'linkedin':
      return (
        <svg className={iconClasses} fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      );
    case 'youtube':
      return (
        <svg className={iconClasses} fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      );
    case 'instagram':
      return (
        <svg className={iconClasses} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.807-.875-1.297-2.026-1.297-3.323s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323z"/>
        </svg>
      );
    default:
      return null;
  }
};

export default Footer;
