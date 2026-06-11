import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Card, Button, Select, Textarea, Avatar } from '../components';
import { mockChildren, moodEmojis, moodColors, subjectColors } from '../lib/data';
import { supabase } from '../lib/supabase';
import { Save, Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';

const MOODS = ['happy', 'excited', 'neutral', 'tired', 'sad', 'anxious', 'proud', 'curious'];
const SUBJECTS = ['Mathematics', 'Reading', 'Science', 'Art', 'Social Studies', 'Coding', 'Music'];
const ATTENDANCE_OPTIONS = [
  { value: 'present', label: 'Present' },
  { value: 'late', label: 'Late' },
  { value: 'absent', label: 'Absent' },
];

export default function NewSessionPage() {
  const navigate = useNavigate();
  const [selectedChildId, setSelectedChildId] = useState(mockChildren[0].id);
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [attendance, setAttendance] = useState('present');
  const [mood, setMood] = useState<string | null>(null);
  const [subject, setSubject] = useState('');
  const [activities, setActivities] = useState('');
  const [notes, setNotes] = useState('');
  const [duration, setDuration] = useState('45');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase.from('sessions').insert({
        child_id: selectedChildId,
        session_date: date,
        attendance_status: attendance,
        mood: attendance === 'absent' ? null : mood,
        subject: attendance === 'absent' ? null : subject || null,
        activities_completed: attendance === 'absent' ? null : activities || null,
        notes: notes || null,
        duration_minutes: attendance === 'absent' ? 0 : parseInt(duration) || null,
      });

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      console.error('Failed to save session:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleChildChange = (childId: string) => {
    setSelectedChildId(childId);
    localStorage.setItem('calmlearn_selected_child', childId);
  };

  if (success) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">Session Saved!</h2>
          <p className="text-slate-500">Redirecting to dashboard...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-900 mb-1">New Session</h1>
          <p className="text-slate-500">Record today's learning activities</p>
        </div>

        <Card padding="lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Child Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">Select Child</label>
              <div className="flex flex-wrap gap-3">
                {mockChildren.map(child => (
                  <button
                    key={child.id}
                    type="button"
                    onClick={() => handleChildChange(child.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                      selectedChildId === child.id
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Avatar src={child.avatar_url} name={child.name} size="sm" />
                    <div className="text-left">
                      <p className={`font-medium text-sm ${selectedChildId === child.id ? 'text-white' : 'text-slate-900'}`}>
                        {child.name}
                      </p>
                      <p className={`text-xs ${selectedChildId === child.id ? 'text-slate-300' : 'text-slate-500'}`}>
                        {child.grade}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Date and Attendance */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Session Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full pl-12 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-opacity-20"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Attendance Status</label>
                <Select
                  value={attendance}
                  onChange={e => setAttendance(e.target.value)}
                  options={ATTENDANCE_OPTIONS}
                />
              </div>
            </div>

            {/* Mood Selector (only if not absent) */}
            {attendance !== 'absent' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">How was their mood today?</label>
                <div className="flex flex-wrap gap-2">
                  {MOODS.map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMood(m)}
                      className={`flex flex-col items-center gap-1 px-4 py-3 rounded-xl border transition-all ${
                        mood === m
                          ? `${moodColors[m]} border-current scale-105 shadow-sm`
                          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      <span className="text-2xl">{moodEmojis[m]}</span>
                      <span className="text-xs font-medium capitalize">{m}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Subject */}
            {attendance !== 'absent' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                <div className="flex flex-wrap gap-2">
                  {SUBJECTS.map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSubject(s)}
                      className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                        subject === s
                          ? `${subjectColors[s]} border-current`
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Duration */}
            {attendance !== 'absent' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Session Duration (minutes)</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="number"
                    value={duration}
                    onChange={e => setDuration(e.target.value)}
                    min="0"
                    max="480"
                    className="w-full pl-12 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-opacity-20"
                    placeholder="45"
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  {['15', '30', '45', '60', '90'].map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDuration(d)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                        duration === d
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {d}m
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Activities */}
            {attendance !== 'absent' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Activities Completed</label>
                <Textarea
                  value={activities}
                  onChange={e => setActivities(e.target.value)}
                  placeholder="e.g., Counting to 100, Addition practice, Reading sight words..."
                  className="resize-none"
                />
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Additional Notes</label>
              <Textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Any observations or notes..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate(-1)}
                className="mr-3"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving || !selectedChildId}
                className="gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Session
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
}
