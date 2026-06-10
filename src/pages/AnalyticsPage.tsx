import { useState, useEffect } from 'react';
import { Layout, Card, KPICard, Badge, Avatar, Button } from '../components';
import { mockChildren, mockSessions, moodEmojis, subjectColors } from '../lib/data';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  BarChart3,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Activity,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { format, parseISO, subDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';

const SELECTED_CHILD_KEY = 'calmlearn_selected_child';
const COLORS = ['#0d9488', '#0284c7', '#ea580c', '#dc2626', '#7c3aed', '#0891b2', '#6366f1'];

export default function AnalyticsPage() {
  const [selectedChild, setSelectedChild] = useState(mockChildren[0]);
  const [dateRange, setDateRange] = useState<'7' | '14' | '30'>('30');
  const [sessions, setSessions] = useState(mockSessions);

  useEffect(() => {
    const stored = localStorage.getItem(SELECTED_CHILD_KEY);
    if (stored) {
      const child = mockChildren.find(c => c.id === stored);
      if (child) setSelectedChild(child);
    }
  }, []);

  const childSessions = sessions.filter(s => s.child_id === selectedChild.id);

  const days = parseInt(dateRange);
  const filteredSessions = childSessions.filter(s => {
    const d = parseISO(s.session_date);
    return d >= subDays(new Date(), days);
  });

  // Calculate metrics
  const attendanceCount = filteredSessions.filter(s => s.attendance_status === 'present').length;
  const totalCount = filteredSessions.length;
  const attendanceRate = totalCount > 0 ? Math.round((attendanceCount / totalCount) * 100) : 0;

  const lateCount = filteredSessions.filter(s => s.attendance_status === 'late').length;
  const absentCount = filteredSessions.filter(s => s.attendance_status === 'absent').length;

  const sessionsWithDuration = filteredSessions.filter(s => s.duration_minutes && s.duration_minutes > 0);
  const avgDuration = sessionsWithDuration.length > 0
    ? Math.round(sessionsWithDuration.reduce((acc, s) => acc + (s.duration_minutes || 0), 0) / sessionsWithDuration.length)
    : 0;

  const totalDuration = filteredSessions.reduce((acc, s) => acc + (s.duration_minutes || 0), 0);

  // Mood analysis
  const moodCounts = filteredSessions.reduce((acc, s) => {
    if (s.mood) {
      acc[s.mood] = (acc[s.mood] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const positiveMoods = ['happy', 'excited', 'proud'].reduce((acc, m) => acc + (moodCounts[m] || 0), 0);
  const totalMoodCount = Object.values(moodCounts).reduce((acc, c) => acc + c, 0);
  const positiveMoodRate = totalMoodCount > 0 ? Math.round((positiveMoods / totalMoodCount) * 100) : 0;

  const moodData = Object.entries(moodCounts).map(([name, count]) => ({
    name,
    value: count,
    emoji: moodEmojis[name] || ''
  }));

  // Subject analysis
  const subjectStats = filteredSessions.reduce((acc, s) => {
    if (s.subject) {
      acc[s.subject] = (acc[s.subject] || 0) + (s.duration_minutes || 0);
    }
    return acc;
  }, {} as Record<string, number>);

  const subjectTimeData = Object.entries(subjectStats).map(([name, duration]) => ({
    name,
    duration,
    sessions: filteredSessions.filter(s => s.subject === name).length,
  }));

  const subjectPieData = subjectTimeData.map(s => ({ name: s.name, value: s.duration }));

  // Progress trend
  const progressData = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(new Date(), i);
    const daySessions = filteredSessions.filter(s => isSameDay(parseISO(s.session_date), date));
    const dayDuration = daySessions.reduce((acc, s) => acc + (s.duration_minutes || 0), 0);
    const positiveMoodsDay = daySessions.filter(s => ['happy', 'excited', 'proud'].includes(s.mood || '')).length;
    const totalMoodsDay = daySessions.filter(s => s.mood).length;
    const moodRate = totalMoodsDay > 0 ? Math.round((positiveMoodsDay / totalMoodsDay) * 100) : 50;

    progressData.push({
      date: format(date, days > 14 ? 'MMM dd' : 'EEE'),
      duration: dayDuration,
      moodRate,
      sessions: daySessions.length,
    });
  }

  // Weekly pattern
  const weekDaySessions = childSessions.reduce((acc, s) => {
    const dayOfWeek = format(parseISO(s.session_date), 'EEEE');
    acc[dayOfWeek] = (acc[dayOfWeek] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const weekDayData = weekDays.map(d => ({
    day: d.slice(0, 3),
    sessions: weekDaySessions[d] || 0,
  }));

  // Insights
  const insights = [];
  if (lateCount > 3) {
    insights.push({ type: 'warning', text: `${lateCount} late arrivals in the past ${days} days. Consider checking morning routine.` });
  }
  if (positiveMoodRate >= 80) {
    insights.push({ type: 'success', text: 'Excellent emotional engagement! Child shows mostly positive moods.' });
  }
  if (positiveMoodRate < 50) {
    insights.push({ type: 'alert', text: 'Low positive mood rate detected. May need additional support or adjustments.' });
  }
  if (avgDuration >= 45) {
    insights.push({ type: 'success', text: `Strong focus duration averaging ${avgDuration} minutes per session.` });
  }
  if (subjectStats['Mathematics'] > (subjectStats['Reading'] || 0) * 1.5) {
    insights.push({ type: 'info', text: 'Strong emphasis on Mathematics. Consider expanding to other subjects.' });
  }

  return (
    <Layout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 mb-1">Progress Analytics</h1>
          <p className="text-slate-500">Detailed learning insights and trends</p>
        </div>
        <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
          {(['7', '14', '30'] as const).map(range => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                dateRange === range
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {range} Days
            </button>
          ))}
        </div>
      </div>

      {/* Child Selector */}
      <Card className="mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-slate-500">Analyzing:</span>
          <div className="flex gap-2">
            {mockChildren.map(child => (
              <button
                key={child.id}
                onClick={() => setSelectedChild(child)}
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

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard
          title="Attendance Rate"
          value={`${attendanceRate}%`}
          subtitle={`${attendanceCount} of ${totalCount} sessions`}
          trend={{ value: 5, direction: attendanceRate >= 85 ? 'up' : attendanceRate >= 70 ? 'neutral' : 'down' }}
          icon={<Calendar className="w-5 h-5 text-emerald-600" />}
          accentColor="bg-emerald-50"
        />
        <KPICard
          title="Avg Duration"
          value={`${avgDuration}m`}
          subtitle={`Total: ${Math.round(totalDuration / 60)}h`}
          trend={{ value: 8, direction: 'up' }}
          icon={<Clock className="w-5 h-5 text-sky-600" />}
          accentColor="bg-sky-50"
        />
        <KPICard
          title="Positive Mood"
          value={`${positiveMoodRate}%`}
          subtitle={`${positiveMoods} positive sessions`}
          trend={{ value: 3, direction: positiveMoodRate >= 70 ? 'up' : positiveMoodRate >= 50 ? 'neutral' : 'down' }}
          icon={<Activity className="w-5 h-5 text-amber-600" />}
          accentColor="bg-amber-50"
        />
        <KPICard
          title="Total Sessions"
          value={filteredSessions.length}
          subtitle="Recorded period"
          icon={<BarChart3 className="w-5 h-5 text-teal-600" />}
          accentColor="bg-teal-50"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Progress Trend */}
        <Card className="lg:col-span-2">
          <h3 className="font-semibold text-slate-900 mb-1">Learning Progress Trend</h3>
          <p className="text-sm text-slate-500 mb-4">Duration and mood over time</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={progressData}>
                <defs>
                  <linearGradient id="colorDuration2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickMargin={8}
                />
                <YAxis
                  yAxisId="left"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickFormatter={(v) => `${v}m`}
                  width={45}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickFormatter={(v) => `${v}%`}
                  width={45}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="duration"
                  stroke="#0d9488"
                  strokeWidth={2}
                  fill="url(#colorDuration2)"
                  name="Duration (min)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="moodRate"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={false}
                  name="Mood Score (%)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-teal-500" />
              <span className="text-slate-600">Duration</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-amber-500" />
              <span className="text-slate-600">Mood Score</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Subject Distribution */}
        <Card className="lg:col-span-2">
          <h3 className="font-semibold text-slate-900 mb-4">Subject Time Allocation</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectTimeData} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  width={80}
                />
                <Tooltip
                  formatter={(value: number) => [`${value} minutes`, 'Duration']}
                  contentStyle={{ borderRadius: '12px' }}
                />
                <Bar dataKey="duration" fill="#0d9488" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Mood Distribution */}
        <Card>
          <h3 className="font-semibold text-slate-900 mb-4">Mood Distribution</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={moodData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={65}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ emoji }) => emoji}
                  labelLine={false}
                >
                  {moodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {moodData.map((m, i) => (
              <div key={m.name} className="flex items-center gap-1.5">
                <span className="text-sm">{m.emoji}</span>
                <span className="text-xs text-slate-500">
                  {m.value}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Charts Row 3 */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Weekly Pattern */}
        <Card>
          <h3 className="font-semibold text-slate-900 mb-4">Session Pattern by Day</h3>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekDayData}>
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} width={30} />
                <Tooltip />
                <Bar dataKey="sessions" fill="#64748b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Attendance Breakdown */}
        <Card>
          <h3 className="font-semibold text-slate-900 mb-4">Attendance Breakdown</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-emerald-50 rounded-xl">
              <p className="text-3xl font-semibold text-emerald-600">{attendanceCount}</p>
              <p className="text-xs text-emerald-700 mt-1">Present</p>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-xl">
              <p className="text-3xl font-semibold text-amber-600">{lateCount}</p>
              <p className="text-xs text-amber-700 mt-1">Late</p>
            </div>
            <div className="text-center p-4 bg-rose-50 rounded-xl">
              <p className="text-3xl font-semibold text-rose-600">{absentCount}</p>
              <p className="text-xs text-rose-700 mt-1">Absent</p>
            </div>
          </div>
          <div className="mt-4 h-4 bg-slate-100 rounded-full overflow-hidden flex">
            <div
              className="bg-emerald-500"
              style={{ width: `${totalCount > 0 ? (attendanceCount / totalCount) * 100 : 0}%` }}
            />
            <div
              className="bg-amber-500"
              style={{ width: `${totalCount > 0 ? (lateCount / totalCount) * 100 : 0}%` }}
            />
            <div
              className="bg-rose-500"
              style={{ width: `${totalCount > 0 ? (absentCount / totalCount) * 100 : 0}%` }}
            />
          </div>
        </Card>
      </div>

      {/* Insights */}
      <Card>
        <h3 className="font-semibold text-slate-900 mb-4">Insights & Recommendations</h3>
        <div className="space-y-3">
          {insights.length > 0 ? insights.map((insight, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 p-4 rounded-xl ${
                insight.type === 'success'
                  ? 'bg-emerald-50'
                  : insight.type === 'warning'
                  ? 'bg-amber-50'
                  : insight.type === 'alert'
                  ? 'bg-rose-50'
                  : 'bg-sky-50'
              }`}
            >
              {insight.type === 'success' && (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
              )}
              {insight.type === 'warning' && (
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
              )}
              {insight.type === 'alert' && (
                <TrendingDown className="w-5 h-5 text-rose-600 mt-0.5" />
              )}
              {insight.type === 'info' && (
                <TrendingUp className="w-5 h-5 text-sky-600 mt-0.5" />
              )}
              <p className={`text-sm ${
                insight.type === 'success'
                  ? 'text-emerald-700'
                  : insight.type === 'warning'
                  ? 'text-amber-700'
                  : insight.type === 'alert'
                  ? 'text-rose-700'
                  : 'text-sky-700'
              }`}>
                {insight.text}
              </p>
            </div>
          )) : (
            <div className="text-center py-8 text-slate-500">
              <CheckCircle2 className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <p>Great progress! No specific insights at this time.</p>
            </div>
          )}
        </div>
      </Card>
    </Layout>
  );
}
