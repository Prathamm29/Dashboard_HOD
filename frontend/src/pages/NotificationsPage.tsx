import { Bell, CheckCheck, Filter, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useState } from 'react';
import { useNotificationStore } from '../lib/store';
import { formatRelativeTime, cn } from '../lib/utils';
import type { NotificationSeverity } from '../lib/types';

type FilterType = 'all' | 'unread' | 'kpi_reminder' | 'compliance' | 'research' | 'system';

const severityConfig: Record<NotificationSeverity, {
  icon: typeof Bell;
  bg: string;
  border: string;
  iconColor: string;
  dot: string;
}> = {
  error:   { icon: AlertCircle,   bg: '#fff1f2', border: '#fecdd3', iconColor: '#f43f5e', dot: '#f43f5e' },
  warning: { icon: AlertTriangle, bg: '#fffbeb', border: '#fde68a', iconColor: '#d97706', dot: '#f59e0b' },
  info:    { icon: Info,          bg: '#eef2ff', border: '#c7d2fe', iconColor: '#6366f1', dot: '#6366f1' },
};

export function NotificationsPage() {
  const notifications = useNotificationStore((s) => s.notifications);
  const markAsRead    = useNotificationStore((s) => s.markAsRead);
  const markAllAsRead = useNotificationStore((s) => s.markAllAsRead);
  const unreadCount   = useNotificationStore((s) => s.unreadCount);
  const [filter, setFilter] = useState<FilterType>('all');

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'all')    return true;
    return n.type === filter;
  });

  const filterOptions: { value: FilterType; label: string }[] = [
    { value: 'all',          label: 'All' },
    { value: 'unread',       label: `Unread (${unreadCount})` },
    { value: 'kpi_reminder', label: 'KPI Reminders' },
    { value: 'compliance',   label: 'Compliance' },
    { value: 'research',     label: 'Research' },
    { value: 'system',       label: 'System' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>

      {/* ── Page Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Notifications
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {unreadCount > 0
              ? <><strong style={{ color: '#6366f1' }}>{unreadCount}</strong> unread notification{unreadCount !== 1 ? 's' : ''}</>
              : 'All caught up — no unread notifications'
            }
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '10px 18px', fontSize: '0.85rem', fontWeight: 650,
              color: '#4f46e5', background: '#eef2ff',
              border: '1px solid #c7d2fe', borderRadius: '12px',
              cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all 0.18s', boxShadow: 'var(--shadow-card-val)',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#e0e7ff'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#eef2ff'; }}
          >
            <CheckCheck size={15} />
            Mark All as Read
          </button>
        )}
      </div>

      {/* ── Filter Tabs ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <Filter size={14} style={{ color: 'var(--text-faint)', flexShrink: 0 }} />
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            style={{
              padding: '6px 14px',
              fontSize: '0.78rem',
              fontWeight: 650,
              borderRadius: '999px',
              border: `1.5px solid ${filter === opt.value ? '#a5b4fc' : 'var(--border-color)'}`,
              background: filter === opt.value ? '#eef2ff' : 'var(--bg-card)',
              color: filter === opt.value ? '#4f46e5' : 'var(--text-muted)',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.15s',
              boxShadow: filter === opt.value ? '0 2px 8px rgba(99,102,241,0.15)' : 'none',
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* ── Notification List ── */}
      <div style={{ background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: 'var(--shadow-card-val)' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '64px 24px', textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Bell size={24} style={{ color: 'var(--text-faint)' }} />
            </div>
            <p style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-muted)' }}>No notifications match this filter</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-faint)', marginTop: '4px' }}>Try a different filter or check back later</p>
          </div>
        ) : (
          <div>
            {filtered.map((notification, idx) => {
              const config = severityConfig[notification.severity];
              const Icon   = config.icon;
              return (
                <button
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '16px 22px',
                    borderBottom: idx < filtered.length - 1 ? '1px solid var(--border-faint)' : 'none',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px',
                    background: !notification.read ? `${config.bg}88` : 'transparent',
                    borderLeft: `3px solid ${!notification.read ? config.dot : 'transparent'}`,
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                    fontFamily: 'inherit',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-surface)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = !notification.read ? `${config.bg}88` : 'transparent'; }}
                >
                  {/* Icon */}
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: config.bg, border: `1px solid ${config.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Icon size={16} style={{ color: config.iconColor }} />
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontSize: '0.875rem', lineHeight: 1.55, margin: 0,
                      color: notification.read ? 'var(--text-muted)' : 'var(--text-secondary)',
                      fontWeight: notification.read ? 400 : 550,
                    }}>
                      {notification.message}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-faint)' }}>
                        {formatRelativeTime(notification.timestamp)}
                      </span>
                      <span style={{
                        fontSize: '0.65rem', fontWeight: 700,
                        color: 'var(--text-faint)', background: 'var(--bg-surface)',
                        padding: '2px 7px', borderRadius: '999px',
                        border: '1px solid var(--border-color)',
                        textTransform: 'uppercase', letterSpacing: '0.04em',
                      }}>
                        {notification.type.replace('_', ' ')}
                      </span>
                      {!notification.read && (
                        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: config.dot, flexShrink: 0 }} />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
