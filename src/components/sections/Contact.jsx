import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle2,
  Copy,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  Phone,
  Send,
} from 'lucide-react';
import { portfolioData } from '../../data/portfolioData';
import SectionHeading from '../ui/SectionHeading';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xppqjvqn';

export default function Contact() {
  const { personal } = portfolioData;

  const [copiedEmail, setCopiedEmail] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    _gotcha: '',
  });
  const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personal.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleChange = (e) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(formState),
      });

      if (response.ok) {
        setStatus('success');
        // Clear the form after success
        setFormState({
          name: '',
          email: '',
          subject: '',
          message: '',
          _gotcha: '',
        });
      } else {
        const data = await response.json().catch(() => ({}));
        setErrorMessage(
          data.error ||
            (data.errors && data.errors.map((err) => err.message).join(', ')) ||
            'Failed to send message. Please try again.'
        );
        setStatus('error');
        // Keep what was typed (do NOT clear formState)
      }
    } catch {
      setErrorMessage('Network error. Please try again or reach out directly via email.');
      setStatus('error');
      // Keep what was typed
    }
  };

  const contactCards = [
    {
      title: 'Email',
      value: personal.email,
      href: `mailto:${personal.email}`,
      icon: Mail,
      accent: 'border-neon-blue/30 text-neon-blue shadow-neon-blue',
      action: handleCopyEmail,
      actionLabel: copiedEmail ? 'Copied!' : 'Copy Email',
      actionIcon: copiedEmail ? CheckCircle2 : Copy,
    },
    {
      title: 'Phone',
      value: personal.phoneFormatted,
      href: `tel:+91${personal.phone}`,
      icon: Phone,
      accent: 'border-neon-purple/30 text-neon-purple shadow-neon-purple',
      actionLabel: 'Call Now',
      actionIcon: ExternalLink,
    },
    {
      title: 'GitHub',
      value: personal.githubDisplay,
      href: personal.github,
      icon: Github,
      accent: 'border-cyan-400/30 text-cyan-300',
      actionLabel: 'Open Profile',
      actionIcon: ExternalLink,
    },
    {
      title: 'LinkedIn',
      value: 'vanama-pavan-kalyan-ram',
      href: personal.linkedin,
      icon: Linkedin,
      accent: 'border-purple-400/30 text-purple-300',
      actionLabel: 'Connect',
      actionIcon: ExternalLink,
    },
  ];

  return (
    <section id="contact" className="relative py-16 sm:py-24 lg:py-32 bg-dark-900/60 scroll-mt-24">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-neon-blue/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badge="Get In Touch"
          title="Let's Build Intelligent"
          highlight="Systems Together"
          subtitle="Open for Machine Learning, Generative AI, and Agentic AI engineering roles."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 max-w-6xl mx-auto items-start">
          
          {/* Left Column: Direct Contact Cards */}
          <div className="lg:col-span-5 space-y-4">
            {contactCards.map((c, idx) => {
              const Icon = c.icon;
              const ActionIcon = c.actionIcon;

              return (
                <motion.div
                  key={c.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: idx * 0.08 }}
                  className="glass-card rounded-2xl p-4 sm:p-5 border border-white/10 hover:border-neon-blue/40 transition-all flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className={`w-11 h-11 rounded-xl bg-dark-950 border flex items-center justify-center shrink-0 ${c.accent}`}>
                      <Icon className="w-5 h-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                        {c.title}
                      </p>
                      <a
                        href={c.href}
                        target={c.href.startsWith('http') ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        className="font-display font-medium text-white hover:text-neon-cyan transition-colors text-sm truncate block"
                      >
                        {c.value}
                      </a>
                    </div>
                  </div>

                  {c.action ? (
                    <button
                      type="button"
                      onClick={c.action}
                      className="px-3 py-1.5 rounded-lg text-xs font-mono text-neon-blue bg-neon-blue/10 border border-neon-blue/30 hover:bg-neon-blue/20 transition-all shrink-0 flex items-center justify-center min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 sm:justify-start gap-1.5 cursor-pointer"
                    >
                      <ActionIcon className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{c.actionLabel}</span>
                    </button>
                  ) : (
                    <a
                      href={c.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg text-xs font-mono text-neon-cyan bg-white/5 border border-white/10 hover:bg-neon-cyan/10 hover:border-neon-cyan/30 transition-all shrink-0 flex items-center justify-center min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 sm:justify-start gap-1.5"
                    >
                      <ActionIcon className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{c.actionLabel}</span>
                    </a>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Right Column: Contact Form with Real Formspree Endpoint */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 glass-card rounded-3xl p-5 sm:p-7 lg:p-9 border border-neon-blue/30 relative"
          >
            <div className="mb-6">
              <h3 className="font-display font-bold text-xl sm:text-2xl text-white">
                Send a Message
              </h3>
            </div>

            {status === 'success' && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3 text-emerald-300 text-sm">
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-400" />
                <div>
                  <p className="font-semibold">Message dispatched successfully!</p>
                  <p className="text-xs text-emerald-300/80 mt-0.5">
                    Thank you, your message has been delivered to Pavan Kalyan Ram.
                  </p>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
                <div>
                  <p className="font-semibold">Unable to send message</p>
                  <p className="text-xs text-rose-300/80 mt-0.5">{errorMessage}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Honeypot field to block spam bots */}
              <input
                type="text"
                name="_gotcha"
                tabIndex={-1}
                autoComplete="off"
                value={formState._gotcha}
                onChange={handleChange}
                style={{ display: 'none' }}
                aria-hidden="true"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formState.name}
                    onChange={handleChange}
                    placeholder="e.g. John Doe"
                    className="w-full px-4 py-2.5 min-h-[44px] sm:min-h-0 rounded-xl bg-dark-950/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-neon-blue focus:shadow-neon-blue transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formState.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full px-4 py-2.5 min-h-[44px] sm:min-h-0 rounded-xl bg-dark-950/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-neon-blue focus:shadow-neon-blue transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  required
                  value={formState.subject}
                  onChange={handleChange}
                  placeholder="Machine Learning / Generative AI Inquiry"
                  className="w-full px-4 py-2.5 min-h-[44px] sm:min-h-0 rounded-xl bg-dark-950/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-neon-blue focus:shadow-neon-blue transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">
                  Message *
                </label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  value={formState.message}
                  onChange={handleChange}
                  placeholder="Hi Pavan, I would love to connect regarding..."
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-950/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-neon-blue focus:shadow-neon-blue transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full inline-flex items-center justify-center gap-2 min-h-[44px] sm:min-h-0 px-6 py-3.5 rounded-xl font-display font-semibold text-sm sm:text-base text-dark-950 bg-gradient-to-r from-neon-blue via-neon-cyan to-neon-purple shadow-neon-blue hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:hover:scale-100 transition-all cursor-pointer"
              >
                {status === 'submitting' ? (
                  <span>Sending...</span>
                ) : (
                  <>
                    <span>Transmit Message</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
