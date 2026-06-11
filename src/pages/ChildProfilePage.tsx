import { useParams, Link } from 'react-router-dom';
import { Layout, Card, Avatar, Badge, Button } from '../components';
import { mockChildren, mockSessions, mockMilestones, moodEmojis, subjectColors } from '../lib/data';
import { Calendar, BookOpen, Trophy, TrendingUp, Mail, ChevronLeft, Edit, Download } from 'lucide-react';
import { format, parseISO, subDays } from 'date-fns';
import { ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from 'recharts';

export default function ChildProfilePage() {
  const { id } = useParams();
  const child = mockChildren.find(c => c.id === id);

  if (!child) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-slate-500">Child not found</p>
          <Link to="/children" className="text-sm font-medium text-slate-900 hover:underline mt-2 inline-block">
            Back to children
          </Link>
        </div>
      </Layout>
    );
  }

  const sessions = mockSessions.filter(s => s.child_id === child.id);
  const milestones = mockMilestones.filter(m => m.child_id === child.id);
  const recentSessions = sessions.slice(0, 15);

  const parseAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const last30Days = sessions.filter(s => {
    const d = parseISO(s.session_date);
    return d >= subDays(new Date(), 30);
  });

  const attendanceRate = last30Days.length > 0
    ? Math.round((last30Days.filter(s => s.attendance_status === 'present').length / last30Days.length) * 100)
    : 0;

  const positiveMoods = last30Days.filter(s => ['happy', 'excited', 'proud'].includes(s.mood || '')).length;
  const moodScore = last30Days.filter(s => s.mood).length > 0
    ? Math.round((positiveMoods / last30Days.filter(s => s.mood).length) * 100)
    : 0;

  const totalDuration = last30Days.filter(s => s.duration_minutes).reduce((acc, s) => acc + (s.duration_minutes || 0), 0);

  const subjectStats = sessions.reduce((acc, s) => {
    if (s.subject) {
      acc[s.subject] = (acc[s.subject] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const subjectData = Object.entries(subjectStats).map(([name, value]) => ({ name, value }));
  const COLORS = ['#0d9488', '#0284c7', '#ea580c', '#dc2626', '#7c3aed', '#0891b2'];

  const moodCounts = sessions.reduce((acc, s) => {
    if (s.mood) {
      acc[s.mood] = (acc[s.mood] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  return (
    <Layout>
      {/* Back button */}
      <Link
        to="/children"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Children
      </Link>

      {/* Profile Header */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-6 sm:p-8 mb-8 border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          <Avatar src={child.avatar_url} name={child.name} size="xl" className="ring-4 ring-white shadow-lg w-24 h-24" />
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl font-semibold text-slate-900">{child.name}</h1>
                <p className="text-slate-500">{child.grade} • {parseAge(child.date_of_birth || '2017-01-01')} years old</p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" className="gap-2">
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </Button>
                <Button variant="ghost" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-slate-600">
              {child.parent_email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{child.parent_email}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 rounded-xl">
              <Calendar className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Attendance</p>
              <p className="text-xl font-semibold text-slate-900">{attendanceRate}%</p>
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 rounded-xl">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Mood Score</p>
              <p className="text-xl font-semibold text-slate-900">{moodScore}%</p>
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sky-50 rounded-xl">
              <BookOpen className="w-5 h-5 text-sky-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Total Time</p>
              <p className="text-xl font-semibold text-slate-900">{Math.round(totalDuration / 60)}h</p>
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-50 rounded-xl">
              <Trophy className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Milestones</p>
              <p className="text-xl font-semibold text-slate-900">{milestones.length}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Session History */}
        <Card className="lg:col-span-2">
          <h3 className="font-semibold text-slate-900 mb-4">Session History</h3>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {recentSessions.map(session => (
              <div
                key={session.id}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <div className="text-center w-16">
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
                      <Badge className={subjectColors[session.subject] || ''} size="sm">
                        {session.subject}
                      </Badge>
                    )}
                    {session.mood && <span className="text-base">{moodEmojis[session.mood]}</span>}
                  </div>
                  <p className="text-sm text-slate-500 truncate">
                    {session.activities_completed || 'Session recorded'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-700">
                    {session.duration_minutes ? `${session.duration_minutes}m` : '-'}
                  </p>
                  <Badge
                    variant={session.attendance_status === 'present' ? 'success' : session.attendance_status === 'late' ? 'warning' : 'danger'}
                    size="sm"
                  >
                    {session.attendance_status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Milestones */}
        <Card>
          <h3 className="font-semibold text-slate-900 mb-4">Milestones</h3>
          {milestones.length > 0 ? (
            <div className="space-y-3">
              {milestones.map(milestone => (
                <div key={milestone.id} className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 text-sm">{milestone.title}</p>
                      {milestone.description && (
                        <p className="text-xs text-slate-500 mt-0.5">{milestone.description}</p>
                      )}
                      {milestone.achieved_date && (
                        <p className="text-xs text-emerald-600 mt-1">
                          {format(parseISO(milestone.achieved_date), 'MMMM d, yyyy')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-400">No milestones yet</p>
            </div>
          )}
        </Card>
      </div>

      {/* Subject Breakdown */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-semibold text-slate-900 mb-4">Subject Distribution</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={subjectData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {subjectData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {subjectData.map((s, i) => (
              <div key={s.name} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="text-xs text-slate-600">{s.name} ({s.value})</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold text-slate-900 mb-4">Mood Distribution</h3>
          <div className="space-y-3">
            {Object.entries(moodCounts).map(([mood, count]) => (
              <div key={mood} className="flex items-center gap-3">
                <span className="text-xl">{moodEmojis[mood]}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-2">
                  <div
                    className="h-full bg-slate-900 rounded-full transition-all duration-500"
                    style={{ width: `${(count / sessions.filter(s => s.mood).length) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-slate-500 w-12 text-right">{count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Layout>
  );
}
