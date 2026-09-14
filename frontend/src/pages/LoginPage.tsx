import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../lib/store';
import { Mail, Lock, Loader2, Wifi, WifiOff, Eye, EyeOff, GraduationCap, TrendingUp, Users, BookOpen, Award } from 'lucide-react';

export function LoginPage() {
  const navigate             = useNavigate();
  const loginWithCredentials = useAuthStore((s) => s.loginWithCredentials);
  const checkApiHealth       = useAuthStore((s) => s.checkApiHealth);
  const restoreSession       = useAuthStore((s) => s.restoreSession);
  const isApiAvailable       = useAuthStore((s) => s.isApiAvailable);
  const isLoading            = useAuthStore((s) => s.isLoading);
  const loginError           = useAuthStore((s) => s.loginError);
  const role                 = useAuthStore((s) => s.role);

  const [email,        setEmail]       = useState('');
  const [password,     setPassword]    = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [checkingApi,  setCheckingApi]  = useState(true);

  useEffect(() => { restoreSession(); }, [restoreSession]);

  useEffect(() => {
    if (role === 'college_admin') navigate('/college-dashboard');
    else if (role) navigate('/overview');
  }, [role, navigate]);

  useEffect(() => {
    (async () => {
      await checkApiHealth();
      setCheckingApi(false);
    })();
  }, [checkApiHealth]);

  const handleCredentialLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginWithCredentials(email, password);
      const updatedRole = useAuthStore.getState().role;
      if (updatedRole === 'college_admin') navigate('/college-dashboard');
      else navigate('/overview');
    } catch {
      // Error is set in the store
    }
  };

  const stats = [
    { icon: Users,      label: 'Faculty Members',  value: '60+' },
    { icon: BookOpen,   label: 'KPI Sections',      value: '12' },
    { icon: TrendingUp, label: 'Departments',        value: '2'  },
    { icon: Award,      label: 'Academic Year',      value: '25–26' },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Inter', sans-serif" }}>

      {/* ── Left: Brand Panel ── */}
      <div style={{
        display: 'none',
        flex: '0 0 48%',
        background: 'linear-gradient(145deg, #0d1b3e 0%, #0f2060 45%, #0d1b3e 100%)',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '52px 56px',
        position: 'relative',
        overflow: 'hidden',
      }} className="lg:flex">

        {/* Background decorations */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          {/* Glow blobs */}
          <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 65%)' }} />
          <div style={{ position: 'absolute', bottom: '-80px', right: '-60px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(20,184,166,0.15) 0%, transparent 65%)' }} />
          {/* Grid lines */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.06 }}>
            <defs>
              <pattern id="grid" width="44" height="44" patternUnits="userSpaceOnUse">
                <path d="M 44 0 L 0 0 0 44" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Top: logo + name */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '52px' }}>
            <div style={{
              width: '52px', height: '52px', borderRadius: '16px',
              background: 'linear-gradient(135deg, #6366f1, #14b8a6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(99,102,241,0.4)',
            }}>
              <GraduationCap size={26} color="white" />
            </div>
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                NMIT KPI Portal
              </div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', marginTop: '1px', letterSpacing: '0.02em' }}>
                Academic Performance Management
              </div>
            </div>
          </div>

          {/* Hero text */}
          <div>
            <h1 style={{
              fontSize: '2.8rem',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.15,
              letterSpacing: '-0.04em',
              marginBottom: '18px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              Track. Measure.<br />
              <span style={{
                background: 'linear-gradient(90deg, #818cf8, #2dd4bf)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Excel Together.
              </span>
            </h1>
            <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.58)', lineHeight: 1.75, maxWidth: '380px' }}>
              The official KPI management system for Nitte Meenakshi Institute of Technology — empowering departments to log, review, and analyse academic performance metrics in real time.
            </p>
          </div>
        </div>

        {/* Middle: stat cards */}
        <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '14px',
                padding: '18px 20px',
                backdropFilter: 'blur(8px)',
                transition: 'background 0.2s',
              }}>
                <Icon size={18} style={{ color: 'rgba(129,140,248,0.9)', marginBottom: '10px' }} />
                <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.03em', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {s.value}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.42)', marginTop: '2px', fontWeight: 500 }}>
                  {s.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom: institution name */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', marginBottom: '20px' }} />
          <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>
            Nitte Meenakshi Institute of Technology · Bengaluru · Established 2001
          </p>
        </div>
      </div>

      {/* ── Right: Form Panel ── */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f0f2f8',
        padding: '40px 24px',
        position: 'relative',
        overflowY: 'auto',
      }}>

        {/* Subtle background */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)' }} />
          <div style={{ position: 'absolute', bottom: '-40px', left: '-40px', width: '250px', height: '250px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(20,184,166,0.06) 0%, transparent 70%)' }} />
        </div>

        <div style={{ position: 'relative', width: '100%', maxWidth: '440px', animation: 'fadeIn 0.5s ease-out forwards' }}>

          {/* Mobile logo (shown only on mobile) */}
          <div style={{ textAlign: 'center', marginBottom: '36px' }} className="lg:hidden">
            <div style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: '64px', height: '64px', borderRadius: '20px',
              background: 'linear-gradient(135deg, #4f46e5, #0d9488)',
              marginBottom: '14px', boxShadow: '0 8px 24px rgba(79,70,229,0.3)',
            }}>
              <GraduationCap size={30} color="white" />
            </div>
            <h1 style={{ fontSize: '1.55rem', fontWeight: 800, color: '#0d1b3e', letterSpacing: '-0.03em', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              NMIT KPI Portal
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
              Nitte Meenakshi Institute of Technology
            </p>
          </div>

          {/* Form card */}
          <div style={{
            background: '#ffffff',
            borderRadius: '22px',
            border: '1px solid #e8edf5',
            boxShadow: '0 4px 6px rgba(15,28,64,0.04), 0 24px 48px rgba(15,28,64,0.09)',
            padding: '38px 36px',
          }}>
            {/* Heading */}
            <div style={{ marginBottom: '28px' }}>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0d1b3e', letterSpacing: '-0.03em', marginBottom: '6px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Welcome back
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                Sign in with your university credentials
              </p>
            </div>

            {/* API Status */}
            <div style={{ marginBottom: '22px' }}>
              {checkingApi ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', fontSize: '0.75rem', color: '#94a3b8' }}>
                  <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} />
                  Checking server connection...
                </span>
              ) : isApiAvailable ? (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '7px',
                  fontSize: '0.75rem', color: '#16a34a',
                  padding: '5px 12px', background: '#f0fdf4',
                  border: '1px solid #bbf7d0', borderRadius: '999px', fontWeight: 600,
                }}>
                  <Wifi size={12} />
                  Server connected · Ready to sign in
                </span>
              ) : (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '7px',
                  fontSize: '0.75rem', color: '#dc2626',
                  padding: '5px 12px', background: '#fef2f2',
                  border: '1px solid #fecaca', borderRadius: '999px', fontWeight: 600,
                }}>
                  <WifiOff size={12} />
                  Cannot reach server — check backend
                </span>
              )}
            </div>

            {/* Form */}
            <form onSubmit={handleCredentialLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

              {/* Email */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 650, color: '#1e293b', marginBottom: '7px', letterSpacing: '0.01em' }}>
                  <Mail size={13} color="#6366f1" />
                  Email Address
                </label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@nmit.ac.in"
                  required
                  style={{
                    width: '100%', padding: '12px 16px', fontSize: '0.9rem', fontWeight: 500,
                    color: '#0d1b3e', background: '#f8fafc',
                    border: '1.5px solid #e2e8f0', borderRadius: '12px', outline: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    fontFamily: 'inherit', boxSizing: 'border-box',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3.5px rgba(99,102,241,0.12)'; }}
                  onBlur={(e)  => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                />
              </div>

              {/* Password */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 650, color: '#1e293b', marginBottom: '7px', letterSpacing: '0.01em' }}>
                  <Lock size={13} color="#6366f1" />
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    style={{
                      width: '100%', padding: '12px 44px 12px 16px', fontSize: '0.9rem', fontWeight: 500,
                      color: '#0d1b3e', background: '#f8fafc',
                      border: '1.5px solid #e2e8f0', borderRadius: '12px', outline: 'none',
                      transition: 'border-color 0.2s, box-shadow 0.2s',
                      fontFamily: 'inherit', boxSizing: 'border-box',
                    }}
                    onFocus={(e) => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3.5px rgba(99,102,241,0.12)'; }}
                    onBlur={(e)  => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '2px', display: 'flex' }}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {loginError && (
                <div style={{
                  padding: '12px 16px', background: '#fef2f2',
                  border: '1px solid #fecaca', borderRadius: '12px',
                  fontSize: '0.82rem', color: '#dc2626', fontWeight: 500,
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#dc2626', flexShrink: 0 }} />
                  {loginError}
                </div>
              )}

              {/* Submit */}
              <button
                id="btn-login"
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%', padding: '13px', marginTop: '4px',
                  borderRadius: '12px', border: 'none',
                  cursor: isLoading ? 'wait' : 'pointer',
                  background: isLoading
                    ? 'linear-gradient(135deg, #818cf8, #5eead4)'
                    : 'linear-gradient(135deg, #4f46e5, #0d9488)',
                  color: '#ffffff',
                  fontSize: '0.92rem', fontWeight: 700, fontFamily: 'inherit',
                  boxShadow: isLoading ? 'none' : '0 4px 14px rgba(79,70,229,0.35)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  opacity: isLoading ? 0.8 : 1,
                  transition: 'all 0.2s',
                  letterSpacing: '0.01em',
                }}
                onMouseEnter={(e) => { if (!isLoading) { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 20px rgba(79,70,229,0.45)'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'; } }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 14px rgba(79,70,229,0.35)'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; }}
              >
                {isLoading && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
                {isLoading ? 'Signing in...' : 'Sign In to Portal'}
              </button>
            </form>
          </div>

          {/* Credentials hint */}
          {isApiAvailable && (
            <div style={{
              marginTop: '20px',
              background: '#ffffff',
              borderRadius: '14px',
              border: '1px solid #e8edf5',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(15,28,64,0.04)',
            }}>
              <div style={{ padding: '12px 18px', background: 'linear-gradient(90deg, #eef2ff, #f0fdfa)', borderBottom: '1px solid #e8edf5', display: 'flex', alignItems: 'center', gap: '7px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6366f1' }} />
                <span style={{ fontSize: '0.75rem', color: '#4f46e5', fontWeight: 700, letterSpacing: '0.02em' }}>
                  DEMO CREDENTIALS
                </span>
              </div>
              <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { role: 'HOD (CSBS)',     email: 'hod.csbs@nmit.ac.in',       pass: 'nmit@2026', color: '#4f46e5' },
                  { role: 'HOD (MECH)',     email: 'hod.mech@nmit.ac.in',       pass: 'nmit@2026', color: '#4f46e5' },
                  { role: 'Faculty',         email: 'faculty1.csbs@nmit.ac.in',  pass: 'nmit@2026', color: '#059669' },
                  { role: 'Dean',            email: 'dean@nmit.ac.in',           pass: 'nmit@2026', color: '#7c3aed' },
                  { role: 'College Admin',   email: 'collegeadmin@nmit.ac.in',   pass: 'nmit@2026', color: '#0891b2' },
                ].map((c) => (
                  <div key={c.email} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.73rem' }}>
                    <span style={{ padding: '2px 7px', background: `${c.color}12`, color: c.color, borderRadius: '6px', fontWeight: 700, fontSize: '0.68rem', whiteSpace: 'nowrap', border: `1px solid ${c.color}20` }}>
                      {c.role}
                    </span>
                    <span style={{ color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{c.email}</span>
                    <span style={{ color: '#94a3b8', whiteSpace: 'nowrap', fontFamily: 'monospace', fontSize: '0.72rem' }}>/ {c.pass}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p style={{ textAlign: 'center', fontSize: '0.73rem', color: '#94a3b8', marginTop: '18px' }}>
            © 2025–26 Nitte Meenakshi Institute of Technology. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
