import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Card, KPICard, Avatar, Badge, Button } from '../components';
import { mockChildren, mockSessions, moodEmojis, subjectColors } from '../lib/data';
import { CalendarDays, Sparkles, CheckCircle2, Plus, Clock, ChevronRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { format, subDays, isSameDay, parseISO } from 'date-fns';

const SELECTED_CHILD_KEY = 'calmlearn_selected_child';

export default function DashboardPage() {
  const [selectedChild, setSelectedChild] = useState(mockChildren[0]);
  const sessions = mockSessions;
  const [trendRange, setTrendRange] = useState<'7' | '14' | '30'>('7');

  useEffect(() => {
    const stored = localStorage.getItem(SELECTED_CHILD_KEY);
    if (stored) {
      const child = mockChildren.find(c => c.id === stored);
      if (child) setSelectedChild(child);
    }
  }, []);

  const handleChildChange = (childId: string) => {
    const child = mockChildren.find(c => c.id === childId);
    if (child) {
      setSelectedChild(child);
      localStorage.setItem(SELECTED_CHILD_KEY, childId);
    }
  };

  const childSessions = sessions.filter(s => s.child_id === selectedChild.id);

  // Calculate KPIs
  const last30Days = childSessions.filter(s => {
    const sessionDate = parseISO(s.session_date);
    return sessionDate >= subDays(new Date(), 30);
  });

  const last7Days = childSessions.filter(s => {
    const sessionDate = parseISO(s.session_date);
    return sessionDate >= subDays(new Date(), 7);
  });

  const attendanceRate = last30Days.length > 0
    ? Math.round((last30Days.filter(s => s.attendance_status === 'present').length / last30Days.length) * 100)
    : 0;

  const completedActivities = last30Days.filter(s => s.activities_completed).length;

  const moodsLast30 = last30Days.filter(s => s.mood);
  const positiveMoods = moodsLast30.filter(s => ['happy', 'excited', 'proud'].includes(s.mood || '')).length;
  const moodScore = moodsLast30.length > 0
    ? Math.round((positiveMoods / moodsLast30.length) * 100)
    : 0;

  const avgDuration = last30Days.filter(s => s.duration_minutes && s.duration_minutes > 0).length > 0
    ? Math.round(last30Days.filter(s => s.duration_minutes && s.duration_minutes > 0).reduce((acc, s) => acc + (s.duration_minutes || 0), 0) / last30Days.filter(s => s.duration_minutes && s.duration_minutes > 0).length)
    : 0;

  // Weekly progress chart
  const getTrendData = () => {
    const days = trendRange === '7' ? 7 : trendRange === '14' ? 14 : 30;
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const daySessions = last30Days.filter(s => isSameDay(parseISO(s.session_date), date));
      const totalDuration = daySessions.reduce((acc, s) => acc + (s.duration_minutes || 0), 0);
      data.push({
        date: format(date, days > 14 ? 'MMM dd' : 'EEE'),
        duration: totalDuration,
        sessions: daySessions.length,
      });
    }
    return data;
  };

  // Recent sessions timeline
  const recentSessions = childSessions
    .filter(s => s.subject || s.activities_completed)
    .slice(0, 5);

  const todayChildren = sessions.filter(s => {
    const today = new Date();
    return isSameDay(parseISO(s.session_date), today) && s.attendance_status === 'present';
  });

  return (
    <Layout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 mb-1">Dashboard</h1>
          <p className="text-slate-500">Welcome back. Here's today's overview.</p>
        </div>
        <Link to="/sessions/new">
          <Button size="lg" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Session
          </Button>
        </Link>
      </div>

      {/* Child selector */}
      <Card className="mb-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-slate-500">Viewing:</span>
          <div className="flex gap-2">
            {mockChildren.map(child => (
              <button
                key={child.id}
                onClick={() => handleChildChange(child.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                  selectedChild.id === child.id
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                <Avatar src={child.avatar_url} name={child.name} size="sm" />
                <span className="text-sm font-medium">{child.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 sm:p-8 mb-8 border border-emerald-100">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Avatar src={selectedChild.avatar_url} name={selectedChild.name} size="xl" className="ring-4 ring-white shadow-lg" />
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-slate-900 mb-1">{selectedChild.name}</h2>
            <p className="text-slate-600">{selectedChild.grade} • Last session: {last7Days.length > 0 ? format(parseISO(last7Days[0].session_date), 'EEEE') : 'No recent sessions'}</p>
          </div>
          <Link to={`/children/${selectedChild.id}`}>
            <Button variant="secondary" className="gap-2">
              View Profile
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard
          title="Attendance"
          value={`${attendanceRate}%`}
          subtitle="Last 30 days"
          trend={{ value: 8, direction: 'up' }}
          icon={<CalendarDays className="w-5 h-5 text-emerald-600" />}
          accentColor="bg-emerald-50"
        />
        <KPICard
          title="Learning Time"
          value={`${avgDuration}m`}
          subtitle="Avg. session length"
          trend={{ value: 5, direction: 'up' }}
          icon={<Clock className="w-5 h-5 text-sky-600" />}
          accentColor="bg-sky-50"
        />
        <KPICard
          title="Mood Score"
          value={`${moodScore}%`}
          subtitle="Positive moods"
          trend={{ value: 3, direction: 'up' }}
          icon={<Sparkles className="w-5 h-5 text-amber-600" />}
          accentColor="bg-amber-50"
        />
        <KPICard
          title="Activities"
          value={completedActivities}
          subtitle="Completed sessions"
          trend={{ value: 12, direction: 'up' }}
          icon={<CheckCircle2 className="w-5 h-5 text-teal-600" />}
          accentColor="bg-teal-50"
        />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Weekly Progress Chart */}
        <Card className="lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <h3 className="font-semibold text-slate-900">Learning Progress</h3>
              <p className="text-sm text-slate-500">Session duration over time</p>
            </div>
            <div className="flex gap-1 p-1 bg-slate-100 rounded-lg">
              {(['7', '14', '30'] as const).map(range => (
                <button
                  key={range}
                  onClick={() => setTrendRange(range)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    trendRange === range
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {range}d
                </button>
              ))}
            </div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={getTrendData()}>
                <defs>
                  <linearGradient id="colorDuration" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickMargin={8}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickFormatter={(value) => `${value}m`}
                  width={40}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    padding: '12px',
                  }}
                  formatter={(value) => [`${value ?? 0} minutes`, 'Duration']}
                  labelStyle={{ color: '#1e293b', fontWeight: 600, marginBottom: 4 }}
                />
                <Area
                  type="monotone"
                  dataKey="duration"
                  stroke="#0d9488"
                  strokeWidth={2}
                  fill="url(#colorDuration)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Today's Summary */}
        <Card>
          <h3 className="font-semibold text-slate-900 mb-4">Today's Sessions</h3>
          {todayChildren.length > 0 ? (
            <div className="space-y-3">
              <div className="text-sm text-slate-500 mb-3">
                {todayChildren.length} session{todayChildren.length > 1 ? 's' : ''} recorded
              </div>
              {todayChildren.slice(0, 3).map((session, idx) => {
                const child = mockChildren.find(c => c.id === session.child_id);
                return (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <Avatar src={child?.avatar_url} name={child?.name || 'Unknown'} size="sm" />
                    <div>
                      <p className="text-sm font-medium text-slate-700">{child?.name}</p>
                      <p className="text-xs text-slate-500">{session.subject}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                <CalendarDays className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-500">No sessions recorded today</p>
              <Link to="/sessions/new">
                <Button variant="ghost" size="sm" className="mt-2">
                  Add first session
                </Button>
              </Link>
            </div>
          )}
        </Card>
      </div>

      {/* Recent Sessions */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-slate-900">Recent Sessions</h3>
          <Link to={`/children/${selectedChild.id}`} className="text-sm font-medium text-slate-500 hover:text-slate-700">
            View all
          </Link>
        </div>
        <div className="space-y-3">
          {recentSessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <div className="text-center">
                <p className="text-xs font-medium text-slate-400 uppercase">
                  {format(parseISO(session.session_date), 'MMM')}
                </p>
                <p className="text-lg font-semibold text-slate-900">
                  {format(parseISO(session.session_date), 'd')}
                </p>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {session.subject && (
                    <Badge className={subjectColors[session.subject] || ''}>
                      {session.subject}
                    </Badge>
                  )}
                  {session.mood && (
                    <span className="text-lg">{moodEmojis[session.mood]}</span>
                  )}
                </div>
                <p className="text-sm text-slate-600 truncate">
                  {session.activities_completed || 'No activities logged'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">
                  {session.duration_minutes ? `${session.duration_minutes}m` : '-'}
                </p>
                <p className="text-xs text-slate-400">
                  {session.attendance_status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </Layout>
  );
}
