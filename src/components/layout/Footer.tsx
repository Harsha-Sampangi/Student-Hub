'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaInstagram, FaLinkedinIn, FaDiscord, FaWhatsapp, FaGithub } from 'react-icons/fa6';

const quickLinks = [
  { label: 'Opportunities', href: '/opportunities' },
  { label: 'Events', href: '/events' },
  { label: 'Resources', href: '/resources' },
  { label: 'Blog', href: '/blog' },
];

const communityLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Our Team', href: '/team' },
  { label: 'Contact', href: '/contact' },
];

const socialLinks = [
  { icon: FaInstagram, href: 'https://instagram.com/studenthub', label: 'Instagram', color: 'hover:text-pink-500' },
  { icon: FaLinkedinIn, href: 'https://linkedin.com/company/studenthub', label: 'LinkedIn', color: 'hover:text-blue-600' },
  { icon: FaDiscord, href: 'https://discord.gg/studenthub', label: 'Discord', color: 'hover:text-indigo-500' },
  { icon: FaWhatsapp, href: 'https://whatsapp.com', label: 'WhatsApp', color: 'hover:text-green-500' },
  { icon: FaGithub, href: 'https://github.com/studenthub', label: 'GitHub', color: 'hover:text-gray-900 dark:hover:text-white' },
];

export default function Footer() {
  return (
    <footer className="relative bg-surface-dim border-t border-border" aria-label="Site footer">
      {/* Gradient top line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-teal/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image
                src="/images/logo.png"
                alt="Student Hub Logo"
                width={40}
                height={40}
                className="rounded-lg"
                style={{ width: 'auto', height: 'auto' }}
              />
              <span className="font-display text-lg font-bold tracking-tight">
                Student<span className="text-brand-teal">Hub</span>
              </span>
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed mb-6">
              India&apos;s open student community — empowering students with opportunities, resources, and a supportive network to learn, build, and grow together.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2.5 rounded-xl bg-surface-container text-text-tertiary ${social.color} transition-all duration-300 hover:scale-110 hover:shadow-md`}
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-text-tertiary mb-4">
              Explore
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-brand-teal transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-text-tertiary mb-4">
              Community
            </h3>
            <ul className="space-y-3">
              {communityLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-brand-teal transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter / CTA */}
          <div>
            <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-text-tertiary mb-4">
              Stay Updated
            </h3>
            <p className="text-sm text-text-secondary mb-4">
              Get the latest opportunities and resources delivered to your inbox.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-2.5 text-sm rounded-xl bg-surface-container border border-border text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal transition-all duration-200"
                aria-label="Email address"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-brand-teal hover:bg-brand-teal-dark text-white text-sm font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-tertiary">
            © {new Date().getFullYear()} Student Hub. Built with 💚 by students, for students.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="text-xs text-text-tertiary hover:text-text-secondary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/about" className="text-xs text-text-tertiary hover:text-text-secondary transition-colors">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
