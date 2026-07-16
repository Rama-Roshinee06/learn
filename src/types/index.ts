export interface Child {
  id: string;
  child_id: string;
  name: string;
  nickname: string | null;
  avatar_url: string | null;
  date_of_birth: string | null;
  gender: string | null;
  autism_level: string | null;
  diagnosis_date: string | null;
  therapist_name: string | null;
  hospital_name: string | null;
  medical_notes: string | null;
  parent_name: string | null;
  relationship: string | null;
  phone_number: string | null;
  email: string | null;
  address: string | null;
  emergency_contact: string | null;
  current_learning_level: string | null;
  preferred_learning_style: string | null;
  strengths: string | null;
  challenges: string | null;
  interests: string | null;
  status: string | null;
  created_at: string;
  updated_at: string;
  grade: string | null;
  parent_email: string | null;
}

export interface ChildFormValues {
  name: string;
  nickname: string;
  date_of_birth: string;
  gender: string;
  autism_level: string;
  diagnosis_date: string;
  therapist_name: string;
  hospital_name: string;
  medical_notes: string;
  parent_name: string;
  relationship: string;
  phone_number: string;
  email: string;
  address: string;
  emergency_contact: string;
  current_learning_level: string;
  preferred_learning_style: string;
  strengths: string;
  challenges: string;
  interests: string;
  status: string;
  avatar_url: string;
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
