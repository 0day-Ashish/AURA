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
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; content: string }[]>([
    { role: 'bot', content: 'Hello! I am AURA. How can I assist you today?' }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMessages = [...messages, { role: 'user' as const, content: inputValue }];
    setMessages(newMessages);
    setInputValue("");
    setIsLoading(true);

    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'bot', content: "I'm processing your request... (Backend integration pending)" }]);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', position: 'relative', backgroundColor: '#000000' }}>
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `}</style>
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
          width: '100%', 
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
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {messages.map((msg, index) => (
              <div key={index} style={{ 
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
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              style={{
                flex: 1,
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
