import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardEdit,
  Users,
  BookOpen,
  Briefcase,
  FileBarChart,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
  LogOut,
  Building2,
} from 'lucide-react';
import { useAuthStore } from '../../lib/store';
import { useNotificationStore } from '../../lib/store';
import { useDeptStore } from '../../lib/store';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const navItems = [
  { path: '/overview',          label: 'Overview',            icon: LayoutDashboard, roles: ['hod','management','faculty','college_admin'], color: '#818cf8', glow: 'rgba(99,102,241,0.35)' },
  { path: '/college-dashboard', label: 'College Dashboard',   icon: Building2,       roles: ['college_admin','management'],                 color: '#c084fc', glow: 'rgba(192,132,252,0.35)' },
  { path: '/my-kpi',            label: 'My KPI Entry',        icon: ClipboardEdit,   roles: ['faculty'],                                    color: '#a78bfa', glow: 'rgba(167,139,250,0.35)' },
  { path: '/kpi-entry',         label: 'Department KPI',      icon: ClipboardEdit,   roles: ['hod'],                                        color: '#a78bfa', glow: 'rgba(167,139,250,0.35)' },
  { path: '/review',            label: 'Review Submissions',  icon: Users,           roles: ['hod'],                                        color: '#34d399', glow: 'rgba(52,211,153,0.35)'  },
  { path: '/faculty',           label: 'Faculty',             icon: Users,           roles: ['hod','management','college_admin'],            color: '#38bdf8', glow: 'rgba(56,189,248,0.35)'  },
  { path: '/publications',      label: 'Publications',        icon: BookOpen,        roles: ['hod','management','faculty','college_admin'],  color: '#4ade80', glow: 'rgba(74,222,128,0.35)'  },
  { path: '/placements',        label: 'Placements',          icon: Briefcase,       roles: ['hod','management','college_admin'],            color: '#fbbf24', glow: 'rgba(251,191,36,0.35)'  },
  { path: '/reports',           label: 'Reports',             icon: FileBarChart,    roles: ['hod','management','college_admin'],            color: '#fb7185', glow: 'rgba(251,113,133,0.35)' },
  { path: '/notifications',     label: 'Notifications',       icon: Bell,            roles: ['hod','management','faculty','college_admin'],  color: '#f472b6', glow: 'rgba(244,114,182,0.35)' },
  { path: '/settings',          label: 'Settings',            icon: Settings,        roles: ['hod','management','faculty','college_admin'],  color: '#94a3b8', glow: 'rgba(148,163,184,0.25)' },
];

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const role      = useAuthStore((s) => s.role);
  const logout    = useAuthStore((s) => s.logout);
  const user      = useAuthStore((s) => s.user);
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const dept      = useDeptStore((s) => s.getSelectedDept());
  const location  = useLocation();
  const navigate  = useNavigate();

  const filteredItems = navItems.filter((item) => item.roles.includes(role || ''));
  const sidebarWidth  = collapsed ? '72px' : '256px';

  const handleLogout = () => { logout(); navigate('/'); };

  // User initials
  const initials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : (role === 'hod' ? 'HD' : role === 'college_admin' ? 'CA' : role === 'management' ? 'DN' : 'FC');

  return (
    <>
      {/* Sidebar */}
      <aside
        style={{
          width: sidebarWidth,
          minWidth: sidebarWidth,
          maxWidth: sidebarWidth,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--bg-sidebar)',
          transition: 'width 0.28s cubic-bezier(0.16,1,0.3,1), min-width 0.28s cubic-bezier(0.16,1,0.3,1), max-width 0.28s cubic-bezier(0.16,1,0.3,1)',
          position: 'relative',
          zIndex: 50,
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sidebar)',
          flexShrink: 0,
        }}
      >
        {/* ── Logo Header ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: collapsed ? '0 18px' : '0 20px',
          height: '68px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          flexShrink: 0,
          overflow: 'hidden',
        }}>
          {/* Logo mark */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1, #14b8a6)',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(99,102,241,0.4)',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
          </div>

          {!collapsed && (
            <div style={{ overflow: 'hidden', minWidth: 0, flex: 1 }}>
              <div style={{
                fontSize: '0.9rem',
                fontWeight: 800,
                color: '#ffffff',
                whiteSpace: 'nowrap',
                letterSpacing: '-0.02em',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}>
                NMIT KPI Portal
              </div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.42)', whiteSpace: 'nowrap', marginTop: '1px', letterSpacing: '0.01em' }}>
                Academic Dashboard
              </div>
            </div>
          )}

          {/* Mobile close */}
          {!collapsed && (
            <button
              onClick={onMobileClose}
              className="lg:hidden"
              style={{ padding: '4px', borderRadius: '6px', border: 'none', background: 'rgba(255,255,255,0.07)', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', marginLeft: 'auto', flexShrink: 0 }}
              aria-label="Close sidebar"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* ── Department / Role Badge ── */}
        {!collapsed && (
          <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 12px',
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}>
              {/* Avatar */}
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #6366f1, #14b8a6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '0.72rem',
                fontWeight: 800,
                flexShrink: 0,
                letterSpacing: '0.02em',
              }}>
                {initials}
              </div>
              <div style={{ overflow: 'hidden', minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.name || (role === 'hod' ? 'Head of Dept.' : role === 'college_admin' ? 'College Admin' : role === 'management' ? 'Dean' : 'Faculty')}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.42)', whiteSpace: 'nowrap', marginTop: '1px' }}>
                  {role === 'college_admin' ? 'College Admin' : role === 'management' ? 'Dean' : dept.shortName}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Navigation ── */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '10px 10px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {/* Section label */}
          {!collapsed && (
            <div style={{ padding: '6px 10px 4px', fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Navigation
            </div>
          )}

          {filteredItems.map((item) => {
            const isActive  = location.pathname === item.path;
            const Icon      = item.icon;
            const showBadge = item.path === '/notifications' && unreadCount > 0;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onMobileClose}
                title={collapsed ? item.label : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: collapsed ? '11px' : '10px 12px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  position: 'relative',
                  transition: 'all 0.18s ease',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  background: isActive
                    ? `linear-gradient(135deg, ${item.color}22, ${item.color}10)`
                    : 'transparent',
                  color: isActive ? item.color : 'rgba(255,255,255,0.55)',
                  fontWeight: isActive ? 650 : 400,
                  fontSize: '0.862rem',
                  boxShadow: isActive && !collapsed ? `inset 0 0 0 1px ${item.color}30` : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.06)';
                    (e.currentTarget as HTMLAnchorElement).style.color = '#ffffff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                    (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.55)';
                  }
                }}
              >
                {/* Active left bar */}
                {isActive && !collapsed && (
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    top: '20%',
                    bottom: '20%',
                    width: '3px',
                    borderRadius: '0 2px 2px 0',
                    background: item.color,
                    boxShadow: `0 0 8px ${item.glow}`,
                  }} />
                )}

                {/* Icon container */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: isActive ? `${item.color}20` : 'transparent',
                  transition: 'background 0.18s',
                  flexShrink: 0,
                }}>
                  <Icon
                    size={17}
                    style={{ color: isActive ? item.color : 'rgba(255,255,255,0.45)', flexShrink: 0, transition: 'color 0.18s' }}
                  />
                </div>

                {!collapsed && (
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                    {item.label}
                  </span>
                )}

                {showBadge && (
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '18px',
                    height: '18px',
                    borderRadius: '999px',
                    background: '#f43f5e',
                    color: 'white',
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '0 4px',
                    marginLeft: collapsed ? undefined : 'auto',
                    position: collapsed ? 'absolute' : undefined,
                    top: collapsed ? '4px' : undefined,
                    right: collapsed ? '4px' : undefined,
                  }}>
                    {unreadCount}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* ── Footer ── */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '10px', display: 'flex', flexDirection: 'column', gap: '3px', flexShrink: 0 }}>
          {/* Logout */}
          <button
            onClick={handleLogout}
            title={collapsed ? 'Sign Out' : undefined}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'flex-start',
              gap: '10px',
              width: '100%',
              padding: collapsed ? '10px' : '9px 12px',
              borderRadius: '10px',
              border: 'none',
              background: 'transparent',
              color: '#fca5a5',
              fontSize: '0.862rem',
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'background 0.15s, color 0.15s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(248,113,113,0.12)';
              (e.currentTarget as HTMLButtonElement).style.color = '#f87171';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              (e.currentTarget as HTMLButtonElement).style.color = '#fca5a5';
            }}
          >
            <LogOut size={16} style={{ flexShrink: 0 }} />
            {!collapsed && <span>Sign Out</span>}
          </button>

          {/* Collapse toggle */}
          <button
            onClick={onToggle}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'flex-start',
              gap: '10px',
              width: '100%',
              padding: collapsed ? '10px' : '9px 12px',
              borderRadius: '10px',
              border: 'none',
              background: 'transparent',
              color: 'rgba(255,255,255,0.28)',
              fontSize: '0.78rem',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'background 0.15s, color 0.15s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)';
              (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.65)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.28)';
            }}
          >
            {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /><span>Collapse</span></>}
          </button>
        </div>
      </aside>
    </>
  );
}
