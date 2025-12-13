"use client";
import Link from "next/link";  
import Image from "next/image";
import React, { useState } from "react";
import DotGrid from "@/components/DotGrid";
import useLenis from "@/lib/uselenis";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

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

const SocialLink = ({ href, ariaLabel, children }: { href: string; ariaLabel: string; children: React.ReactNode }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        color: isHovered ? '#ffffff' : 'rgba(255,255,255,0.7)',
        transform: isHovered ? 'translateY(-3px) scale(1.1)' : 'translateY(0) scale(1)',
        transition: 'all 0.3s ease',
        display: 'inline-block',
        filter: isHovered ? 'drop-shadow(0 0 8px rgba(82, 39, 255, 0.6))' : 'none',
      }}
    >
      {children}
    </Link>
  );
};

export default function Home() {
  useLenis({ lerp: 0.07 });
  const [mobileOpen, setMobileOpen] = useState(false);

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
          resistance={750 }
          returnDuration={1.5}
          style={{ width: '100%', height: '100%' } as React.CSSProperties}
        />
      </div>
      <section style={{ height: '100vh', width: '100%', position: 'relative', overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 30,
            display: 'flex',
            marginLeft: 'auto',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'auto',
            width: '100%',
            maxWidth: '100%',
          }}
        >
          <div style={{ width: 'clamp(300px, 85vw, 600px)', height: 'auto' }}>
            <DotLottieReact
              src="https://lottie.host/e62ea004-b3f7-4795-9b69-1f9fe429b1c7/RPtfaJg4pe.lottie"
              loop
              autoplay
              style={{ width: '100%', height: '100%' }}
            />
          </div>
          
          <div style={{ maxWidth: '500px', textAlign: 'center', marginTop: '20px', padding: '0 20px' }}>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', lineHeight: '1.5', marginBottom: '24px' }} className="body-text">
              AURA (Adamas University Retrieval Assistant) is an intelligent chatbot designed to instantly answer student queries about admissions, courses, fees, faculty, campus services, and more using university-verified information.
            </p>
            <Link href="/chat" style={{
              display: 'inline-block',
              padding: '12px 32px',
              background: 'linear-gradient(90deg, #5227FF 0%, #8A5CFF 100%)',
              color: 'white',
              borderRadius: '30px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '1rem',
              boxShadow: '0 4px 15px rgba(82, 39, 255, 0.4)',
            }} className="body-text">
              Start Chat
            </Link>
          </div>
        </div>
      </section>

      <section style={{ padding: '100px 24px', position: 'relative', zIndex: 10 }}>
        <h2 className="heading text-white" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', textAlign: 'center', marginBottom: '60px', fontWeight: 700 }}>Meet the Developer</h2>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ 
            width: '180px', 
            height: '180px', 
            borderRadius: '50%', 
            overflow: 'hidden', 
            border: '2px solid rgba(82, 39, 255, 0.5)', 
            marginBottom: '24px', 
            position: 'relative', 
            boxShadow: '0 0 30px rgba(82, 39, 255, 0.2)' 
          }}>
            <Image src="/me.png" alt="ard.dev" fill style={{ objectFit: 'cover' }} />
          </div>
          <h3 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 600, letterSpacing: '1px' }}>ard.dev</h3>
          <p className="text-white/60 text-sm">Full-Stack Dev | Web3 | Blockchain </p>
          <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
            <SocialLink href="#" ariaLabel="GitHub">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405 1.02 0 2.04.135 3 .405 2.28-1.56 3.285-1.23 3.285-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </SocialLink>
            <SocialLink href="#" ariaLabel="Twitter">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </SocialLink>
            <SocialLink href="#" ariaLabel="LinkedIn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </SocialLink>
          </div>
        </div>
      </section>

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
          <NavLink href="/" isActive >Home</NavLink>
          <div style={{ width: '1px', height: '28px', backgroundColor: 'rgba(255,255,255,0.3)' }} />
          <NavLink href="/chat">Chat</NavLink>
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
