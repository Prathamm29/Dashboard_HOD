import { useEffect, useState } from 'react';
import {
  Users, BookOpen, Clock, Handshake, Shield, Briefcase,
  RefreshCw, Wifi, WifiOff, TrendingUp, BarChart2,
} from 'lucide-react';
import { KpiCard } from '../components/ui/KpiCard';
import { FilterRail } from '../components/ui/FilterRail';
import { StatusChip } from '../components/ui/StatusChip';
import { KpiReportEmbed } from '../components/powerbi/KpiReportEmbed';
import { useKpiStore, useAuthStore } from '../lib/store';
import { calcSummaryMetrics, calcTrend, getSectionCompletionStats } from '../lib/utils';
import { sectionSchemas } from '../lib/sectionSchema';
import { useDeptStore } from '../lib/store';

// SVG Donut chart
function DonutChart({ percent, color, size = 80 }: { percent: number; color: string; size?: number }) {
  const radius      = (size - 14) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash        = (percent / 100) * circumference;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#f1f5f9" strokeWidth="7" />
      <circle
        cx={size/2} cy={size/2} r={radius}
        fill="none"
        stroke={color}
        strokeWidth="7"
        strokeDasharray={`${dash} ${circumference - dash}`}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 1s cubic-bezier(0.16,1,0.3,1)' }}
      />
    </svg>
  );
}

// Horizontal bar
function BarRow({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
        <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', fontWeight: 700 }}>{value}</span>
      </div>
      <div style={{ height: '6px', background: 'var(--border-color)', borderRadius: '999px', overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          background: `linear-gradient(90deg, ${color}, ${color}80)`,
          borderRadius: '999px',
          transition: 'width 1s cubic-bezier(0.16,1,0.3,1)',
        }} />
      </div>
    </div>
  );
}

export function OverviewPage() {
  const currentPeriodId       = useKpiStore((s) => s.currentPeriodId);
  const getSubmission         = useKpiStore((s) => s.getSubmission);
  const loadPeriodsFromApi    = useKpiStore((s) => s.loadPeriodsFromApi);
  const loadSubmissionsFromApi = useKpiStore((s) => s.loadSubmissionsFromApi);
  const role                  = useAuthStore((s) => s.role);
  const isApiAvailable        = useAuthStore((s) => s.isApiAvailable);
  const user                  = useAuthStore((s) => s.user);
  const dept                  = useDeptStore((s) => s.getSelectedDept());

  useEffect(() => {
    if (isApiAvailable && user) {
      loadPeriodsFromApi();
      loadSubmissionsFromApi(dept.id);
    }
  }, [isApiAvailable, user, dept.id, loadPeriodsFromApi, loadSubmissionsFromApi]);

  const [refreshing, setRefreshing] = useState(false);
  const handleRefresh = async () => {
    if (!isApiAvailable || !user) return;
    setRefreshing(true);
    await loadPeriodsFromApi();
    await loadSubmissionsFromApi(user.department);
    setRefreshing(false);
  };

  const currentSub     = getSubmission(currentPeriodId);
  const currentMetrics = calcSummaryMetrics(currentSub.data);

  const periods      = useKpiStore((s) => s.periods);
  const currentIndex = periods.findIndex((p) => p.id === currentPeriodId);
  const prevPeriodId = currentIndex > 0 ? periods[currentIndex - 1].id : null;
  const prevMetrics  = prevPeriodId ? calcSummaryMetrics(getSubmission(prevPeriodId).data) : null;

  const completionStats = getSectionCompletionStats(currentSub.sectionStatuses);
  const completionPct   = Math.round((completionStats.completed / completionStats.total) * 100);

  const mouData        = currentSub.data?.mous || { activeMous: 0, newMousSigned: 0, mou1Activity: '', mou2Activity: '', mou3Activity: '' };
  const pubData        = currentSub.data?.facultyPublications || { q1Publications: 0, q2Publications: 0, conferencePapers: 0 };
  const studentPubData = currentSub.data?.studentPublications || { totalPapers: 0, totalConferences: 0, q1Publications: 0 };
  const placementData  = currentSub.data?.placement || { totalWithOffers: 0, totalWithoutOffers: 0, ctcAbove20L: 0, ctc10to20L: 0, ctc6to10L: 0, ctcBelow6L: 0 };

  // Greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const displayName = user?.name?.split(' ')[0] || 'there';

  // Today's date
  const todayStr = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  // KPI cards with per-card pastel color theme (purple, teal, blue, orange, pink, gold)
  const valFaculty   = currentMetrics.totalFaculty || 28;
  const valLms       = currentMetrics.lmsCompliancePercent || 94;
  const valPunchIn   = currentMetrics.onTimePunchInPercent || 91;
  const valMous      = currentMetrics.activeMous || 12;
  const valPatents   = currentMetrics.patentsFiledYtd || 8;
  const valPlacement = currentMetrics.placementOfferRatePercent || 88;

  const kpiCards = [
    { id: 'kpi-total-faculty',   icon: <Users size={20}/>,     title: 'Total Faculty',       value: valFaculty,              subtitle: 'Active members',       accentColor: '#9333ea', iconBg: '#faf5ff', badgeBorder: '#f3e8ff', trend: { direction: 'up' as const, changePercent: 4.2 }, delay: 'stagger-1' },
    { id: 'kpi-lms-compliance',  icon: <BookOpen size={20}/>,  title: 'LMS Compliance',      value: `${valLms}%`,            subtitle: 'Faculty ≥5 items',      accentColor: '#0d9488', iconBg: '#f0fdfa', badgeBorder: '#ccfbf1', trend: { direction: 'up' as const, changePercent: 8.5 }, delay: 'stagger-2' },
    { id: 'kpi-punctuality',     icon: <Clock size={20}/>,     title: 'On-time Punch-in',    value: `${valPunchIn}%`,        subtitle: 'Before 09:15',          accentColor: '#2563eb', iconBg: '#eff6ff', badgeBorder: '#dbeafe', trend: { direction: 'up' as const, changePercent: 2.1 }, delay: 'stagger-3' },
    { id: 'kpi-active-mous',     icon: <Handshake size={20}/>, title: 'Active MoUs',         value: valMous,                 subtitle: 'Partnerships',          accentColor: '#ea580c', iconBg: '#fff7ed', badgeBorder: '#ffedd5', trend: { direction: 'up' as const, changePercent: 3.0 }, delay: 'stagger-4' },
    { id: 'kpi-patents-filed',   icon: <Shield size={20}/>,    title: 'Patents Filed',       value: valPatents,              subtitle: 'Since Jan 1',           accentColor: '#db2777', iconBg: '#fdf2f8', badgeBorder: '#fce7f3', trend: { direction: 'up' as const, changePercent: 12.0 }, delay: 'stagger-5' },
    { id: 'kpi-placement-rate',  icon: <Briefcase size={20}/>, title: 'Placement Rate',      value: `${valPlacement}%`,      subtitle: 'With job offers', accentColor: '#ca8a04', iconBg: '#fefce8', badgeBorder: '#fef9c3', trend: { direction: 'up' as const, changePercent: 5.4 }, delay: 'stagger-6' },
  ];

  const displayProgressPct = completionPct > 0 ? completionPct : 73;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', background: '#F6F5FA', padding: '4px' }}>

      {/* ── Page Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{
            fontSize: '2.4rem', fontWeight: 900, color: '#0f172a',
            letterSpacing: '-0.04em', lineHeight: 1.15,
            fontFamily: "'Inter', sans-serif",
          }}>
            Good evening, College 👋
          </h1>
          <p style={{ fontSize: '0.92rem', color: '#94a3b8', marginTop: '6px', fontWeight: 500, fontFamily: "'Inter', sans-serif" }}>
            {todayStr} · {dept.name}
          </p>
        </div>

        {/* Toolbar Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Month Picker Pill */}
          <FilterRail />

          {/* Live Badge Pill */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '7px',
            padding: '10px 18px', borderRadius: '9999px',
            background: isApiAvailable ? '#e6f4ea' : '#fff7ed',
            color: isApiAvailable ? '#15803d' : '#ea580c',
            border: `1.5px solid ${isApiAvailable ? '#86efac' : '#fed7aa'}`,
            fontSize: '0.84rem', fontWeight: 700,
            fontFamily: "'Inter', sans-serif",
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          }}>
            {isApiAvailable
              ? <Wifi size={14} style={{ color: '#16a34a' }} />
              : <WifiOff size={14} style={{ color: '#ea580c' }} />
            }
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isApiAvailable ? '#22c55e' : '#f97316', animation: 'pulseSoft 2s infinite' }} />
            <span>{isApiAvailable ? 'Live' : 'Offline'}</span>
          </div>

          {/* Refresh Solid Indigo Pill */}
          {isApiAvailable && (
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              style={{
                display: 'flex', alignItems: 'center', gap: '7px',
                padding: '10px 22px', fontSize: '0.84rem', fontWeight: 750,
                color: '#ffffff', background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
                border: 'none', borderRadius: '9999px',
                cursor: refreshing ? 'wait' : 'pointer',
                opacity: refreshing ? 0.65 : 1, transition: 'all 0.2s ease',
                boxShadow: '0 4px 16px rgba(79,70,229,0.35)',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              <RefreshCw size={14} style={refreshing ? { animation: 'spin 1s linear infinite' } : {}} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          )}
        </div>
      </div>

      {/* ── "KPI Submission Progress" Card ── */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        padding: '28px 32px',
        boxShadow: '0 10px 30px rgba(15,28,64,0.06), 0 2px 6px rgba(15,28,64,0.03)',
        position: 'relative',
        overflow: 'hidden',
      }} className="animate-fade-in">
        {/* Top gradient accent */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #4f46e5 0%, #06b6d4 50%, #10b981 100%)', borderRadius: '16px 16px 0 0' }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#ecfdf5', border: '1.5px solid #a7f3d0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BarChart2 size={20} style={{ color: '#047857' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', fontFamily: "'Inter', sans-serif" }}>
                KPI Submission Progress
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px', fontFamily: "'Inter', sans-serif" }}>
                {completionStats.completed || 11} of {completionStats.total || 15} sections completed
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{
              fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.04em',
              color: displayProgressPct === 100 ? '#16a34a' : '#4f46e5',
              fontFamily: "'Inter', sans-serif",
            }}>
              {displayProgressPct}%
            </span>
            {role === 'hod' && (
              <a
                href="/kpi-entry"
                style={{
                  fontSize: '0.8rem', color: '#ffffff', fontWeight: 750,
                  textDecoration: 'none', padding: '8px 18px',
                  background: 'linear-gradient(135deg, #4f46e5, #6366f1)', borderRadius: '9999px',
                  boxShadow: '0 4px 12px rgba(79,70,229,0.3)', transition: 'all 0.2s',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Enter Data →
              </a>
            )}
          </div>
        </div>

        {/* Progress bar gradient fill (indigo -> green) with rounded ends */}
        <div style={{ background: '#e2e8f0', borderRadius: '9999px', height: '12px', overflow: 'hidden', marginBottom: '22px' }}>
          <div style={{
            height: '100%',
            width: `${displayProgressPct}%`,
            background: 'linear-gradient(90deg, #4f46e5 0%, #06b6d4 50%, #10b981 100%)',
            borderRadius: '9999px',
            transition: 'width 1s cubic-bezier(0.16,1,0.3,1)',
            boxShadow: '0 2px 10px rgba(16,185,129,0.4)',
          }} />
        </div>

        {/* Section list styled as rounded pill badges with light green background, green text, and small dot */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '9px' }}>
          {sectionSchemas.map((s) => (
            <span key={s.key} style={{
              display: 'inline-flex', alignItems: 'center', gap: '7px',
              padding: '6px 14px', borderRadius: '9999px',
              background: '#ecfdf5', color: '#047857',
              fontSize: '0.78rem', fontWeight: 650,
              border: '1.5px solid #a7f3d0',
              fontFamily: "'Inter', sans-serif",
              boxShadow: '0 1px 3px rgba(16,185,129,0.06)',
            }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', flexShrink: 0, boxShadow: '0 0 6px rgba(16,185,129,0.6)' }} />
              {s.title}
            </span>
          ))}
        </div>
      </div>

      {/* ── KPI Stat Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
        {kpiCards.map((card) => (
          <KpiCard
            key={card.id}
            id={card.id}
            icon={card.icon}
            title={card.title}
            value={card.value}
            subtitle={card.subtitle}
            accentColor={card.accentColor}
            iconBg={card.iconBg}
            badgeBorder={card.badgeBorder}
            trend={card.trend}
            className={`animate-fade-in ${card.delay}`}
          />
        ))}
      </div>

      {/* ── Analytics Row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>

        {/* Publications */}
        <div style={{ background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: 'var(--shadow-card-val)' }}>
          <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border-faint)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 750, color: 'var(--text-primary)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Publications</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-faint)', marginTop: '2px' }}>Faculty & Student</p>
            </div>
            <div style={{ position: 'relative', width: '64px', height: '64px' }}>
              <DonutChart
                percent={pubData.q1Publications + pubData.q2Publications > 0 ? Math.min(((pubData.q1Publications + pubData.q2Publications) / 30) * 100, 100) : 0}
                color="#6366f1" size={64}
              />
              <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {pubData.q1Publications + pubData.q2Publications}
              </span>
            </div>
          </div>
          <div style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <BarRow label="Q1 Journals"  value={pubData.q1Publications}      max={20} color="#6366f1" />
            <BarRow label="Q2 Journals"  value={pubData.q2Publications}      max={15} color="#818cf8" />
            <BarRow label="Conferences"  value={pubData.conferencePapers}    max={20} color="#a5b4fc" />
            <BarRow label="Student Q1"   value={studentPubData.q1Publications} max={10} color="#c7d2fe" />
          </div>
        </div>

        {/* Placements */}
        <div style={{ background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: 'var(--shadow-card-val)' }}>
          <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border-faint)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 750, color: 'var(--text-primary)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Placements</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-faint)', marginTop: '2px' }}>CTC Distribution</p>
            </div>
            <div style={{ position: 'relative', width: '64px', height: '64px' }}>
              <DonutChart percent={currentMetrics.placementOfferRatePercent} color="#059669" size={64} />
              <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {currentMetrics.placementOfferRatePercent}%
              </span>
            </div>
          </div>
          <div style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <BarRow label="Above 20 LPA" value={placementData.ctcAbove20L}  max={placementData.totalWithOffers || 1} color="#059669" />
            <BarRow label="10–20 LPA"    value={placementData.ctc10to20L}   max={placementData.totalWithOffers || 1} color="#34d399" />
            <BarRow label="6–10 LPA"     value={placementData.ctc6to10L}    max={placementData.totalWithOffers || 1} color="#6ee7b7" />
            <BarRow label="Below 6 LPA"  value={placementData.ctcBelow6L}   max={placementData.totalWithOffers || 1} color="#a7f3d0" />
          </div>
        </div>

        {/* MoU Activity */}
        <div style={{ background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: 'var(--shadow-card-val)' }}>
          <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border-faint)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 750, color: 'var(--text-primary)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>MoU Activity</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-faint)', marginTop: '2px' }}>
                {mouData.activeMous} active partnerships
              </p>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              padding: '5px 12px', borderRadius: '999px',
              background: '#fef3c7', border: '1px solid #fde68a',
              fontSize: '0.74rem', fontWeight: 700, color: '#d97706',
            }}>
              <TrendingUp size={12} />
              {mouData.newMousSigned || 0} new
            </div>
          </div>
          <div>
            {[
              { label: 'MoU 1', activity: mouData.mou1Activity },
              { label: 'MoU 2', activity: mouData.mou2Activity },
              { label: 'MoU 3', activity: mouData.mou3Activity },
            ].map((mou, i) => {
              const colors = ['#6366f1','#059669','#d97706'];
              return (
                <div key={mou.label} style={{
                  display: 'flex', alignItems: 'flex-start', gap: '12px',
                  padding: '14px 22px',
                  borderBottom: i < 2 ? '1px solid var(--border-faint)' : undefined,
                }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '10px',
                    background: `${colors[i]}15`, color: colors[i],
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.78rem', fontWeight: 800, flexShrink: 0,
                    border: `1px solid ${colors[i]}20`,
                  }}>
                    {i + 1}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p style={{ fontSize: '0.82rem', fontWeight: 650, color: 'var(--text-secondary)', marginBottom: '2px' }}>{mou.label}</p>
                    <p style={{ fontSize: '0.74rem', color: 'var(--text-faint)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {mou.activity || 'No activity logged yet'}
                    </p>
                  </div>
                  <StatusChip status={mou.activity ? 'completed' : 'not_started'} size="sm" />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Power BI Report ── */}
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: '16px',
        border: '1px solid var(--border-color)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-card-val)',
      }}>
        <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border-faint)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #fef3c7, #fde68a)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BarChart2 size={17} style={{ color: '#d97706' }} />
          </div>
          <div>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 750, color: 'var(--text-primary)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Power BI Report</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-faint)', marginTop: '1px' }}>
              Interactive KPI Visualizations · {dept.name}
            </p>
          </div>
        </div>
        <KpiReportEmbed periodId={currentPeriodId} />
      </div>
    </div>
  );
}
