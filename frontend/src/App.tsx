import { useEffect, useState, type ReactNode } from 'react'
import {
  ArrowDownRight, ArrowRight, Bell, BookMarked, BookOpen, CalendarDays, Check,
  CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, Clock3, Command,
  Flame, GraduationCap, Layers3, LayoutDashboard, Menu, Moon, MoreHorizontal,
  Play, Plus, Settings2, ShieldCheck, Sparkles, Sun, Target, TrendingUp,
  X, Zap,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type IconType = LucideIcon
type Page = 'Overview' | 'Planner' | 'Study Space' | 'Progress'

const navigation: { label: Page; icon: IconType }[] = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Planner', icon: CalendarDays },
  { label: 'Study Space', icon: BookOpen },
  { label: 'Progress', icon: TrendingUp },
]

const schedule = [
  { time: '09:00', end: '10:00', title: 'Bioprocess Engineering', meta: 'Room B-204 · Lecture', accent: 'purple', mark: 'BE' },
  { time: '11:15', end: '12:15', title: 'Molecular Biology', meta: 'Science Block · Lecture', accent: 'teal', mark: 'MB' },
  { time: '14:00', end: '16:00', title: 'Biotechnology Lab', meta: 'Lab 3 · Practical', accent: 'orange', mark: 'BL' },
]

const subjects = [
  { name: 'Bioprocess Engineering', initials: 'BE', color: 'purple', attended: 34, total: 42 },
  { name: 'Molecular Biology', initials: 'MB', color: 'teal', attended: 28, total: 34 },
  { name: 'Genetic Engineering', initials: 'GE', color: 'orange', attended: 21, total: 29 },
  { name: 'Immunology', initials: 'IM', color: 'blue', attended: 31, total: 38 },
]

const initialAssignments = [
  { id: 1, subject: 'Molecular Biology', name: 'Gene expression worksheet', due: 'Tomorrow', priority: 'High' },
  { id: 2, subject: 'Bioprocess Engineering', name: 'Mass transfer problem set', due: 'Friday', priority: 'Medium' },
  { id: 3, subject: 'Immunology', name: 'Complement pathways summary', due: 'Monday', priority: 'Normal' },
]

const studyDecks = [
  { name: 'Enzyme Kinetics', subject: 'Bioprocess Engineering', cards: 24, last: 'Edited yesterday', color: 'purple', progress: 72 },
  { name: 'Gene Regulation', subject: 'Molecular Biology', cards: 18, last: 'Edited 2 days ago', color: 'teal', progress: 48 },
  { name: 'Immune Responses', subject: 'Immunology', cards: 32, last: 'Edited last week', color: 'orange', progress: 81 },
]

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const calendarDates = [2, 3, 4, 5, 6, 7, 8]

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="brand">
      <div className="brand-icon"><GraduationCap size={23} strokeWidth={2.4} /></div>
      {!compact && <div className="brand-type"><strong>exampilot<span>.</span></strong><small>YOUR ACADEMIC SPACE</small></div>}
    </div>
  )
}

function TinyPill({ children, tone = 'neutral' }: { children: ReactNode; tone?: string }) {
  return <span className={`pill pill-${tone}`}>{children}</span>
}

function App() {
  const [page, setPage] = useState<Page>('Overview')
  const [dark, setDark] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [completed, setCompleted] = useState<number[]>([])
  const [notice, setNotice] = useState<string | null>(null)
  const [focusSeconds, setFocusSeconds] = useState<number | null>(null)
  const [focusRunning, setFocusRunning] = useState(false)

  useEffect(() => {
    if (!focusRunning) return
    const id = window.setInterval(() => {
      setFocusSeconds((value) => {
        if (value === null || value <= 1) {
          setFocusRunning(false)
          return 0
        }
        return value - 1
      })
    }, 1000)
    return () => window.clearInterval(id)
  }, [focusRunning])

  useEffect(() => {
    if (!notice) return
    const id = window.setTimeout(() => setNotice(null), 4200)
    return () => window.clearTimeout(id)
  }, [notice])

  const navigate = (next: Page) => {
    setPage(next)
    setSidebarOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const assignmentsLeft = initialAssignments.length - completed.length

  return (
    <div className={`app-root${dark ? ' dark' : ''}`}>
      {sidebarOpen && <button className="sidebar-backdrop" aria-label="Close navigation" onClick={() => setSidebarOpen(false)} />}
      <aside className={`sidebar${sidebarOpen ? ' sidebar-open' : ''}`}>
        <div className="sidebar-logo"><Brand /><button className="mobile-only icon-button" aria-label="Close menu" onClick={() => setSidebarOpen(false)}><X size={18} /></button></div>
        <div className="sidebar-workspace"><span className="workspace-avatar">S</span><span className="workspace-copy"><strong>Sharath's workspace</strong><small>Personal student account</small></span><ChevronDown size={15} /></div>
        <div className="sidebar-label">WORKSPACE</div>
        <nav className="sidebar-nav" aria-label="Main navigation">
          {navigation.map(({ label, icon: Icon }) => (
            <button className={`nav-link${page === label ? ' active' : ''}`} key={label} onClick={() => navigate(label)} aria-current={page === label ? 'page' : undefined}>
              <Icon size={19} strokeWidth={1.9} />{label}{page === label && <span className="nav-active-dot" />}
            </button>
          ))}
        </nav>
        <div className="sidebar-label tools-label">QUICK ACCESS</div>
        <button className="nav-link nav-muted" onClick={() => { navigate('Planner'); setNotice('Sample semester calendar shown. Real accounts arrive in Milestone 2.') }}><CalendarDays size={19} />Exam calendar</button>
        <button className="nav-link nav-muted" onClick={() => { navigate('Study Space'); setNotice('Study tools are preview content; AI integration is planned for a later milestone.') }}><BookMarked size={19} />My materials</button>
        <div className="sidebar-bottom">
          <div className="sidebar-tip"><div className="tip-top"><Sparkles size={18} /><TinyPill tone="violet">Coming soon</TinyPill></div><strong>Intelligence, built in.</strong><p>Personalized study plans that connect your real semester with how you learn.</p></div>
          <button className="sidebar-settings" onClick={() => setNotice('Account settings arrive with secure authentication in Milestone 2.')}><Settings2 size={18} />Settings</button>
          <div className="sidebar-profile"><span className="profile-photo">S</span><span><strong>Sharath Kumar</strong><small>Design preview</small></span><MoreHorizontal size={19} /></div>
        </div>
      </aside>

      <div className="app-main">
        <header className="topbar">
          <div className="topbar-left"><button className="mobile-only icon-button" aria-label="Open menu" onClick={() => setSidebarOpen(true)}><Menu size={22} /></button><span className="breadcrumb-parent">My workspace</span><ChevronRight size={15} className="breadcrumb-sep"/><strong>{page}</strong></div>
          <div className="topbar-actions"><span className="preview-label"><span className="preview-dot" /> Sample data preview</span><button className="icon-button" aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'} onClick={() => setDark(!dark)}>{dark ? <Sun size={19} /> : <Moon size={19} />}</button><button className="icon-button notification-button" aria-label="View notifications" onClick={() => setNotice('Notifications will become available when a student account is connected.')}><Bell size={19} /><span /></button><div className="topbar-avatar">S</div></div>
        </header>

        <main className="content">
          {page === 'Overview' && <>
            <div className="page-heading"><div><p className="eyebrow">FRIDAY, 6 NOVEMBER 2026 · DESIGN PREVIEW</p><h1>Good morning, Sharath <span className="wave">✳</span></h1><p className="page-subtitle">Your semester, beautifully under control. Here's your day at a glance.</p></div><button className="outline-button" onClick={() => navigate('Planner')}><CalendarDays size={17} /> View planner</button></div>
            <div className="hero-card"><div className="hero-content"><div className="hero-kicker"><span className="tiny-orbit"><Sparkles size={14}/></span> YOUR DAILY BRIEFING</div><h2>A little progress<br />goes a long way.</h2><p>You have <strong>{assignmentsLeft} assignment{assignmentsLeft === 1 ? '' : 's'}</strong> to finish and a chance to get ahead on your next exam.</p><button className="hero-button" onClick={() => { setFocusSeconds(25 * 60); setFocusRunning(true) }}><Play size={16} fill="currentColor" /> Start a focus session <ArrowRight size={16}/></button></div><div className="hero-art" aria-hidden="true"><div className="orb orb-one"/><div className="orb orb-two"/><div className="orbit-ring"/><div className="hero-floating-card floating-one"><span className="floating-check"><Check size={14}/></span><span>You're doing great!</span></div><div className="hero-floating-card floating-two"><span>✦</span><span>Stay curious.</span></div></div></div>
            <div className="metrics-grid"><Metric icon={CalendarDays} label="Today's classes" value="03" detail="Next at 9:00 AM" tint="purple"/><Metric icon={Target} label="Attendance average" value="79.7%" detail="Across 4 subjects" tint="teal"/><Metric icon={Clock3} label="Tasks to finish" value={String(assignmentsLeft).padStart(2, '0')} detail="1 due tomorrow" tint="orange"/><Metric icon={Flame} label="Study streak" value="07 days" detail="Keep the momentum" tint="blue"/></div>
            <div className="dashboard-columns"><section className="panel"><div className="panel-header"><div><h3>Today's schedule</h3><p>Classes and activities on your calendar</p></div><button className="text-button" onClick={() => navigate('Planner')}>View week <ArrowRight size={15}/></button></div><div className="timeline">{schedule.map((item) => <div className="timeline-row" key={item.title}><div className="timeline-time"><strong>{item.time}</strong><small>{item.end}</small></div><div className={`timeline-line line-${item.accent}`} /><div className="timeline-details"><span className={`subject-mini mini-${item.accent}`}>{item.mark}</span><div><strong>{item.title}</strong><small>{item.meta}</small></div></div><ChevronRight size={16} className="muted-chevron" /></div>)}</div></section>
              <section className="panel"><div className="panel-header"><div><h3>Coming up</h3><p>Stay one step ahead of your deadlines</p></div><button className="text-button" onClick={() => navigate('Planner')}>All tasks <ArrowRight size={15}/></button></div><div className="task-list">{initialAssignments.map((task) => <button className={`task-row${completed.includes(task.id) ? ' task-done' : ''}`} key={task.id} onClick={() => setCompleted((list) => list.includes(task.id) ? list.filter((id) => id !== task.id) : [...list, task.id])}><span className="task-checkbox">{completed.includes(task.id) && <Check size={13}/>}</span><span className="task-copy"><strong>{task.name}</strong><small>{task.subject}</small></span><span className={`due-tag due-${task.priority.toLowerCase()}`}>{task.due}</span></button>)}</div><div className="panel-footnote"><CheckCircle2 size={15}/> Check off a demo task to explore the interface</div></section></div>
            <section className="panel attendance-panel"><div className="panel-header"><div><h3>Attendance overview</h3><p>A clear view of where you stand</p></div><button className="text-button" onClick={() => navigate('Progress')}>Full report <ArrowRight size={15}/></button></div><div className="attendance-grid">{subjects.map((subject) => { const percentage = Math.round(subject.attended / subject.total * 100); return <div className="attendance-subject" key={subject.name}><div className="attendance-top"><span className={`subject-mini mini-${subject.color}`}>{subject.initials}</span><span className={`attendance-value${percentage < 75 ? ' risk' : ''}`}>{percentage}%</span></div><strong>{subject.name}</strong><div className="mini-progress"><span style={{ width: `${percentage}%` }} className={`fill-${subject.color}`} /></div><small>{subject.attended} of {subject.total} classes attended</small></div> })}</div></section>
          </>}

          {page === 'Planner' && <><div className="page-heading"><div><p className="eyebrow">ONE CLEAR ACADEMIC CALENDAR</p><h1>Your planner<span className="heading-dot">.</span></h1><p className="page-subtitle">Classes, tasks and examinations in one considered space.</p></div><TinyPill tone="violet">Sample semester</TinyPill></div><section className="panel calendar-panel"><div className="panel-header"><div><h3>November 2026</h3><p>Week at a glance · illustrative schedule</p></div><div className="calendar-controls"><button className="icon-button" aria-label="Previous week" onClick={() => setNotice('Week navigation is included in the database-connected planner milestone.')}><ChevronLeft size={18}/></button><button className="icon-button" aria-label="Next week" onClick={() => setNotice('Week navigation is included in the database-connected planner milestone.')}><ChevronRight size={18}/></button></div></div><div className="calendar-week">{weekdays.map((day, i) => <div className={`calendar-day${i === 4 ? ' calendar-today' : ''}`} key={day}><span>{day}</span><strong>{calendarDates[i]}</strong><div className="calendar-dots">{i < 5 && <i className="calendar-dot-purple" />}{(i === 2 || i === 4) && <i className="calendar-dot-teal" />}</div></div>)}</div><div className="calendar-legend"><span><i className="calendar-dot-purple" />Classes</span><span><i className="calendar-dot-teal" />Deadlines</span></div></section><div className="dashboard-columns"><section className="panel"><div className="panel-header"><div><h3>Classes today</h3><p>Your Friday timetable</p></div></div><div className="timeline">{schedule.map((item) => <div className="timeline-row" key={item.title}><div className="timeline-time"><strong>{item.time}</strong><small>{item.end}</small></div><div className={`timeline-line line-${item.accent}`}/><div className="timeline-details"><span className={`subject-mini mini-${item.accent}`}>{item.mark}</span><div><strong>{item.title}</strong><small>{item.meta}</small></div></div></div>)}</div></section><section className="panel"><div className="panel-header"><div><h3>Assignments</h3><p>{assignmentsLeft} outstanding tasks</p></div></div><div className="task-list">{initialAssignments.map((task) => <button className={`task-row${completed.includes(task.id) ? ' task-done' : ''}`} key={task.id} onClick={() => setCompleted((list) => list.includes(task.id) ? list.filter((id) => id !== task.id) : [...list, task.id])}><span className="task-checkbox">{completed.includes(task.id) && <Check size={13}/>}</span><span className="task-copy"><strong>{task.name}</strong><small>{task.subject}</small></span><span className={`due-tag due-${task.priority.toLowerCase()}`}>{task.due}</span></button>)}</div><button className="panel-action" onClick={() => setNotice('Adding and saving real assignments will be enabled with student accounts.')}><Plus size={16}/> Add an assignment</button></section></div></>}

          {page === 'Study Space' && <><div className="page-heading"><div><p className="eyebrow">FOCUS ON UNDERSTANDING</p><h1>Your study space<span className="heading-dot">.</span></h1><p className="page-subtitle">A calm place to prepare, practice and make real progress.</p></div><TinyPill tone="violet"><Sparkles size={13}/> AI features planned</TinyPill></div><div className="study-banner"><div><div className="hero-kicker"><Sparkles size={15}/> YOUR LEARNING COMPANION</div><h2>Turn complexity<br/>into clarity.</h2><p>Source-grounded explanations, intelligent practice and adaptive revision are coming in the AI learning milestone.</p><button onClick={() => setNotice('AI integration is not active yet. The first release will use verified source citations and usage limits.')} className="hero-button">Explore the roadmap <ArrowRight size={16}/></button></div><BookOpen size={120} strokeWidth={0.8} className="study-banner-icon" /></div><div className="section-heading"><div><h3>Study collections</h3><p>Illustrative flashcard decks to preview the layout</p></div><TinyPill>3 example decks</TinyPill></div><div className="deck-grid">{studyDecks.map((deck) => <article className="deck-card" key={deck.name}><div className={`deck-icon deck-${deck.color}`}><Layers3 size={23}/></div><h3>{deck.name}</h3><p>{deck.subject}</p><div className="deck-progress"><span style={{ width: `${deck.progress}%` }} /></div><div className="deck-footer"><span>{deck.cards} cards</span><span>{deck.last}</span></div><button className="deck-link" onClick={() => setNotice('These are sample decks. Real study materials and flashcards arrive in the AI learning milestone.')}>Preview collection <ArrowRight size={15}/></button></article>)}</div></>}

          {page === 'Progress' && <><div className="page-heading"><div><p className="eyebrow">GROWTH YOU CAN SEE</p><h1>Academic progress<span className="heading-dot">.</span></h1><p className="page-subtitle">Understand your strengths and know where to focus next.</p></div><TinyPill tone="violet">Illustrative insights</TinyPill></div><div className="metrics-grid"><Metric icon={Target} label="Attendance average" value="79.7%" detail="4 example subjects" tint="teal"/><Metric icon={CheckCircle2} label="Tasks completed" value={`${completed.length}/03`} detail="This preview session" tint="purple"/><Metric icon={Zap} label="Study readiness" value="72%" detail="Example metric" tint="blue"/><Metric icon={Flame} label="Weekly streak" value="07 days" detail="Example metric" tint="orange"/></div><section className="panel progress-panel"><div className="panel-header"><div><h3>Subject attendance</h3><p>Examples only; grades and mastery are not connected yet</p></div><TinyPill tone="neutral">Target 75%</TinyPill></div>{subjects.map((subject) => { const pct = Math.round(subject.attended / subject.total * 100); return <div className="progress-row" key={subject.name}><div className="progress-row-title"><span className={`subject-mini mini-${subject.color}`}>{subject.initials}</span><strong>{subject.name}</strong><span className={pct < 75 ? 'text-risk' : ''}>{pct}%</span></div><div className="progress-track"><div className={`fill-${subject.color}`} style={{ width: `${pct}%` }}/></div></div> })}<div className="progress-note"><ShieldCheck size={18}/><p>Attendance projections and CGPA will use verified institution rules. AI will never create or change official academic records.</p></div></section></>}
        </main>
        <footer className="main-footer"><span>© 2026 ExamPilot AI · Product foundation preview</span><span>Made for focused minds <span className="footer-star">✳</span></span></footer>
      </div>
      <nav className="bottom-nav" aria-label="Mobile navigation">{navigation.map(({ label, icon: Icon }) => <button key={label} className={page === label ? 'selected' : ''} onClick={() => navigate(label)}><Icon size={20}/><span>{label === 'Study Space' ? 'Study' : label}</span></button>)}</nav>
      {notice && <div className="toast" role="status"><ShieldCheck size={18}/><span>{notice}</span><button onClick={() => setNotice(null)} aria-label="Dismiss"><X size={16}/></button></div>}
      {focusSeconds !== null && <div className="dialog-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) { setFocusRunning(false); setFocusSeconds(null) } }}><section className="focus-dialog" role="dialog" aria-modal="true" aria-label="Focus session"><button className="dialog-close icon-button" onClick={() => { setFocusRunning(false); setFocusSeconds(null) }} aria-label="Close focus session"><X size={19}/></button><div className="focus-symbol"><Command size={27}/></div><p className="eyebrow">FOCUS MODE · LOCAL DEMO TIMER</p><h2>One thing at a time.</h2><div className="focus-time">{String(Math.floor(focusSeconds / 60)).padStart(2, '0')}:{String(focusSeconds % 60).padStart(2, '0')}</div><p>{focusSeconds === 0 ? 'Great work. Your session is complete!' : 'Set distractions aside and give yourself this moment.'}</p><button className="primary-button" onClick={() => { if (focusSeconds === 0) { setFocusSeconds(25 * 60); setFocusRunning(true) } else setFocusRunning(!focusRunning) }}>{focusSeconds === 0 ? 'Start again' : focusRunning ? 'Pause session' : 'Resume session'}</button><small>This timer is local to the preview and does not save study time.</small></section></div>}
    </div>
  )
}

function Metric({ icon: Icon, label, value, detail, tint }: { icon: IconType; label: string; value: string; detail: string; tint: string }) {
  return <div className="metric-card"><div className={`metric-icon icon-${tint}`}><Icon size={20} strokeWidth={1.9}/></div><div className="metric-label">{label}</div><div className="metric-value">{value}</div><div className="metric-detail"><ArrowDownRight size={13}/>{detail}</div></div>
}

export default App
