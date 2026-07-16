import { Child, ChildFormValues } from '../types';

export const childStorageKey = 'calmlearn-children-v1';

const baseChildren: Child[] = [
  {
    id: '1',
    child_id: 'CH-001',
    name: 'Emma Thompson',
    nickname: 'Em',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    date_of_birth: '2017-03-15',
    gender: 'Female',
    autism_level: 'Level 2',
    diagnosis_date: '2019-01-10',
    therapist_name: 'Dr. Maya Patel',
    hospital_name: 'BrightPath Clinic',
    medical_notes: 'Responds well to visual supports and structured routines.',
    parent_name: 'Sarah Thompson',
    relationship: 'Mother',
    phone_number: '+1 555-0142',
    email: 'sarah.t@email.com',
    address: '14 Willow Avenue',
    emergency_contact: '+1 555-0143',
    current_learning_level: 'Level 1',
    preferred_learning_style: 'Visual',
    strengths: 'Strong communication and memory',
    challenges: 'Transitions between tasks',
    interests: 'Drawing and music',
    status: 'Active',
    created_at: '2024-01-01T10:00:00.000Z',
    updated_at: '2024-02-12T10:00:00.000Z',
    grade: '1st Grade',
    parent_email: 'sarah.t@email.com',
  },
  {
    id: '2',
    child_id: 'CH-002',
    name: 'Lucas Chen',
    nickname: 'Lu',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    date_of_birth: '2016-11-22',
    gender: 'Male',
    autism_level: 'Level 3',
    diagnosis_date: '2018-06-14',
    therapist_name: 'Ms. Chloe Reed',
    hospital_name: "Northside Children's Hospital",
    medical_notes: 'Needs extra prompting during group activities.',
    parent_name: 'Mina Chen',
    relationship: 'Mother',
    phone_number: '+1 555-0199',
    email: 'm.chen@email.com',
    address: '89 Harbor Street',
    emergency_contact: '+1 555-0200',
    current_learning_level: 'Level 2',
    preferred_learning_style: 'Hands-on',
    strengths: 'Problem solving and pattern recognition',
    challenges: 'Social interaction',
    interests: 'Robots and coding',
    status: 'Active',
    created_at: '2024-01-05T08:30:00.000Z',
    updated_at: '2024-02-10T08:30:00.000Z',
    grade: '2nd Grade',
    parent_email: 'm.chen@email.com',
  },
  {
    id: '3',
    child_id: 'CH-003',
    name: 'Sofia Martinez',
    nickname: 'Sofi',
    avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    date_of_birth: '2018-07-08',
    gender: 'Female',
    autism_level: 'Level 1',
    diagnosis_date: '2020-03-02',
    therapist_name: 'Dr. Elena Gomez',
    hospital_name: 'Sunrise Therapy Center',
    medical_notes: 'Enjoys calm sensory breaks and reinforcement charts.',
    parent_name: 'Mario Martinez',
    relationship: 'Father',
    phone_number: '+1 555-0155',
    email: 'mario.m@email.com',
    address: '55 Oak Lane',
    emergency_contact: '+1 555-0156',
    current_learning_level: 'Level 1',
    preferred_learning_style: 'Auditory',
    strengths: 'Language and rhythm',
    challenges: 'Fine motor activities',
    interests: 'Storytelling and dance',
    status: 'Inactive',
    created_at: '2024-01-09T11:00:00.000Z',
    updated_at: '2024-02-03T11:00:00.000Z',
    grade: 'Kindergarten',
    parent_email: 'mario.m@email.com',
  },
];

export const autismLevels = ['Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5'];
export const childStatuses = ['Active', 'Inactive'];
export const ageGroups = ['Early Years', 'Primary', 'Middle', 'Teen'];

export function loadChildren(): Child[] {
  if (typeof window === 'undefined') {
    return baseChildren;
  }

  try {
    const stored = window.localStorage.getItem(childStorageKey);
    if (!stored) {
      return baseChildren;
    }

    const parsed = JSON.parse(stored) as Child[];
    return parsed.length > 0 ? parsed : baseChildren;
  } catch {
    return baseChildren;
  }
}

export function saveChildren(children: Child[]) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(childStorageKey, JSON.stringify(children));
}

export function calculateAge(dateOfBirth: string | null | undefined): number | null {
  if (!dateOfBirth) {
    return null;
  }

  const birthDate = new Date(dateOfBirth);
  if (Number.isNaN(birthDate.getTime())) {
    return null;
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }

  return age;
}

export function getAgeGroup(dateOfBirth: string | null | undefined): string {
  const age = calculateAge(dateOfBirth);

  if (age === null) {
    return 'Early Years';
  }
  if (age <= 4) {
    return 'Early Years';
  }
  if (age <= 8) {
    return 'Primary';
  }
  if (age <= 12) {
    return 'Middle';
  }
  return 'Teen';
}

export function validateChildForm(values: ChildFormValues): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!values.name?.trim()) {
    errors.name = 'Child name is required';
  }

  if (!values.date_of_birth) {
    errors.date_of_birth = 'Date of birth is required';
  } else {
    const parsedDate = new Date(values.date_of_birth);
    if (Number.isNaN(parsedDate.getTime())) {
      errors.date_of_birth = 'Enter a valid date';
    }
  }

  if (!values.parent_name?.trim()) {
    errors.parent_name = 'Parent name is required';
  }

  if (!values.phone_number?.trim()) {
    errors.phone_number = 'Phone number is required';
  } else if (!/^\+?[0-9\s()-]{7,15}$/.test(values.phone_number)) {
    errors.phone_number = 'Enter a valid phone number';
  }

  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Enter a valid email address';
  }

  return errors;
}

export function isChildDuplicate(children: Child[], values: ChildFormValues, currentId?: string): boolean {
  const normalizedName = values.name?.trim().toLowerCase() || '';
  const normalizedDob = values.date_of_birth || '';
  const normalizedParent = values.parent_name?.trim().toLowerCase() || '';

  return children.some((child) => {
    if (currentId && child.id === currentId) {
      return false;
    }

    return (
      child.name?.trim().toLowerCase() === normalizedName &&
      child.date_of_birth === normalizedDob &&
      child.parent_name?.trim().toLowerCase() === normalizedParent
    );
  });
}

export function createChildId(existingChildren: Child[]): string {
  const ids = existingChildren
    .map((child) => Number.parseInt((child.child_id || '').split('-').pop() || '0', 10))
    .filter((value) => !Number.isNaN(value));

  const next = ids.length > 0 ? Math.max(...ids) + 1 : 1;
  return `CH-${String(next).padStart(3, '0')}`;
}

export function buildChildFromValues(values: ChildFormValues, existingChildren: Child[], currentChild?: Child): Child {
  const now = new Date().toISOString();

  return {
    id: currentChild?.id || crypto.randomUUID(),
    child_id: currentChild?.child_id || createChildId(existingChildren),
    name: values.name.trim(),
    nickname: values.nickname?.trim() || null,
    avatar_url: values.avatar_url?.trim() || null,
    date_of_birth: values.date_of_birth || null,
    gender: values.gender?.trim() || null,
    autism_level: values.autism_level?.trim() || null,
    diagnosis_date: values.diagnosis_date || null,
    therapist_name: values.therapist_name?.trim() || null,
    hospital_name: values.hospital_name?.trim() || null,
    medical_notes: values.medical_notes?.trim() || null,
    parent_name: values.parent_name?.trim() || null,
    relationship: values.relationship?.trim() || null,
    phone_number: values.phone_number?.trim() || null,
    email: values.email?.trim() || null,
    address: values.address?.trim() || null,
    emergency_contact: values.emergency_contact?.trim() || null,
    current_learning_level: values.current_learning_level?.trim() || null,
    preferred_learning_style: values.preferred_learning_style?.trim() || null,
    strengths: values.strengths?.trim() || null,
    challenges: values.challenges?.trim() || null,
    interests: values.interests?.trim() || null,
    status: values.status || 'Active',
    created_at: currentChild?.created_at || now,
    updated_at: now,
    grade: values.current_learning_level?.trim() || currentChild?.grade || null,
    parent_email: values.email?.trim() || currentChild?.parent_email || null,
  };
}
