"use client";
import React, { useState, useRef, useEffect } from "react";
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
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; content: string }[]>([
    { role: 'bot', content: 'Hello! I am AURA. How can I assist you today?' }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
        const timer = setTimeout(() => setShowLoginPrompt(true), 1500);
        return () => clearTimeout(timer);
    } else {
      fetch('http://127.0.0.1:8000/api/chat/history', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Failed to fetch history');
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const history = data.map((msg: any) => ({
            role: (msg.role === 'assistant' ? 'bot' : 'user') as 'user' | 'bot',
            content: msg.message
          }));
          setMessages([
            { role: 'bot', content: 'Hello! I am AURA. How can I assist you today?' },
            ...history
          ]);
        }
      })
      .catch(err => console.error('Error fetching history:', err));
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = inputValue;
    const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(newMessages);
    setInputValue("");
    setIsLoading(true);

    const token = localStorage.getItem('token');
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/chat', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ question: userMessage }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'bot', content: data.answer }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { role: 'bot', content: "Sorry, something went wrong. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', position: 'relative', backgroundColor: '#000000' }}>
      {showLoginPrompt && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(8px)',
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{
            backgroundColor: '#000',
            border: '1px solid rgba(82, 39, 255, 0.5)',
            padding: '40px',
            borderRadius: '24px',
            maxWidth: '450px',
            width: '90%',
            textAlign: 'center',
            boxShadow: '0 0 50px rgba(82, 39, 255, 0.2)',
            position: 'relative'
          }}>
            <button 
                onClick={() => setShowLoginPrompt(false)}
                style={{
                    position: 'absolute',
                    top: '15px',
                    right: '15px',
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255,255,255,0.5)',
                    cursor: 'pointer',
                    padding: '5px'
                }}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(82, 39, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#5227FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="8.5" cy="7" r="4"></circle>
                        <line x1="20" y1="8" x2="20" y2="14"></line>
                        <line x1="23" y1="11" x2="17" y2="11"></line>
                    </svg>
                </div>
            </div>
            <h3 className="heading" style={{ color: 'white', marginBottom: '12px', fontSize: '1.8rem' }}>Unlock Full Experience</h3>
            <p className="body-text" style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '30px', lineHeight: '1.6', fontSize: '1rem' }}>
              Login to AURA to automatically save your chat history, access personalized data, and pick up where you left off.
            </p>
            <div style={{ display: 'flex', gap: '15px', flexDirection: 'column' }}>
              <Link href="/login" style={{
                padding: '14px 24px',
                background: 'linear-gradient(90deg, #5227FF 0%, #8A5CFF 100%)',
                color: 'white',
                borderRadius: '12px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                display: 'block',
                width: '100%',
                boxSizing: 'border-box'
              }}>
                Login / Signup
              </Link>
              <button 
                onClick={() => setShowLoginPrompt(false)}
                className="body-text"
                style={{
                  padding: '14px 24px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.8)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 500,
                  width: '100%'
                }}
              >
                Continue as Guest
              </button>
            </div>
          </div>
        </div>
      )}

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

      <main style={{ position: 'relative', zIndex: 10, paddingTop: '170px', minHeight: '100vh', display: 'flex', justifyContent: 'center', width: '100%' }}>
        <div style={{ 
          width: 'calc(100% - 40px)', 
          maxWidth: '800px', 
          height: '70vh', 
          backgroundColor: 'transparent',
          backdropFilter: 'blur(70px)',
          borderRadius: '20px', 
          border: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex', 
          flexDirection: 'column',
          overflow: 'hidden',
          margin: '0 20px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
        }}>
          <div 
            data-lenis-prevent
            style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}
          >
            {messages.map((msg, index) => (
              <div key={index} className="body-text" style={{ 
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '80%',
                padding: '12px 16px',
                borderRadius: '12px',
                backgroundColor: msg.role === 'user' ? '#5227FF' : 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                borderBottomRightRadius: msg.role === 'user' ? '2px' : '12px',
                borderBottomLeftRadius: msg.role === 'bot' ? '2px' : '12px',
                lineHeight: '1.5',
                fontSize: '0.95rem'
              }}>
                {msg.content}
              </div>
            ))}
            {isLoading && (
              <div style={{ 
                alignSelf: 'flex-start',
                padding: '12px 16px',
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderBottomLeftRadius: '2px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                width: 'fit-content'
              }}>
                <div style={{ width: '8px', height: '8px', backgroundColor: '#fff', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '-0.32s' }}></div>
                <div style={{ width: '8px', height: '8px', backgroundColor: '#fff', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '-0.16s' }}></div>
                <div style={{ width: '8px', height: '8px', backgroundColor: '#fff', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both' }}></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} style={{ 
            padding: '20px', 
            borderTop: '1px solid rgba(255, 255, 255, 0.1)', 
            display: 'flex', 
            gap: '10px',
            backgroundColor: 'rgba(0, 0, 0, 0.3)'
          }}>
            <input 
              type="text" 
              className="body-text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              style={{
                flex: 1,
                minWidth: 0,
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: '#fff',
                outline: 'none',
                fontSize: '1rem'
              }}
            />
            <button
              type="button"
              onClick={() => console.log("Voice input clicked")}
              style={{
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.2s'
              }}
              title="Voice Input"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            </button>
            <button 
              type="submit"
              style={{
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(90deg, #5227FF 0%, #8A5CFF 100%)',
                color: '#fff',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'opacity 0.2s'
              }}
            >
              Send
            </button>
          </form>
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
        <Link href="/" aria-label="Home">
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
        </Link>
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
          <NavLink href="/chat" isActive>Chat</NavLink>
          <div style={{ width: '1px', height: '28px', backgroundColor: 'rgba(255,255,255,0.3)' }} />
          <NavLink href="/contact">Contact</NavLink>
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
