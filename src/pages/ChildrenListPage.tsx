import { Link } from 'react-router-dom';
import { Layout, Card, Avatar, Badge, Button } from '../components';
import { mockChildren, mockSessions, subjectColors } from '../lib/data';
import { ChevronRight, Calendar, TrendingUp } from 'lucide-react';
import { parseISO, differenceInDays } from 'date-fns';

export default function ChildrenListPage() {
  const getChildStats = (childId: string) => {
    const sessions = mockSessions.filter(s => s.child_id === childId);
    const last30Days = sessions.filter(s => {
      const d = parseISO(s.session_date);
      return differenceInDays(new Date(), d) <= 30;
    });

    const attendance = last30Days.length > 0
      ? Math.round((last30Days.filter(s => s.attendance_status === 'present').length / last30Days.length) * 100)
      : 0;

    const subjects = [...new Set(sessions.map(s => s.subject).filter((value): value is string => Boolean(value)))];
    const recentSessions = sessions.slice(0, 8);

    return {
      totalSessions: sessions.length,
      attendance,
      subjects: subjects.slice(0, 3),
      recentSessions,
    };
  };

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 mb-1">Children</h1>
          <p className="text-slate-500">Manage and view all enrolled children</p>
        </div>
        <Link to="/sessions/new">
          <Button className="gap-2">
            <TrendingUp className="w-4 h-4" />
            Record Session
          </Button>
        </Link>
      </div>

      {/* Grid of children */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockChildren.map(child => {
          const stats = getChildStats(child.id);
          return (
            <Link key={child.id} to={`/children/${child.id}`}>
              <Card className="hover:shadow-lg hover:border-slate-200 transition-all duration-200 h-full">
                <div className="flex items-start gap-4 mb-6">
                  <Avatar src={child.avatar_url} name={child.name} size="lg" className="ring-2 ring-slate-100 shadow-sm" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 truncate">{child.name}</h3>
                    <p className="text-sm text-slate-500">{child.grade}</p>
                    <Badge variant="info" size="sm" className="mt-1">
                      {stats.totalSessions} sessions
                    </Badge>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 mt-2" />
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-slate-50 rounded-xl p-3">
                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                      <Calendar className="w-4 h-4" />
                      <span className="text-xs">Attendance</span>
                    </div>
                    <p className="text-lg font-semibold text-slate-900">{stats.attendance}%</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3">
                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-xs">Progress</span>
                    </div>
                    <p className="text-lg font-semibold text-slate-900">{stats.totalSessions > 20 ? 'On Track' : 'Growing'}</p>
                  </div>
                </div>

                {stats.subjects.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {stats.subjects.map(s => (
                      <Badge key={s} className={subjectColors[s] || ''} size="sm">
                        {s}
                      </Badge>
                    ))}
                  </div>
                )}
              </Card>
            </Link>
          );
        })}
      </div>
    </Layout>
  );
}
