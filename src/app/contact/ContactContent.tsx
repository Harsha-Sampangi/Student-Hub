'use client';

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlineEnvelope,
  HiOutlineCheckCircle,
} from 'react-icons/hi2';
import { FaLinkedinIn, FaGithub, FaInstagram, FaDiscord } from 'react-icons/fa6';

interface FormData {
  name: string;
  email: string;
  subject: 'General' | 'Partnership' | 'Bug Report' | 'Feedback';
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const subjectOptions: FormData['subject'][] = [
  'General',
  'Partnership',
  'Bug Report',
  'Feedback',
];

const socialLinks = [
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/company/studenthub',
    icon: <FaLinkedinIn className="w-5 h-5" />,
    color: 'hover:bg-brand-blue/10 hover:text-brand-blue',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/studenthub',
    icon: <FaGithub className="w-5 h-5" />,
    color: 'hover:bg-surface-container hover:text-text-primary',
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com/studenthub',
    icon: <FaInstagram className="w-5 h-5" />,
    color: 'hover:bg-pink-100 dark:hover:bg-pink-900/20 hover:text-pink-500',
  },
  {
    label: 'Discord',
    href: 'https://discord.gg/studenthub',
    icon: <FaDiscord className="w-5 h-5" />,
    color: 'hover:bg-indigo-100 dark:hover:bg-indigo-900/20 hover:text-indigo-500',
  },
];

const communityLinks = [
  { label: 'WhatsApp Community', href: 'https://chat.whatsapp.com/studenthub' },
  { label: 'Telegram Channel', href: 'https://t.me/studenthub' },
  { label: 'Discord Server', href: 'https://discord.gg/studenthub' },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function ContactContent() {
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    subject: 'General',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  function validate(): boolean {
    const newErrors: FormErrors = {};

    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (form.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!form.subject) {
      newErrors.subject = 'Please select a subject';
    }

    if (!form.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (form.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    // Log to console for now
    console.log('Contact form submitted:', form);
    setSubmitted(true);
  }

  function handleChange(
    field: keyof FormData,
    value: string
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear field error on change
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  return (
    <main className="min-h-screen pt-24">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.h1
            variants={fadeInUp}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4"
          >
            Get in <span className="text-gradient-brand">Touch</span>
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed"
          >
            Have a question, want to partner with us, or just want to say hello?
            We&apos;d love to hear from you.
          </motion.p>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Left: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3"
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="glass-card rounded-2xl p-10 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-brand-teal/10 flex items-center justify-center">
                  <HiOutlineCheckCircle className="w-8 h-8 text-brand-teal" />
                </div>
                <h3 className="font-display text-2xl font-bold text-text-primary mb-2">
                  Message Sent!
                </h3>
                <p className="text-text-secondary mb-6">
                  Thank you for reaching out. We&apos;ll get back to you as soon
                  as possible.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setForm({
                      name: '',
                      email: '',
                      subject: 'General',
                      message: '',
                    });
                  }}
                  className="px-6 py-3 bg-brand-teal/10 text-brand-teal font-semibold text-sm rounded-xl hover:bg-brand-teal/20 transition-colors duration-300"
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="glass-card rounded-2xl p-8 sm:p-10"
              >
                <h2 className="font-display text-xl font-bold text-text-primary mb-6">
                  Send us a message
                </h2>

                {/* Name */}
                <div className="mb-5">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-text-primary mb-2"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Your full name"
                    className={`w-full px-4 py-3 rounded-xl bg-surface-container border text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand-teal/40 focus:border-brand-teal transition-all duration-300 text-sm ${
                      errors.name ? 'border-red-400' : 'border-border'
                    }`}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                  />
                  {errors.name && (
                    <p id="name-error" className="mt-1.5 text-xs text-red-500">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="mb-5">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-text-primary mb-2"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="your@email.com"
                    className={`w-full px-4 py-3 rounded-xl bg-surface-container border text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand-teal/40 focus:border-brand-teal transition-all duration-300 text-sm ${
                      errors.email ? 'border-red-400' : 'border-border'
                    }`}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                  {errors.email && (
                    <p id="email-error" className="mt-1.5 text-xs text-red-500">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Subject */}
                <div className="mb-5">
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-text-primary mb-2"
                  >
                    Subject
                  </label>
                  <select
                    id="subject"
                    value={form.subject}
                    onChange={(e) =>
                      handleChange('subject', e.target.value)
                    }
                    className={`w-full px-4 py-3 rounded-xl bg-surface-container border text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/40 focus:border-brand-teal transition-all duration-300 text-sm appearance-none ${
                      errors.subject ? 'border-red-400' : 'border-border'
                    }`}
                    aria-invalid={!!errors.subject}
                    aria-describedby={
                      errors.subject ? 'subject-error' : undefined
                    }
                  >
                    {subjectOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  {errors.subject && (
                    <p
                      id="subject-error"
                      className="mt-1.5 text-xs text-red-500"
                    >
                      {errors.subject}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div className="mb-8">
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-text-primary mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={form.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    placeholder="Tell us what's on your mind..."
                    rows={5}
                    className={`w-full px-4 py-3 rounded-xl bg-surface-container border text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand-teal/40 focus:border-brand-teal transition-all duration-300 text-sm resize-none ${
                      errors.message ? 'border-red-400' : 'border-border'
                    }`}
                    aria-invalid={!!errors.message}
                    aria-describedby={
                      errors.message ? 'message-error' : undefined
                    }
                  />
                  {errors.message && (
                    <p
                      id="message-error"
                      className="mt-1.5 text-xs text-red-500"
                    >
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="group w-full flex items-center justify-center gap-2 py-4 bg-brand-teal hover:bg-brand-teal-dark text-white font-semibold rounded-xl shadow-lg shadow-brand-teal/20 hover:shadow-brand-teal/30 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] text-sm"
                >
                  Send Message
                  <svg
                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </button>
              </form>
            )}
          </motion.div>

          {/* Right: Info Panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Email */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-display text-lg font-bold text-text-primary mb-4">
                Email Us
              </h3>
              <a
                href="mailto:hello@studenthub.in"
                className="flex items-center gap-3 text-text-secondary hover:text-brand-teal transition-colors duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-teal/10 flex items-center justify-center text-brand-teal">
                  <HiOutlineEnvelope className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium">hello@studenthub.in</span>
              </a>
            </div>

            {/* Social Links */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-display text-lg font-bold text-text-primary mb-4">
                Follow Us
              </h3>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-11 h-11 rounded-xl bg-surface-container flex items-center justify-center text-text-tertiary transition-all duration-300 ${social.color}`}
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Community Links */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-display text-lg font-bold text-text-primary mb-4">
                Join Our Community
              </h3>
              <div className="space-y-3">
                {communityLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-4 py-3 rounded-xl bg-surface-container hover:bg-brand-teal/5 border border-border hover:border-brand-teal/20 transition-all duration-300 group"
                  >
                    <span className="text-sm font-medium text-text-secondary group-hover:text-brand-teal transition-colors">
                      {link.label}
                    </span>
                    <svg
                      className="w-4 h-4 text-text-tertiary group-hover:text-brand-teal transition-all duration-300 group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Response Time */}
            <div className="text-center text-sm text-text-tertiary">
              <p>We typically respond within 24 hours</p>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
