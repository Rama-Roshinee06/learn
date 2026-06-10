import { Child, Session, Milestone } from '../types';

export const mockChildren: Child[] = [
  {
    id: '1',
    name: 'Emma Thompson',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    date_of_birth: '2017-03-15',
    grade: '1st Grade',
    parent_email: 'sarah.t@email.com',
  },
  {
    id: '2',
    name: 'Lucas Chen',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    date_of_birth: '2016-11-22',
    grade: '2nd Grade',
    parent_email: 'm.chen@email.com',
  },
  {
    id: '3',
    name: 'Sofia Martinez',
    avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    date_of_birth: '2018-07-08',
    grade: 'Kindergarten',
    parent_email: 'mario.m@email.com',
  },
];

const subjects = ['Mathematics', 'Reading', 'Science', 'Art', 'Social Studies', 'Coding', 'Music'];
const moods = ['happy', 'excited', 'neutral', 'tired', 'sad'];
const attendanceStatuses: ('present' | 'absent' | 'late')[] = ['present', 'present', 'present', 'present', 'late', 'absent'];

const activities: Record<string, string[]> = {
  'Mathematics': ['Counting exercises', 'Addition practice', 'Subtraction basics', 'Math games', 'Number patterns', 'Word problems'],
  'Reading': ['Sight words', 'Phonics', 'Story time', 'Reading comprehension', 'Vocabulary building', 'Guided reading'],
  'Science': ['Nature observation', 'Simple experiments', 'Life cycles', 'Weather study', 'Habitat exploration'],
  'Art': ['Drawing', 'Painting', 'Clay modeling', 'Crafts', 'Mixed media'],
  'Social Studies': ['Community helpers', 'Map skills', 'Cultural traditions', 'Geography basics'],
  'Coding': ['Scratch basics', 'Simple animation', 'Logic puzzles', 'Game design'],
  'Music': ['Songs and rhymes', 'Rhythm activities', 'Instrument exploration', 'Movement to music'],
};

function generateSessions(childId: string, daysBack: number = 30): Session[] {
  const sessions: Session[] = [];
  for (let i = 0; i < daysBack; i++) {
    if (Math.random() > 0.2) {
      const subject = subjects[Math.floor(Math.random() * subjects.length)];
      const mood = moods[Math.floor(Math.random() * moods.length)];
      const attendance = attendanceStatuses[Math.floor(Math.random() * attendanceStatuses.length)];
      const subjActivities = activities[subject] || ['General activities'];
      const completedActivities = subjActivities.slice(0, Math.floor(Math.random() * 2) + 1).join(', ');

      sessions.push({
        id: `${childId}-${i}`,
        child_id: childId,
        session_date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        attendance_status: attendance,
        mood: attendance === 'absent' ? null : mood,
        subject: attendance === 'absent' ? null : subject,
        activities_completed: attendance === 'absent' ? null : completedActivities,
        notes: null,
        duration_minutes: attendance === 'absent' ? 0 : Math.floor(Math.random() * 30) + 25,
      });
    }
  }
  return sessions;
}

export const mockSessions: Session[] = [
  ...generateSessions('1', 30),
  ...generateSessions('2', 30),
  ...generateSessions('3', 30),
];

export const mockMilestones: Milestone[] = [
  { id: '1', child_id: '1', title: 'Reading Level 5 Achieved', description: 'Successfully reading at Level 5 with comprehension', achieved_date: '2024-01-15', category: 'Reading' },
  { id: '2', child_id: '1', title: 'Math Facts Master', description: 'Completed addition facts to 20', achieved_date: '2024-01-20', category: 'Mathematics' },
  { id: '3', child_id: '1', title: 'Perfect Attendance', description: 'One full month of perfect attendance', achieved_date: '2024-01-25', category: 'Attendance' },
  { id: '4', child_id: '2', title: 'Multiplication Master', description: 'Mastered multiplication tables 1-10', achieved_date: '2024-01-28', category: 'Mathematics' },
  { id: '5', child_id: '2', title: 'First Coding Project', description: 'Completed first Scratch animation independently', achieved_date: '2024-02-01', category: 'Coding' },
  { id: '6', child_id: '3', title: 'Letter Recognition Complete', description: 'Identifies all uppercase and lowercase letters', achieved_date: '2024-01-21', category: 'Reading' },
  { id: '7', child_id: '3', title: 'Counting to 20', description: 'Successfully counts to 20 with one-to-one correspondence', achieved_date: '2024-02-05', category: 'Mathematics' },
];

export const moodEmojis: Record<string, string> = {
  happy: '😊',
  excited: '🤩',
  neutral: '😐',
  tired: '😴',
  sad: '😢',
  anxious: '😰',
  proud: '🌟',
  curious: '🤔',
};

export const moodColors: Record<string, string> = {
  happy: 'bg-amber-50 text-amber-700 border-amber-200',
  excited: 'bg-rose-50 text-rose-700 border-rose-200',
  neutral: 'bg-slate-50 text-slate-700 border-slate-200',
  tired: 'bg-sky-50 text-sky-700 border-sky-200',
  sad: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  anxious: 'bg-orange-50 text-orange-700 border-orange-200',
  proud: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  curious: 'bg-teal-50 text-teal-700 border-teal-200',
};

export const subjectColors: Record<string, string> = {
  'Mathematics': 'bg-sky-50 text-sky-700 border-sky-200',
  'Reading': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Science': 'bg-amber-50 text-amber-700 border-amber-200',
  'Art': 'bg-rose-50 text-rose-700 border-rose-200',
  'Social Studies': 'bg-violet-50 text-violet-700 border-violet-200',
  'Coding': 'bg-teal-50 text-teal-700 border-teal-200',
  'Music': 'bg-pink-50 text-pink-700 border-pink-200',
};
