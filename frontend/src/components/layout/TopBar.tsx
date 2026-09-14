import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, Bell, ChevronRight } from 'lucide-react';
import { useAuthStore, useNotificationStore, useKpiStore, useDeptStore } from '../../lib/store';
import { useState, useRef, useEffect } from 'react';
import { useNotificationStore as useNS } from '../../lib/store';

interface TopBarProps {
  onMenuClick: () => void;
  sidebarCollapsed: boolean;
}

const routeLabels: Record<string, string> = {
  '/overview':          'Overview',
  '/college-dashboard': 'College Dashboard',
  '/kpi-entry':         'KPI Data Entry',
  '/my-kpi':            'My KPI Entry',
  '/review':            'Review Submissions',
  '/faculty':           'Faculty',
  '/publications':      'Publications & Research',
  '/placements':        'Placements',
  '/reports':           'Reports',
  '/notifications':     'Notifications',
  '/settings':          'Settings',
};

export function TopBar({ onMenuClick }: TopBarProps) {
  const location    = useLocation();
  const navigate    = useNavigate();
  const role        = useAuthStore((s) => s.role);
  const user        = useAuthStore((s) => s.user);
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const currentPeriodId = useKpiStore((s) => s.currentPeriodId);
  const submissions     = useKpiStore((s) => s.submissions);
  const dept            = useDeptStore((s) => s.getSelectedDept());
  const notifications   = useNS((s) => s.notifications);
  const markAsRead      = useNS((s) => s.markAsRead);

  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const currentLabel  = routeLabels[location.pathname] || 'Dashboard';
  const lastUpdated   = submissions[currentPeriodId]?.lastUpdated;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roleConfig = {
    hod:           { label: 'Head of Dept.', abbr: 'HOD', bg: 'linear-gradient(135deg,#4f46e5,#6366f1)', badge: '#eef2ff', badgeText: '#4f46e5' },
    college_admin: { label: 'College Admin',  abbr: 'CA',  bg: 'linear-gradient(135deg,#7c3aed,#9333ea)', badge: '#f5f3ff', badgeText: '#7c3aed' },
    management:    { label: 'Dean',           abbr: 'DN',  bg: 'linear-gradient(135deg,#6d28d9,#7c3aed)', badge: '#f5f3ff', badgeText: '#6d28d9' },
    faculty:       { label: 'Faculty',        abbr: 'FC',  bg: 'linear-gradient(135deg,#059669,#10b981)', badge: '#ecfdf5', badgeText: '#059669' },
  };
  const rc = roleConfig[role as keyof typeof roleConfig] || roleConfig.faculty;

  const initials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : rc.abbr;

  const displayName = user?.name || rc.label;

  const recentNotifs  = notifications.slice(0, 6);
  const severityColor = (s: string) => s === 'error' ? '#ef4444' : s === 'warning' ? '#f59e0b' : '#6366f1';

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '68px',
      padding: '0 24px',
      background: 'var(--bg-topbar)',
      borderBottom: '1px solid var(--border-color)',
      flexShrink: 0,
      gap: '12px',
      boxShadow: 'var(--shadow-topbar)',
      position: 'relative',
      zIndex: 30,
    }}>

      {/* ── Left: hamburger + breadcrumb ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
        <button
          onClick={onMenuClick}
          className="lg:hidden"
          style={{ display: 'flex', padding: '8px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', cursor: 'pointer', color: 'var(--text-muted)', flexShrink: 0, transition: 'all 0.15s' }}
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>

        {/* Breadcrumb */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', overflow: 'hidden' }}>
          <span style={{ color: 'var(--text-faint)', whiteSpace: 'nowrap', fontWeight: 500 }}>NMIT</span>
          <ChevronRight size={13} style={{ color: 'var(--border-strong)', flexShrink: 0 }} />

          {/* Dept / Role pill */}
          {(role === 'college_admin' || role === 'management') ? (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              padding: '3px 10px', borderRadius: '999px',
              background: rc.badge, color: rc.badgeText,
              fontSize: '0.74rem', fontWeight: 650, whiteSpace: 'nowrap',
              border: `1px solid ${rc.badgeText}25`, flexShrink: 0,
            }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: rc.badgeText, display: 'inline-block' }} />
              {rc.label}
            </span>
          ) : (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              padding: '3px 10px', borderRadius: '999px',
              background: `${dept.color}12`, color: dept.color,
              fontSize: '0.74rem', fontWeight: 650, whiteSpace: 'nowrap',
              border: `1px solid ${dept.color}28`, flexShrink: 0,
            }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: dept.color, display: 'inline-block' }} />
              {dept.shortName}
            </span>
          )}

          <ChevronRight size={13} style={{ color: 'var(--border-strong)', flexShrink: 0 }} />
          <span style={{ fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {currentLabel}
          </span>
        </nav>
      </div>

      {/* ── Right: updated + bell + user ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>

        {/* Last updated — desktop only */}
        {lastUpdated && (
          <span style={{ fontSize: '0.72rem', color: 'var(--text-faint)', whiteSpace: 'nowrap', display: 'none' }} className="lg:block">
            Updated {new Date(lastUpdated).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          </span>
        )}

        {/* Notification Bell */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            style={{
              position: 'relative',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '40px', height: '40px',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              background: notifOpen ? '#eef2ff' : 'var(--bg-surface)',
              cursor: 'pointer',
              transition: 'all 0.18s',
              color: notifOpen ? '#6366f1' : 'var(--text-muted)',
            }}
            aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute', top: '6px', right: '6px',
                width: '8px', height: '8px',
                borderRadius: '50%',
                background: '#f43f5e',
                border: '1.5px solid white',
                animation: 'pulseSoft 2s ease-in-out infinite',
              }} />
            )}
          </button>

          {/* Notification Dropdown */}
          {notifOpen && (
            <div style={{
              position: 'absolute', right: 0, top: 'calc(100% + 10px)',
              width: '368px',
              background: 'var(--bg-card)',
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              boxShadow: '0 8px 40px rgba(15,28,64,0.14)',
              zIndex: 100,
              overflow: 'hidden',
              animation: 'scaleIn 0.18s ease-out forwards',
            }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-faint)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Notifications</span>
                  {unreadCount > 0 && (
                    <span style={{ marginLeft: '8px', fontSize: '0.72rem', background: '#eef2ff', color: '#4f46e5', padding: '2px 8px', borderRadius: '999px', fontWeight: 650 }}>
                      {unreadCount} new
                    </span>
                  )}
                </div>
              </div>

              <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
                {recentNotifs.length === 0 ? (
                  <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--text-faint)', fontSize: '0.85rem' }}>
                    No notifications yet
                  </div>
                ) : recentNotifs.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markAsRead(n.id)}
                    style={{
                      display: 'flex', gap: '12px', padding: '14px 20px',
                      borderBottom: '1px solid var(--border-faint)',
                      cursor: 'pointer',
                      background: n.read ? 'transparent' : '#fafbff',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-surface)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = n.read ? 'transparent' : '#fafbff'; }}
                  >
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: n.read ? '#cbd5e1' : severityColor(n.severity), flexShrink: 0, marginTop: '6px' }} />
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>{n.message}</p>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-faint)', marginTop: '3px' }}>
                        {new Date(n.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
                <button
                  onClick={() => { setNotifOpen(false); navigate('/notifications'); }}
                  style={{ fontSize: '0.8rem', color: '#6366f1', fontWeight: 650, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  View all notifications →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User / Role Card */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '6px 12px 6px 6px',
          borderRadius: '12px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          cursor: 'default',
          transition: 'all 0.18s',
        }}>
          {/* Avatar */}
          <div style={{
            width: '32px', height: '32px',
            borderRadius: '9px',
            background: rc.bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: '0.72rem', fontWeight: 800,
            flexShrink: 0,
            letterSpacing: '0.02em',
          }}>
            {initials}
          </div>
          <div style={{ display: 'none' }} className="lg:block">
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2, fontFamily: "'Plus Jakarta Sans', sans-serif", maxWidth: '120px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {displayName}
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-faint)', fontWeight: 500 }}>{rc.label}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
