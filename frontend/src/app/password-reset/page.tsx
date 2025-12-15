"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DotGrid from "@/components/DotGrid";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import useLenis from "@/lib/uselenis";
import TextType from "@/components/TextType";

export default function PasswordResetPage() {
  useLenis({ lerp: 0.07 });
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSendOTP = async () => {
    if (!email) {
      setError("Please enter your email");
      return;
    }
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("https://aura-ceoi.onrender.com/auth/request-password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Failed to send OTP");

      setMessage("OTP sent successfully to your email");
      setStep(2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      setError("Please enter the OTP");
      return;
    }
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("https://aura-ceoi.onrender.com/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Invalid OTP");

      setMessage("OTP verified successfully");
      setStep(3);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("https://aura-ceoi.onrender.com/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          otp, 
          new_password: newPassword 
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Failed to reset password");

      setMessage("Password reset successful! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', position: 'relative', backgroundColor: '#000000', overflow: 'hidden' }}>
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
        <Link href="/" style={{ textDecoration: 'none' }}>
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
                color: 'white'
            }}
            >
            AURA
            </h1>
        </Link>
        
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

      <div style={{ 
        position: 'relative', 
        zIndex: 10, 
        display: 'flex', 
        minHeight: '100vh', 
        paddingTop: `calc(24px + clamp(2.5rem, 6vw, 5rem) + 12px + 4px)`,
        flexWrap: 'wrap'
      }}>
        
        <div style={{ 
            flex: '1 1 500px', 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center', 
            alignItems: 'center',
            padding: '20px'
        }}>
            <div style={{ width: '100%', maxWidth: '600px' }}>
                <DotLottieReact
                    src="https://lottie.host/8164e882-54f0-42b8-b02c-bb5246edafbf/0JY19XUI2s.lottie"
                    loop
                    autoplay
                    style={{ width: '100%', height: '100%' }}
                />
            </div>
            <div style={{ marginTop: '20px' }}>
                <TextType 
                  text={["Secure your account", "Reset your password", "Stay safe!"]}
                  typingSpeed={75}
                  pauseDuration={1500}
                  showCursor={true}
                  cursorCharacter="_"
                  className="body-text text-white"
                />
            </div>
        </div>

        <div style={{ 
            flex: '1 1 400px', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            padding: '20px'
        }}>
            <div style={{ 
                backgroundColor: '#000000', 
                padding: '40px', 
                borderRadius: '20px', 
                border: '1px solid rgba(82, 39, 255, 0.3)',
                width: '100%', 
                maxWidth: '450px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
            }}>
                <h2 className="heading" style={{ color: 'white', marginBottom: '30px', fontSize: '2rem', textAlign: 'center' }}>
                  {step === 3 ? "New Password" : "Reset Password"}
                </h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    {/* Step 1 & 2: Email and OTP */}
                    {step < 3 && (
                      <>
                        <div>
                            <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', fontSize: '0.9rem' }}>Email</label>
                            <input 
                                type="email" 
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={step > 1}
                                style={{ 
                                    width: '100%', 
                                    padding: '12px 16px', 
                                    backgroundColor: 'rgba(255,255,255,0.05)', 
                                    border: '1px solid rgba(255,255,255,0.1)', 
                                    borderRadius: '8px',
                                    color: 'white',
                                    outline: 'none',
                                    fontSize: '1rem',
                                    opacity: step > 1 ? 0.5 : 1
                                }}
                            />
                            {step === 1 && (
                              <div style={{ textAlign: 'right', marginTop: '8px' }}>
                                <button 
                                  onClick={handleSendOTP}
                                  disabled={loading}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#8A5CFF',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    padding: 0
                                  }}
                                >
                                  {loading ? "Sending..." : "Send OTP"}
                                </button>
                              </div>
                            )}
                        </div>

                        {step === 2 && (
                          <div style={{ animation: 'fadeIn 0.5s ease' }}>
                              <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', fontSize: '0.9rem' }}>Enter OTP</label>
                              <input 
                                  type="text" 
                                  placeholder="Enter OTP"
                                  value={otp}
                                  onChange={(e) => setOtp(e.target.value)}
                                  style={{ 
                                      width: '100%', 
                                      padding: '12px 16px', 
                                      backgroundColor: 'rgba(255,255,255,0.05)', 
                                      border: '1px solid rgba(255,255,255,0.1)', 
                                      borderRadius: '8px',
                                      color: 'white',
                                      outline: 'none',
                                      fontSize: '1rem',
                                      letterSpacing: '2px'
                                  }}
                              />
                              <button 
                                onClick={handleVerifyOTP}
                                disabled={loading}
                                style={{
                                    marginTop: '20px',
                                    width: '100%',
                                    padding: '14px',
                                    background: 'linear-gradient(90deg, #5227FF 0%, #8A5CFF 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    opacity: loading ? 0.7 : 1,
                                    transition: 'opacity 0.2s'
                                }}
                              >
                                {loading ? "Verifying..." : "Verify OTP"}
                              </button>
                              <div style={{ textAlign: 'center', marginTop: '15px' }}>
                                <button 
                                  onClick={handleSendOTP}
                                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '0.85rem' }}
                                >
                                  Resend OTP
                                </button>
                              </div>
                          </div>
                        )}
                      </>
                    )}

                    {step === 3 && (
                      <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '20px', animation: 'fadeIn 0.5s ease' }}>
                        <div>
                            <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', fontSize: '0.9rem' }}>New Password</label>
                            <div style={{ position: 'relative' }}>
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    style={{ 
                                        width: '100%', 
                                        padding: '12px 40px 12px 16px', 
                                        backgroundColor: 'rgba(255,255,255,0.05)', 
                                        border: '1px solid rgba(255,255,255,0.1)', 
                                        borderRadius: '8px',
                                        color: 'white',
                                        outline: 'none',
                                        fontSize: '1rem'
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '12px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: 'rgba(255,255,255,0.6)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: 0
                                    }}
                                >
                                    {showPassword ? (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                            <line x1="1" y1="1" x2="23" y2="23"></line>
                                        </svg>
                                    ) : (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                            <circle cx="12" cy="12" r="3"></circle>
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', fontSize: '0.9rem' }}>Confirm New Password</label>
                            <input 
                                type="password" 
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                style={{ 
                                    width: '100%', 
                                    padding: '12px 16px', 
                                    backgroundColor: 'rgba(255,255,255,0.05)', 
                                    border: '1px solid rgba(255,255,255,0.1)', 
                                    borderRadius: '8px',
                                    color: 'white',
                                    outline: 'none',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>

                        <button 
                            type="submit"
                            disabled={loading}
                            style={{
                                marginTop: '10px',
                                padding: '14px',
                                background: 'linear-gradient(90deg, #5227FF 0%, #8A5CFF 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                fontWeight: 600,
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.7 : 1,
                                transition: 'opacity 0.2s'
                            }}
                        >
                            {loading ? "Resetting..." : "Change Password"}
                        </button>
                      </form>
                    )}

                    {error && (
                        <div style={{ color: '#ff4d4d', fontSize: '0.9rem', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}
                    
                    {message && (
                        <div style={{ color: '#4dff4d', fontSize: '0.9rem', textAlign: 'center' }}>
                            {message}
                        </div>
                    )}
                    
                    <div style={{ textAlign: 'center', marginTop: '10px' }}>
                        <Link href="/login" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '0.9rem' }}>Back to Login</Link>
                    </div>
                </div>
            </div>
        </div>

      </div>

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
    </div>
  );
}
