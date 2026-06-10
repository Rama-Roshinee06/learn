export interface Child {
  id: string;
  name: string;
  avatar_url: string | null;
  date_of_birth: string | null;
  grade: string | null;
  parent_email: string | null;
}

export interface Session {
  id: string;
  child_id: string;
  session_date: string;
  attendance_status: 'present' | 'absent' | 'late';
  mood: string | null;
  subject: string | null;
  activities_completed: string | null;
  notes: string | null;
  duration_minutes: number | null;
}

export interface Milestone {
  id: string;
  child_id: string;
  title: string;
  description: string | null;
  achieved_date: string | null;
  category: string | null;
}

export interface KPICard {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
  icon?: React.ReactNode;
}
