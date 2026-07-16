import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Layout, Card, Button, Input, Select, Textarea } from '../components';
import { loadChildren, saveChildren, validateChildForm, isChildDuplicate, buildChildFromValues, autismLevels, childStatuses } from '../lib/children';
import { Child, ChildFormValues } from '../types';
import { ChevronLeft, Save, AlertCircle } from 'lucide-react';

const emptyValues: ChildFormValues = {
  name: '',
  nickname: '',
  date_of_birth: '',
  gender: '',
  autism_level: '',
  diagnosis_date: '',
  therapist_name: '',
  hospital_name: '',
  medical_notes: '',
  parent_name: '',
  relationship: '',
  phone_number: '',
  email: '',
  address: '',
  emergency_contact: '',
  current_learning_level: '',
  preferred_learning_style: '',
  strengths: '',
  challenges: '',
  interests: '',
  status: 'Active',
  avatar_url: '',
};

export default function ChildFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [values, setValues] = useState<ChildFormValues>(emptyValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const isEditing = Boolean(id);

  const existingChildren = useMemo(() => loadChildren(), [id]);
  const currentChild = useMemo(() => existingChildren.find((child) => child.id === id), [existingChildren, id]);

  useEffect(() => {
    if (currentChild) {
      setValues({
        name: currentChild.name || '',
        nickname: currentChild.nickname || '',
        date_of_birth: currentChild.date_of_birth || '',
        gender: currentChild.gender || '',
        autism_level: currentChild.autism_level || '',
        diagnosis_date: currentChild.diagnosis_date || '',
        therapist_name: currentChild.therapist_name || '',
        hospital_name: currentChild.hospital_name || '',
        medical_notes: currentChild.medical_notes || '',
        parent_name: currentChild.parent_name || '',
        relationship: currentChild.relationship || '',
        phone_number: currentChild.phone_number || '',
        email: currentChild.email || '',
        address: currentChild.address || '',
        emergency_contact: currentChild.emergency_contact || '',
        current_learning_level: currentChild.current_learning_level || '',
        preferred_learning_style: currentChild.preferred_learning_style || '',
        strengths: currentChild.strengths || '',
        challenges: currentChild.challenges || '',
        interests: currentChild.interests || '',
        status: currentChild.status || 'Active',
        avatar_url: currentChild.avatar_url || '',
      });
    }
  }, [currentChild]);

  const handleChange = (field: keyof ChildFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    const validationErrors = validateChildForm(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    const children = loadChildren();
    if (isChildDuplicate(children, values, currentChild?.id)) {
      setErrors({ name: 'A matching child profile already exists.' });
      setIsSubmitting(false);
      return;
    }

    const nextChild = buildChildFromValues(values, children, currentChild);
    const updatedChildren = currentChild
      ? children.map((child) => (child.id === currentChild.id ? nextChild : child))
      : [nextChild, ...children];

    saveChildren(updatedChildren);
    setSubmitMessage(isEditing ? 'Child profile updated successfully.' : 'Child profile created successfully.');
    setIsSubmitting(false);
    navigate(`/children/${nextChild.id}`);
  };

  return (
    <Layout>
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link to="/children" className="inline-flex items-center gap-2 hover:text-slate-700">
          <ChevronLeft className="w-4 h-4" />
          Back to children
        </Link>
      </div>

      <Card className="max-w-5xl mx-auto">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">{isEditing ? 'Edit Child' : 'Add Child'}</h1>
            <p className="text-slate-500 mt-1">Capture the child's profile details and caregiver information.</p>
          </div>
        </div>

        {submitMessage && (
          <div className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <AlertCircle className="w-4 h-4" />
            {submitMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <section className="grid gap-6 lg:grid-cols-2">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Basic Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Child Name</label>
                  <Input value={values.name} onChange={(e) => handleChange('name', e.target.value)} />
                  {errors.name && <p className="mt-1 text-sm text-rose-500">{errors.name}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Nickname</label>
                  <Input value={values.nickname} onChange={(e) => handleChange('nickname', e.target.value)} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Date of Birth</label>
                  <Input type="date" value={values.date_of_birth} onChange={(e) => handleChange('date_of_birth', e.target.value)} />
                  {errors.date_of_birth && <p className="mt-1 text-sm text-rose-500">{errors.date_of_birth}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Gender</label>
                  <Input value={values.gender} onChange={(e) => handleChange('gender', e.target.value)} placeholder="e.g. Female" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Profile Photo URL</label>
                  <Input value={values.avatar_url} onChange={(e) => handleChange('avatar_url', e.target.value)} placeholder="https://..." />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Medical Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Autism Level</label>
                  <Select value={values.autism_level} onChange={(e) => handleChange('autism_level', e.target.value)} options={[{ value: '', label: 'Select level' }, ...autismLevels.map((level) => ({ value: level, label: level }))]} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Diagnosis Date</label>
                  <Input type="date" value={values.diagnosis_date} onChange={(e) => handleChange('diagnosis_date', e.target.value)} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Therapist Name</label>
                  <Input value={values.therapist_name} onChange={(e) => handleChange('therapist_name', e.target.value)} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Hospital / Clinic</label>
                  <Input value={values.hospital_name} onChange={(e) => handleChange('hospital_name', e.target.value)} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Medical Notes</label>
                  <Textarea value={values.medical_notes} onChange={(e) => handleChange('medical_notes', e.target.value)} />
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Parent Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Parent Name</label>
                  <Input value={values.parent_name} onChange={(e) => handleChange('parent_name', e.target.value)} />
                  {errors.parent_name && <p className="mt-1 text-sm text-rose-500">{errors.parent_name}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Relationship</label>
                  <Input value={values.relationship} onChange={(e) => handleChange('relationship', e.target.value)} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Phone Number</label>
                  <Input value={values.phone_number} onChange={(e) => handleChange('phone_number', e.target.value)} />
                  {errors.phone_number && <p className="mt-1 text-sm text-rose-500">{errors.phone_number}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
                  <Input type="email" value={values.email} onChange={(e) => handleChange('email', e.target.value)} />
                  {errors.email && <p className="mt-1 text-sm text-rose-500">{errors.email}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Address</label>
                  <Textarea value={values.address} onChange={(e) => handleChange('address', e.target.value)} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Emergency Contact</label>
                  <Input value={values.emergency_contact} onChange={(e) => handleChange('emergency_contact', e.target.value)} />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Learning Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Current Learning Level</label>
                  <Input value={values.current_learning_level} onChange={(e) => handleChange('current_learning_level', e.target.value)} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Preferred Learning Style</label>
                  <Input value={values.preferred_learning_style} onChange={(e) => handleChange('preferred_learning_style', e.target.value)} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Strengths</label>
                  <Textarea value={values.strengths} onChange={(e) => handleChange('strengths', e.target.value)} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Challenges</label>
                  <Textarea value={values.challenges} onChange={(e) => handleChange('challenges', e.target.value)} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Interests</label>
                  <Textarea value={values.interests} onChange={(e) => handleChange('interests', e.target.value)} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Status</label>
                  <Select value={values.status} onChange={(e) => handleChange('status', e.target.value)} options={[{ value: 'Active', label: 'Active' }, { value: 'Inactive', label: 'Inactive' }]} />
                </div>
              </div>
            </div>
          </section>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link to="/children">
              <Button variant="secondary">Cancel</Button>
            </Link>
            <Button type="submit" className="gap-2" disabled={isSubmitting}>
              <Save className="w-4 h-4" />
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Child' : 'Create Child'}
            </Button>
          </div>
        </form>
      </Card>
    </Layout>
  );
}
