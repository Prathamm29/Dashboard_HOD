import { Users, UserMinus, BookOpen, Clock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { KpiCard } from '../components/ui/KpiCard';
import { FilterRail } from '../components/ui/FilterRail';
import { useKpiStore } from '../lib/store';
import { calcTrend } from '../lib/utils';

export function FacultyPage() {
  const currentPeriodId = useKpiStore((s) => s.currentPeriodId);
  const getSubmission   = useKpiStore((s) => s.getSubmission);
  const periods         = useKpiStore((s) => s.periods);

  const submission  = getSubmission(currentPeriodId);
  const { faculty, lms, latePunchIn } = submission.data;
  const totalFaculty = faculty.profCount + faculty.assocProfCount + faculty.asstProfCount;

  const currentIndex = periods.findIndex((p) => p.id === currentPeriodId);
  const prevPeriodId = currentIndex > 0 ? periods[currentIndex - 1].id : null;
  const prevData     = prevPeriodId ? getSubmission(prevPeriodId).data : null;
  const prevTotal    = prevData
    ? prevData.faculty.profCount + prevData.faculty.assocProfCount + prevData.faculty.asstProfCount
    : null;

  const designationRows = [
    { label: 'Professor',           count: faculty.profCount,      color: '#6366f1' },
    { label: 'Associate Professor', count: faculty.assocProfCount, color: '#0891b2' },
    { label: 'Assistant Professor', count: faculty.asstProfCount,  color: '#059669' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>

      {/* ── Page Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <Link to="/overview" style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            fontSize: '0.8rem', color: '#6366f1', fontWeight: 600,
            textDecoration: 'none', marginBottom: '8px',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.75')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            <ArrowLeft size={14} />
            Back to Overview
          </Link>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Faculty
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Headcount, designation breakdown, LMS compliance & punctuality
          </p>
        </div>
        <FilterRail />
      </div>

      {/* ── KPI Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <KpiCard
          icon={<Users size={20} />}
          title="Total Faculty"
          value={totalFaculty}
          subtitle={`${faculty.profCount} Prof · ${faculty.assocProfCount} Assoc · ${faculty.asstProfCount} Asst`}
          trend={prevTotal !== null ? calcTrend(totalFaculty, prevTotal) : undefined}
          accentColor="#6366f1"
          className="animate-fade-in stagger-1"
        />
        <KpiCard
          icon={<UserMinus size={20} />}
          title="Resigned Last Month"
          value={faculty.resignedLastMonth}
          subtitle={`Ratio: ${faculty.studentFacultyRatio}`}
          accentColor="#f43f5e"
          className="animate-fade-in stagger-2"
        />
        <KpiCard
          icon={<BookOpen size={20} />}
          title="LMS Non-Compliance"
          value={lms.lessonPlansNotInLms}
          subtitle={`${lms.facultyLessThan5Items} faculty with <5 items`}
          accentColor="#d97706"
          className="animate-fade-in stagger-3"
        />
        <KpiCard
          icon={<Clock size={20} />}
          title="Late Punch-ins"
          value={latePunchIn.latePunchInsLastMonth}
          subtitle="After 09:15 last month"
          accentColor="#0891b2"
          className="animate-fade-in stagger-4"
        />
      </div>

      {/* ── Detail Tables ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>

        {/* Designation Breakdown */}
        <div style={{ background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: 'var(--shadow-card-val)' }}>
          <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--border-faint)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'linear-gradient(135deg, #eef2ff, #e0e7ff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={16} style={{ color: '#6366f1' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 750, color: 'var(--text-primary)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Designation Breakdown</h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-faint)', marginTop: '1px' }}>Faculty count by designation</p>
            </div>
          </div>

          <div style={{ padding: '8px 0' }}>
            {designationRows.map((row) => {
              const pct = totalFaculty > 0 ? Math.round((row.count / totalFaculty) * 100) : 0;
              return (
                <div key={row.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 22px', borderBottom: '1px solid var(--border-faint)', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: row.color, flexShrink: 0 }} />
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{row.label}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
                    <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{row.count}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-faint)', background: 'var(--bg-surface)', padding: '2px 8px', borderRadius: '999px', border: '1px solid var(--border-color)', minWidth: '42px', textAlign: 'center' }}>
                      {pct}%
                    </span>
                  </div>
                </div>
              );
            })}
            {/* Total row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 22px', background: 'var(--bg-surface)' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>Total</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: '#6366f1', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{totalFaculty}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-faint)', background: 'var(--bg-surface)', padding: '2px 8px', borderRadius: '999px', border: '1px solid var(--border-color)', minWidth: '42px', textAlign: 'center' }}>
                  100%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* LMS Non-Compliance */}
        <div style={{ background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: 'var(--shadow-card-val)' }}>
          <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--border-faint)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'linear-gradient(135deg, #fffbeb, #fef3c7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={16} style={{ color: '#d97706' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 750, color: 'var(--text-primary)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>LMS Non-Compliance</h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-faint)', marginTop: '1px' }}>Faculty with lesson plans not in LMS</p>
            </div>
          </div>

          <div style={{ overflowY: 'auto', maxHeight: '280px' }}>
            {lms.facultyNamesNotInLms.length === 0 ? (
              <div style={{ padding: '40px 22px', textAlign: 'center' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                  <span style={{ fontSize: '1.4rem' }}>✓</span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                  All faculty lesson plans are in LMS
                </p>
              </div>
            ) : (
              lms.facultyNamesNotInLms.map((name: string, i: number) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 22px', borderBottom: '1px solid var(--border-faint)', transition: 'background 0.15s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-surface)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#fff1f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f43f5e', fontSize: '0.7rem', fontWeight: 800, flexShrink: 0 }}>
                      {name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{name}</span>
                  </div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#f43f5e', background: '#fff1f2', padding: '3px 9px', borderRadius: '999px', border: '1px solid #fecdd3' }}>
                    Missing
                  </span>
                </div>
              ))
            )}
          </div>

          <div style={{ padding: '12px 22px', borderTop: '1px solid var(--border-color)', background: 'var(--bg-surface)' }}>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              Additionally, <strong style={{ color: '#d97706' }}>{lms.facultyLessThan5Items}</strong> faculty have posted fewer than 5 items in LMS.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
