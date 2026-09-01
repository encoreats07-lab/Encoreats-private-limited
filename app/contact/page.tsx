"use client";

import { useState } from "react";
import { Mail, Sparkles, AlertCircle, ArrowRight, Check } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-obsidian text-warm-ivory">
      <div className="max-w-4xl mx-auto px-6 lg:px-12 space-y-12">
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-champagne/10 text-champagne text-xs uppercase font-mono tracking-widest">
            <Mail className="w-3.5 h-3.5" />
            <span>Concierge Atelier</span>
          </div>
          <h1 className="font-editorial text-4xl sm:text-5xl text-warm-ivory font-light">Get in Touch</h1>
          <p className="text-muted-stone text-base font-light max-w-md mx-auto leading-relaxed">
            Have a question about membership, partner curation, or host inquiries? Connect with our concierge.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          <div className="md:col-span-5 space-y-6 glass-panel p-8 rounded-sm">
            <h2 className="font-editorial text-2xl text-warm-ivory">Direct Channels</h2>
            <div className="space-y-4 text-xs font-mono text-muted-stone">
              <div>
                <span className="text-champagne block uppercase">General Concierge:</span>
                <span className="text-warm-ivory">concierge@encoreats.com</span>
              </div>
              <div>
                <span className="text-champagne block uppercase">Partner Curation:</span>
                <span className="text-warm-ivory">partners@encoreats.com</span>
              </div>
              <div>
                <span className="text-champagne block uppercase">Press & Media:</span>
                <span className="text-warm-ivory">press@encoreats.com</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-7 glass-panel p-8 rounded-sm">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-12 h-12 rounded-full bg-champagne/10 border border-champagne text-champagne flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="font-editorial text-2xl text-warm-ivory">Transmission Received</h3>
                <p className="text-xs text-muted-stone max-w-sm mx-auto">
                  Thank you for reaching out. Our concierge desk will respond within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase font-mono tracking-widest text-warm-ivory block">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-deep-onyx border border-warm-ivory/20 rounded-xs px-4 py-3 text-sm text-warm-ivory focus:border-champagne focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase font-mono tracking-widest text-warm-ivory block">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-deep-onyx border border-warm-ivory/20 rounded-xs px-4 py-3 text-sm text-warm-ivory focus:border-champagne focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase font-mono tracking-widest text-warm-ivory block">Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-deep-onyx border border-warm-ivory/20 rounded-xs px-4 py-3 text-sm text-warm-ivory focus:border-champagne focus:outline-none"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Membership Question">Membership Question</option>
                    <option value="Partner Collaboration">Partner Collaboration</option>
                    <option value="Press Inquiries">Press Inquiries</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase font-mono tracking-widest text-warm-ivory block">Message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How can we assist you?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-deep-onyx border border-warm-ivory/20 rounded-xs px-4 py-3 text-sm text-warm-ivory focus:border-champagne focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-champagne text-obsidian font-semibold text-xs uppercase tracking-widest rounded-xs hover:bg-warm-ivory transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Send Message</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
