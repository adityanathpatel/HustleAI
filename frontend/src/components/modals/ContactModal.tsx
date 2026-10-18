import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import {
  Mail,
  Send,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  Sparkles,
  MapPin,
  Clock
} from 'lucide-react';
import {
  GithubIcon,
  LinkedinIcon,
  TwitterXIcon,
  InstagramIcon
} from '../common/SocialIcons';
import { useNotification } from '../common/Notification';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const { notify } = useNotification();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Feedback');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      notify('Please fill in your name, email, and message.', 'error');
      return;
    }

    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
      notify('Message sent successfully! Aditya will get back to you shortly.', 'success');
      setTimeout(() => {
        setIsSent(false);
        setName('');
        setEmail('');
        setMessage('');
        onClose();
      }, 1500);
    }, 600);
  };

  const socials = [
    {
      name: 'Instagram',
      handle: '@aditya.dhanus',
      url: 'https://instagram.com/aditya.dhanus',
      icon: InstagramIcon,
      color: 'hover:text-pink-600 hover:border-pink-300 dark:hover:border-pink-800'
    },
    {
      name: 'LinkedIn',
      handle: 'adityanathpatel',
      url: 'https://linkedin.com/in/adityanathpatel',
      icon: LinkedinIcon,
      color: 'hover:text-blue-600 hover:border-blue-300 dark:hover:border-blue-800'
    },
    {
      name: 'X (Twitter)',
      handle: '@adityadhanus',
      url: 'https://x.com/adityadhanus',
      icon: TwitterXIcon,
      color: 'hover:text-slate-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-slate-600'
    },
    {
      name: 'GitHub',
      handle: 'adityanathpatel',
      url: 'https://github.com/adityanathpatel',
      icon: GithubIcon,
      color: 'hover:text-violet-600 hover:border-violet-300 dark:hover:border-violet-800'
    }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Connect & Get in Touch" maxWidth="2xl">
      <div className="space-y-6">
        {/* Creator Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-brand-50 via-indigo-50/50 to-white dark:from-navy-950 dark:via-brand-950/20 dark:to-navy-900 border border-brand-100 dark:border-brand-900/50 flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-electric-500 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-brand-500/25 shrink-0">
            AP
          </div>
          <div className="text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                Aditya Nath Patel
              </h4>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-100 text-brand-700 dark:bg-brand-900/60 dark:text-brand-300">
                Creator & Architect
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Full-stack AI developer building open-source productivity tools for solo entrepreneurs, shopkeepers, and creators.
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-3 text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-500" /> Typically replies within 24 hours
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-brand-500" /> Open to collaborations
              </span>
            </div>
          </div>
        </div>

        {/* Social Link Cards */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
            Direct Social Channels
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {socials.map((s) => {
              const Icon = s.icon;
              return (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-navy-950/40 hover:bg-white dark:hover:bg-navy-900 transition-all flex flex-col items-center text-center gap-1.5 group ${s.color}`}
                >
                  <Icon className="w-4 h-4 text-slate-500 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                    {s.name}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate max-w-full">
                    {s.handle}
                  </span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Quick Message Form */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            Send a Message or Feature Request
          </label>

          {isSent ? (
            <div className="p-8 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
              <h5 className="font-bold text-sm text-emerald-900 dark:text-emerald-200">
                Message Dispatched!
              </h5>
              <p className="text-xs text-emerald-700 dark:text-emerald-300">
                Thank you for reaching out. We will review your message promptly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Aditya or Jane Doe"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-navy-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Your Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@yourdomain.com"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-navy-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subject / Topic
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-navy-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  <option value="General Feedback">General Feedback & Ideas</option>
                  <option value="Feature Request">Request a New Business Tool</option>
                  <option value="Bug Report">Report an Issue or Bug</option>
                  <option value="Model Integration">Local Model / Ollama Setup Help</option>
                  <option value="Partnership">Collaboration & Contribution</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Message
                </label>
                <textarea
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share how HustleAI can help your business or what feature you'd like added..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-navy-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <a
                  href="https://github.com/adityanathpatel/HustleAI/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>Prefer GitHub Issues?</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  type="submit"
                  disabled={isSending}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20 disabled:opacity-50 transition-all flex items-center gap-1.5"
                >
                  {isSending ? (
                    <>Sending...</>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Send Message
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Modal>
  );
};
