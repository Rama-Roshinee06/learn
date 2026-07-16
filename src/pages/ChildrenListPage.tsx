import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout, Card, Avatar, Badge, Button, Input, Select } from '../components';
import { mockSessions, subjectColors } from '../lib/data';
import { loadChildren, saveChildren, autismLevels, childStatuses, calculateAge, getAgeGroup } from '../lib/children';
import { ChevronRight, Calendar, TrendingUp, Search, Plus, Eye, Edit3, Trash2 } from 'lucide-react';
import { parseISO, differenceInDays } from 'date-fns';

export default function ChildrenListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [autismFilter, setAutismFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [ageFilter, setAgeFilter] = useState('All');
  const [children, setChildren] = useState(loadChildren());
  const [childToDelete, setChildToDelete] = useState<string | null>(null);

  const getChildStats = (childId: string) => {
    const sessions = mockSessions.filter((s) => s.child_id === childId);
    const last30Days = sessions.filter((s) => {
      const d = parseISO(s.session_date);
      return differenceInDays(new Date(), d) <= 30;
    });

    const attendance = last30Days.length > 0
      ? Math.round((last30Days.filter((s) => s.attendance_status === 'present').length / last30Days.length) * 100)
      : 0;

    const subjects = [...new Set(sessions.map((s) => s.subject).filter((value): value is string => Boolean(value)))];

    return {
      totalSessions: sessions.length,
      attendance,
      subjects: subjects.slice(0, 3),
    };
  };

  const filteredChildren = useMemo(() => {
    return children.filter((child) => {
      const matchesSearch = !search || [child.name, child.parent_name, child.child_id].some((value) => value?.toLowerCase().includes(search.toLowerCase()));
      const matchesAutism = autismFilter === 'All' || child.autism_level === autismFilter;
      const matchesStatus = statusFilter === 'All' || child.status === statusFilter;
      const matchesAge = ageFilter === 'All' || getAgeGroup(child.date_of_birth) === ageFilter;
      return matchesSearch && matchesAutism && matchesStatus && matchesAge;
    });
  }, [ageFilter, autismFilter, children, search, statusFilter]);

  const handleDelete = (childId: string) => {
    const nextChildren = children.filter((child) => child.id !== childId);
    setChildren(nextChildren);
    saveChildren(nextChildren);
    setChildToDelete(null);
  };

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 mb-1">Children</h1>
          <p className="text-slate-500">Manage and view all enrolled children</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/children/new">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Child
            </Button>
          </Link>
          <Link to="/sessions/new">
            <Button variant="secondary" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Record Session
            </Button>
          </Link>
        </div>
      </div>

      <Card className="mb-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="md:col-span-2 xl:col-span-1">
            <label className="mb-2 block text-sm font-medium text-slate-700">Search</label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name, parent, or ID" className="pl-9" />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Autism Level</label>
            <Select value={autismFilter} onChange={(e) => setAutismFilter(e.target.value)} options={[{ value: 'All', label: 'All' }, ...autismLevels.map((level) => ({ value: level, label: level }))]} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Status</label>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} options={[{ value: 'All', label: 'All' }, ...childStatuses.map((status) => ({ value: status, label: status }))]} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Age Group</label>
            <Select value={ageFilter} onChange={(e) => setAgeFilter(e.target.value)} options={[{ value: 'All', label: 'All' }, { value: 'Early Years', label: 'Early Years' }, { value: 'Primary', label: 'Primary' }, { value: 'Middle', label: 'Middle' }, { value: 'Teen', label: 'Teen' }]} />
          </div>
        </div>
      </Card>

      {filteredChildren.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-slate-500">No children match the current filters.</p>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredChildren.map((child) => {
            const stats = getChildStats(child.id);
            const age = calculateAge(child.date_of_birth);
            return (
              <Card key={child.id} className="hover:shadow-lg hover:border-slate-200 transition-all duration-200 h-full">
                <div className="flex items-start gap-4 mb-6">
                  <Avatar src={child.avatar_url} name={child.name} size="lg" className="ring-2 ring-slate-100 shadow-sm" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 truncate">{child.name}</h3>
                    <p className="text-sm text-slate-500">{child.child_id} • {age !== null ? `${age} years` : 'Age pending'}</p>
                    <Badge variant={child.status === 'Active' ? 'success' : 'warning'} size="sm" className="mt-1">
                      {child.status}
                    </Badge>
                  </div>
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
                      <span className="text-xs">Sessions</span>
                    </div>
                    <p className="text-lg font-semibold text-slate-900">{stats.totalSessions}</p>
                  </div>
                </div>

                {stats.subjects.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {stats.subjects.map((s) => (
                      <Badge key={s} className={subjectColors[s] || ''} size="sm">
                        {s}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  <Button variant="secondary" size="sm" className="gap-2" onClick={() => navigate(`/children/${child.id}`)}>
                    <Eye className="w-4 h-4" />
                    View
                  </Button>
                  <Button variant="secondary" size="sm" className="gap-2" onClick={() => navigate(`/children/${child.id}/edit`)}>
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button variant="danger" size="sm" className="gap-2" onClick={() => setChildToDelete(child.id)}>
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {childToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <Card className="w-full max-w-md">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Delete child profile?</h3>
            <p className="text-sm text-slate-500 mb-6">This action removes the child record from the system. This cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setChildToDelete(null)}>Cancel</Button>
              <Button variant="danger" onClick={() => handleDelete(childToDelete)}>Confirm Delete</Button>
            </div>
          </Card>
        </div>
      )}
    </Layout>
  );
}
