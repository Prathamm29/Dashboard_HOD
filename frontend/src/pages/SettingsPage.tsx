import { Settings as SettingsIcon, Palette, Bell, Database, Moon, Sun, Info } from 'lucide-react';
import { useThemeStore, useDeptStore } from '../lib/store';

export function SettingsPage() {
  const isDark      = useThemeStore((s) => s.isDark);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const dept        = useDeptStore((s) => s.getSelectedDept());

  const sectionStyle: React.CSSProperties = {
    background: 'var(--bg-card)',
    borderRadius: '16px',
    border: '1px solid var(--border-color)',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-card-val)',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    fontSize: '0.875rem',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    background: 'var(--bg-surface)',
    border: '1.5px solid var(--border-color)',
    borderRadius: '10px',
    padding: '10px 14px',
    outline: 'none',
    fontFamily: 'inherit',
    cursor: 'not-allowed',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>

      {/* ── Page Header ── */}
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Settings
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          Application preferences and system configuration
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '18px' }}>

        {/* ── Department Info ── */}
        <div style={sectionStyle}>
          <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--border-faint)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'linear-gradient(135deg, #eef2ff, #e0e7ff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <SettingsIcon size={16} style={{ color: '#6366f1' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 750, color: 'var(--text-primary)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Department</h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-faint)', marginTop: '1px' }}>Current department information</p>
            </div>
          </div>
          <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 650, color: 'var(--text-label)', marginBottom: '7px', letterSpacing: '0.01em' }}>
                Department Name
              </label>
              <input id="dept-name" type="text" value={dept.name} style={inputStyle} readOnly />
              <p style={{ fontSize: '0.72rem', color: 'var(--text-faint)', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Info size={11} /> Switch departments via the filter rail on the overview page.
              </p>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 650, color: 'var(--text-label)', marginBottom: '7px', letterSpacing: '0.01em' }}>
                Institution
              </label>
              <input id="institution" type="text" defaultValue="Nitte Meenakshi Institute of Technology" style={inputStyle} readOnly />
            </div>
          </div>
        </div>

        {/* ── Appearance ── */}
        <div style={sectionStyle}>
          <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--border-faint)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: isDark ? 'linear-gradient(135deg, #1e2d48, #1a2744)' : 'linear-gradient(135deg, #fef9c3, #fef3c7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isDark ? <Moon size={16} style={{ color: '#818cf8' }} /> : <Sun size={16} style={{ color: '#d97706' }} />}
            </div>
            <div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 750, color: 'var(--text-primary)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Appearance</h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-faint)', marginTop: '1px' }}>Theme and display preferences</p>
            </div>
          </div>
          <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Dark mode row */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 18px', borderRadius: '12px',
              border: `1.5px solid ${isDark ? 'rgba(129,140,248,0.3)' : 'var(--border-color)'}`,
              background: isDark ? 'rgba(99,102,241,0.07)' : 'var(--bg-surface)',
              transition: 'all 0.25s',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '12px',
                  background: isDark ? 'rgba(99,102,241,0.15)' : '#fef9c3',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {isDark
                    ? <Moon size={20} style={{ color: '#818cf8' }} />
                    : <Sun size={20} style={{ color: '#d97706' }} />
                  }
                </div>
                <div>
                  <p style={{ fontSize: '0.875rem', fontWeight: 650, color: 'var(--text-primary)' }}>
                    {isDark ? 'Dark Mode' : 'Light Mode'}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1px' }}>
                    {isDark ? 'Currently using dark theme' : 'Currently using light theme'}
                  </p>
                </div>
              </div>

              {/* Toggle */}
              <button
                id="dark-mode-toggle"
                onClick={toggleTheme}
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                style={{
                  width: '52px', height: '28px', borderRadius: '999px',
                  border: 'none',
                  background: isDark ? 'linear-gradient(135deg, #4f46e5, #6366f1)' : '#e2e8f0',
                  cursor: 'pointer', position: 'relative',
                  transition: 'background 0.28s ease', flexShrink: 0,
                  boxShadow: isDark ? '0 2px 8px rgba(99,102,241,0.35)' : 'none',
                }}
              >
                <span style={{
                  width: '20px', height: '20px', borderRadius: '50%',
                  background: 'white',
                  position: 'absolute', top: '4px',
                  left: isDark ? '28px' : '4px',
                  transition: 'left 0.28s cubic-bezier(0.4,0,0.2,1)',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
                }} />
              </button>
            </div>

            <p style={{ fontSize: '0.76rem', color: 'var(--text-faint)', background: 'var(--bg-surface)', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', lineHeight: 1.6 }}>
              Dark mode reduces eye strain in low-light environments. Your preference is saved automatically.
            </p>
          </div>
        </div>

        {/* ── Notification Preferences ── */}
        <div style={sectionStyle}>
          <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--border-faint)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'linear-gradient(135deg, #fdf4ff, #f3e8ff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bell size={16} style={{ color: '#9333ea' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 750, color: 'var(--text-primary)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Notification Preferences</h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-faint)', marginTop: '1px' }}>Control which alerts you receive</p>
            </div>
          </div>
          <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { label: 'KPI submission reminders',         desc: 'Deadline and period alerts',    defaultChecked: true  },
              { label: 'LMS compliance alerts',            desc: 'Non-compliance notifications',  defaultChecked: true  },
              { label: 'Research & publication updates',   desc: 'New publications and patents',  defaultChecked: true  },
              { label: 'System notifications',             desc: 'Server and maintenance alerts', defaultChecked: false },
            ].map((pref) => (
              <label key={pref.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', transition: 'border-color 0.15s' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLLabelElement).style.borderColor = '#a5b4fc'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLLabelElement).style.borderColor = 'var(--border-color)'; }}
              >
                <div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 550, color: 'var(--text-secondary)', display: 'block' }}>{pref.label}</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-faint)' }}>{pref.desc}</span>
                </div>
                <input
                  type="checkbox"
                  defaultChecked={pref.defaultChecked}
                  style={{ width: '17px', height: '17px', accentColor: '#6366f1', cursor: 'pointer', flexShrink: 0 }}
                />
              </label>
            ))}
          </div>
        </div>

        {/* ── Data Connection ── */}
        <div style={sectionStyle}>
          <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--border-faint)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Database size={16} style={{ color: '#16a34a' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 750, color: 'var(--text-primary)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Data Connection</h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-faint)', marginTop: '1px' }}>Backend API and integration status</p>
            </div>
          </div>
          <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { label: 'Backend API',    status: 'Connected',     color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
              { label: 'PostgreSQL DB',  status: 'Connected',     color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
              { label: 'Power BI Report', status: 'Not Configured', color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
              { label: 'Cloudinary CDN', status: 'Optional',      color: '#0891b2', bg: '#f0f9ff', border: '#bae6fd' },
            ].map((conn) => (
              <div key={conn.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{conn.label}</span>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: conn.color, background: conn.bg, padding: '3px 10px', borderRadius: '999px', border: `1px solid ${conn.border}` }}>
                  {conn.status}
                </span>
              </div>
            ))}

            <p style={{ fontSize: '0.75rem', color: 'var(--text-faint)', background: 'var(--bg-surface)', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', lineHeight: 1.6, marginTop: '4px' }}>
              See <code style={{ fontFamily: 'monospace', background: 'var(--border-color)', padding: '1px 5px', borderRadius: '4px', fontSize: '0.73rem' }}>README.md</code> for Power BI integration setup instructions.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
