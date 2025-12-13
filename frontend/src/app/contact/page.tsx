"use client";
import React, { useState } from "react";
import DotGrid from "@/components/DotGrid";
import Link from "next/link";
import useLenis from "@/lib/uselenis";

const NavLink = ({ href, children, isActive }: { href: string; children: React.ReactNode; isActive?: boolean }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={href}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        color: '#ffffff',
        textDecoration: 'none',
        fontWeight: 600,
        opacity: isActive ? 1 : (isHovered ? 1 : 0.8),
        transition: 'all 0.3s ease',
        position: 'relative',
        textShadow: isHovered ? '0 0 8px rgba(82, 39, 255, 0.5)' : 'none',
      }}
    >
      {children}
      <span
        style={{
          position: 'absolute',
          bottom: -4,
          left: 0,
          width: isHovered ? '100%' : '0%',
          height: '2px',
          background: 'linear-gradient(90deg, #5227FF 0%, #8A5CFF 100%)',
          transition: 'width 0.3s ease',
          borderRadius: '2px',
        }}
      />
    </Link>
  );
};

export default function Chat() {
  useLenis({ lerp: 0.07 });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        alert('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', position: 'relative', backgroundColor: '#000000' }}>
      <div style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: 0 }}>
        <DotGrid
          dotSize={5}
          gap={15}
          baseColor=""
          activeColor="#5227FF"
          proximity={120}
          shockRadius={250}
          shockStrength={5}
          resistance={750}
          returnDuration={1.5}
          style={{ width: '100%', height: '100%' } as React.CSSProperties}
        />
      </div>
      <main style={{ position: 'relative', zIndex: 10, paddingTop: '150px', minHeight: 'calc(100vh - 100px)', display: 'flex', justifyContent: 'center', paddingBottom: '50px' }}>
        <div style={{
          width: 'calc(100% - 40px)',
          maxWidth: '800px',
          padding: '40px',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          gap: '30px'
        }}>
          <p style={{ fontSize: '1.25rem', lineHeight: '1.6', textAlign: 'left' }} className="body-text">
            Drop us a line! Whether you have questions, feedback, or just want to say hello, we'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible.
          </p>
          <div style={{
            padding: '30px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            
            {isSubmitted ? (
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                padding: '40px 20px', 
                textAlign: 'center', 
                gap: '20px',
                minHeight: '400px'
              }}>
                <div style={{ 
                  width: '80px', 
                  height: '80px', 
                  borderRadius: '50%', 
                  backgroundColor: 'rgba(76, 175, 80, 0.1)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  border: '1px solid rgba(76, 175, 80, 0.3)'
                }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <h3 className="body-text" style={{ fontSize: '1.5rem', margin: 0, color: '#fff', fontWeight: 600 }}>
                  Message Successfully Sent
                </h3>
                <p className="body-text" style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)', margin: 0, maxWidth: '400px' }}>
                  Our team will get back soon! Relax n wait.
                </p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="body-text"
                  style={{
                    marginTop: '20px',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(255,255,255,0.05)',
                    color: '#fff',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label htmlFor="name" className="body-text" style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
                    Name <span style={{ color: '#ff4d4d' }}>*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="body-text"
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      color: '#fff',
                      outline: 'none',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label htmlFor="email" className="body-text" style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="body-text"
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      color: '#fff',
                      outline: 'none',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label htmlFor="phone" className="body-text" style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
                    Phone No. <span style={{ color: '#ff4d4d' }}>*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="body-text"
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      color: '#fff',
                      outline: 'none',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label htmlFor="message" className="body-text" style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
                    Message <span style={{ color: '#ff4d4d' }}>*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="body-text"
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      color: '#fff',
                      outline: 'none',
                      fontSize: '1rem',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <button 
                  type="submit"
                  className="body-text"
                  style={{
                    padding: '14px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'linear-gradient(90deg, #5227FF 0%, #8A5CFF 100%)',
                    color: '#fff',
                    fontWeight: 600,
                    cursor: 'pointer',
                    marginTop: '10px',
                    fontSize: '1rem',
                    transition: 'opacity 0.2s'
                  }}
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <footer
        style={{
          padding: '40px 0',
          width: '100%',
          textAlign: 'center',
          color: 'rgba(255, 255, 255, 0.5)',
          fontSize: '0.875rem',
          position: 'relative',
          zIndex: 10
        }}
        className="body-text"
      >
        &copy; {new Date().getFullYear()} AURA. All rights reserved.
      </footer>

      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: `calc(24px + clamp(2.5rem, 6vw, 5rem) + 12px + 4px)`,
          backgroundColor: '#000000',
          zIndex: 50,
        }}
      >
        <h1
          className="heading text-white"
          style={{
            position: 'absolute',
            left: '24px',
            top: '24px',
            zIndex: 40,
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            fontWeight: 700,
            margin: 0,
            lineHeight: 1,
          }}
        >
          AURA
        </h1>
        <nav
          aria-label="Primary"
          className="desktop-nav body-text"
          style={{
            position: 'absolute',
            right: '54px',
            top: '40px',
            zIndex: 40,
            gap: '50px',
            fontSize: '1.3rem',
            alignItems: 'center',
          }}
        >
          <NavLink href="/">Home</NavLink>
          <div style={{ width: '1px', height: '28px', backgroundColor: 'rgba(255,255,255,0.3)' }} />
          <NavLink href="/chat">Chat</NavLink>
          <div style={{ width: '1px', height: '28px', backgroundColor: 'rgba(255,255,255,0.3)' }} />
          <NavLink href="/contact" isActive>Contact</NavLink>
        </nav>
        <button
          className="mobile-hamburger"
          aria-label="Open menu"
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          onClick={() => setMobileOpen(v => !v)}
          style={{ position: 'absolute', right: '16px', top: '20px', zIndex: 45, background: 'transparent', border: 'none', padding: 8, cursor: 'pointer' }}
        >
          <span className={`hamburger ${mobileOpen ? 'open' : ''}`} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
        
        <div
          role="separator"
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: '4px',
            borderRadius: '2px',
            background: 'linear-gradient(90deg, #5227FF 0%, #8A5CFF 100%)',
            zIndex: 40,
          }}
        />
      </header>
      
      {mobileOpen && (
          <div id="mobile-menu" className="mobile-menu body-text" role="menu" aria-label="Mobile primary" 
            style={{ 
                position: 'fixed', 
                top: `calc(24px + clamp(2.5rem, 6vw, 5rem) + 12px + 4px)`, 
                left: 0, right: 0, 
                backgroundColor: '#000', 
                zIndex: 49,
                padding: '20px',
                display: 'flex', flexDirection: 'column', gap: '20px',
                borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
            <Link href="/" role="menuitem" onClick={() => setMobileOpen(false)}>Home</Link>
            <Link href="/chat" role="menuitem" onClick={() => setMobileOpen(false)}>Chat</Link>
            <Link href="/contact" role="menuitem" onClick={() => setMobileOpen(false)}>Contact</Link>
          </div>
        )}
    </div>
  );
}
