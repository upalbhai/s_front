'use client';

import { useState } from 'react';
import api from '@/services/api';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/contact', formData);
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="container" style={{ padding: '4rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 className="text-gradient" style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>Contact Us</h1>
        <p style={{ color: 'var(--text-muted)' }}>Get in touch with the Sound Buttons Max team.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '4rem' }}>
        <div className="contact-info">
          <div className="glass-card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
            <Mail className="text-primary" style={{ marginBottom: '1rem' }} />
            <h3>Email</h3>
            <p style={{ color: 'var(--text-muted)' }}>hello@soundbuttonsmax.com</p>
          </div>
          <div className="glass-card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
            <Phone className="text-secondary" style={{ marginBottom: '1rem' }} />
            <h3>Phone</h3>
            <p style={{ color: 'var(--text-muted)' }}>+1 (555) 123-4567</p>
          </div>
          <div className="glass-card" style={{ padding: '2rem' }}>
            <MapPin className="text-accent" style={{ marginBottom: '1rem' }} />
            <h3>Address</h3>
            <p style={{ color: 'var(--text-muted)' }}>123 Sound Lane, Meme City, CA 90210</p>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '3rem' }}>
          {status === 'success' ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <h2 style={{ marginBottom: '1rem' }}>Thank you!</h2>
              <p style={{ color: 'var(--text-muted)' }}>We've received your message and will get back to you soon.</p>
              <button onClick={() => setStatus('')} className="btn-primary" style={{ marginTop: '2rem' }}>Send Another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Full Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Email Address</label>
                <input 
                  type="email" 
                  className="form-input" 
                  required 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Your Message</label>
                <textarea 
                  className="form-input" 
                  style={{ minHeight: '150px' }} 
                  required 
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                ></textarea>
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1rem' }}>
                <Send size={20} /> Send Message
              </button>
              {status === 'error' && <p style={{ color: 'var(--accent)', marginTop: '1rem' }}>Something went wrong. Please try again.</p>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
