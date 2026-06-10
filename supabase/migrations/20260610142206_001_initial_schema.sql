-- Children table
CREATE TABLE children (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  avatar_url TEXT,
  date_of_birth DATE,
  grade TEXT,
  parent_email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sessions table  
CREATE TABLE sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id UUID REFERENCES children(id) ON DELETE CASCADE NOT NULL,
  session_date DATE NOT NULL DEFAULT CURRENT_DATE,
  attendance_status TEXT CHECK (attendance_status IN ('present', 'absent', 'late')) NOT NULL DEFAULT 'present',
  mood TEXT,
  subject TEXT,
  activities_completed TEXT,
  notes TEXT,
  duration_minutes INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Milestones table
CREATE TABLE milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id UUID REFERENCES children(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  achieved_date DATE,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE children ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;

-- RLS Policies for children
CREATE POLICY "select_children" ON children FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert_children" ON children FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "update_children" ON children FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_children" ON children FOR DELETE TO authenticated USING (true);

-- RLS Policies for sessions
CREATE POLICY "select_sessions" ON sessions FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert_sessions" ON sessions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "update_sessions" ON sessions FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_sessions" ON sessions FOR DELETE TO authenticated USING (true);

-- RLS Policies for milestones
CREATE POLICY "select_milestones" ON milestones FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert_milestones" ON milestones FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "update_milestones" ON milestones FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_milestones" ON milestones FOR DELETE TO authenticated USING (true);

-- Insert sample children
INSERT INTO children (id, name, avatar_url, date_of_birth, grade, parent_email) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Emma Thompson', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face', '2017-03-15', '1st Grade', 'sarah.t@email.com'),
  ('22222222-2222-2222-2222-222222222222', 'Lucas Chen', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', '2016-11-22', '2nd Grade', 'm.chen@email.com'),
  ('33333333-3333-3333-3333-333333333333', 'Sofia Martinez', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', '2018-07-08', 'Kindergarten', 'mario.m@email.com');

-- Insert sample sessions for Emma (past 30 days)
INSERT INTO sessions (child_id, session_date, attendance_status, mood, subject, activities_completed, duration_minutes) VALUES
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - 30, 'present', 'happy', 'Mathematics', 'Counting to 100, Addition basics', 45),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - 29, 'present', 'happy', 'Reading', 'Sight words practice, Story time', 40),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - 28, 'present', 'neutral', 'Science', 'Weather observation, Plant growing', 35),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - 27, 'late', 'happy', 'Mathematics', 'Subtraction intro, Number patterns', 40),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - 26, 'present', 'excited', 'Art', 'Watercolor painting, Clay modeling', 50),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - 25, 'present', 'happy', 'Reading', 'Phonics games, Reading comprehension', 45),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - 23, 'present', 'happy', 'Mathematics', 'Adding doubles, Word problems', 45),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - 22, 'absent', NULL, NULL, NULL, 0),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - 21, 'present', 'neutral', 'Science', 'Life cycles, Butterfly project', 40),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - 20, 'present', 'happy', 'Reading', 'Chapter book reading, Vocabulary', 50),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - 19, 'present', 'excited', 'Mathematics', 'Geometry shapes, Pattern blocks', 45),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - 18, 'present', 'happy', 'Social Studies', 'Community helpers, Map skills', 35),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - 16, 'late', 'neutral', 'Reading', 'Guided reading, Writing practice', 40),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - 15, 'present', 'happy', 'Science', 'Magnets exploration, Simple experiments', 45),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - 14, 'present', 'happy', 'Mathematics', 'Telling time, Money counting', 50),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - 13, 'present', 'excited', 'Art', 'Mixed media collage, Self portrait', 55),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - 12, 'present', 'happy', 'Reading', 'Poetry unit, Rhyming words', 40),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - 11, 'present', 'neutral', 'Mathematics', 'Measurement, Length activities', 45),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - 9, 'present', 'happy', 'Science', 'Sound and vibration, Music makers', 40),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - 8, 'present', 'happy', 'Reading', 'Fairy tales compare, Story elements', 45),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - 7, 'present', 'excited', 'Mathematics', 'Fractions intro, Pizza fractions', 50),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - 6, 'present', 'happy', 'Social Studies', 'Family traditions, Holiday customs', 35),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - 5, 'present', 'happy', 'Science', 'Animal habitats, Diorama project', 45),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - 4, 'present', 'neutral', 'Reading', 'Non-fiction texts, Fact finding', 40),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - 3, 'present', 'happy', 'Mathematics', 'Graphing, Bar charts', 45),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - 2, 'present', 'excited', 'Art', 'Clay sculpture, Ceramic painting', 50),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - 1, 'present', 'happy', 'Reading', 'Book club discussion, Reading journal', 45),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE, 'present', 'happy', 'Mathematics', 'Multiplication prep, Skip counting', 45);

-- Insert sample sessions for Lucas
INSERT INTO sessions (child_id, session_date, attendance_status, mood, subject, activities_completed, duration_minutes) VALUES
  ('22222222-2222-2222-2222-222222222222', CURRENT_DATE - 30, 'present', 'happy', 'Mathematics', 'Multiplication tables, Division basics', 50),
  ('22222222-2222-2222-2222-222222222222', CURRENT_DATE - 28, 'present', 'excited', 'Science', 'Simple machines, Lever experiments', 45),
  ('22222222-2222-2222-2222-222222222222', CURRENT_DATE - 25, 'present', 'neutral', 'Reading', 'Chapter books, Book report', 55),
  ('22222222-2222-2222-2222-222222222222', CURRENT_DATE - 22, 'late', 'happy', 'Mathematics', 'Word problems, Math games', 45),
  ('22222222-2222-2222-2222-222222222222', CURRENT_DATE - 18, 'present', 'happy', 'Science', 'Ecosystems, Food chains', 40),
  ('22222222-2222-2222-2222-222222222222', CURRENT_DATE - 15, 'present', 'excited', 'Coding', 'Scratch basics, Simple animation', 60),
  ('22222222-2222-2222-2222-222222222222', CURRENT_DATE - 12, 'present', 'happy', 'Mathematics', 'Fractions, Decimals intro', 50),
  ('22222222-2222-2222-2222-222222222222', CURRENT_DATE - 8, 'present', 'neutral', 'Reading', 'Non-fiction, Research skills', 45),
  ('22222222-2222-2222-2222-222222222222', CURRENT_DATE - 5, 'present', 'happy', 'Science', 'Space exploration, Solar system', 50),
  ('22222222-2222-2222-2222-222222222222', CURRENT_DATE - 2, 'present', 'excited', 'Coding', 'Game design, Interactive story', 55),
  ('22222222-2222-2222-2222-222222222222', CURRENT_DATE, 'present', 'happy', 'Mathematics', 'Geometry, Angles and shapes', 50);

-- Insert sample sessions for Sofia
INSERT INTO sessions (child_id, session_date, attendance_status, mood, subject, activities_completed, duration_minutes) VALUES
  ('33333333-3333-3333-3333-333333333333', CURRENT_DATE - 28, 'present', 'happy', 'Reading', 'Letter recognition, Phonics', 30),
  ('33333333-3333-3333-3333-333333333333', CURRENT_DATE - 25, 'present', 'excited', 'Art', 'Finger painting, Color mixing', 40),
  ('33333333-3333-3333-3333-333333333333', CURRENT_DATE - 22, 'present', 'happy', 'Mathematics', 'Counting 1-20, Number games', 25),
  ('33333333-3333-3333-3333-333333333333', CURRENT_DATE - 18, 'present', 'neutral', 'Science', 'Nature walk, Leaf collecting', 35),
  ('33333333-3333-3333-3333-333333333333', CURRENT_DATE - 15, 'late', 'happy', 'Reading', 'Sight words, Rhyming', 30),
  ('33333333-3333-3333-3333-333333333333', CURRENT_DATE - 12, 'present', 'happy', 'Music', 'Songs and movement, Rhythm', 40),
  ('33333333-3333-3333-3333-333333333333', CURRENT_DATE - 8, 'present', 'excited', 'Mathematics', 'Shapes, Sorting activities', 30),
  ('33333333-3333-3333-3333-333333333333', CURRENT_DATE - 5, 'present', 'happy', 'Reading', 'Story time, Picture books', 35),
  ('33333333-3333-3333-3333-333333333333', CURRENT_DATE - 2, 'present', 'happy', 'Art', 'Play-doh creation, Collage', 40),
  ('33333333-3333-3333-3333-333333333333', CURRENT_DATE, 'present', 'excited', 'Science', 'Sink or float, Water play', 35);

-- Insert sample milestones
INSERT INTO milestones (child_id, title, description, achieved_date, category) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Reading Level 5 Achieved', 'Successfully reading at Level 5 with comprehension', CURRENT_DATE - 20, 'Reading'),
  ('11111111-1111-1111-1111-111111111111', 'Math Facts Master', 'Completed addition facts to 20', CURRENT_DATE - 15, 'Mathematics'),
  ('11111111-1111-1111-1111-111111111111', 'Perfect Attendance', 'One full month of perfect attendance', CURRENT_DATE - 10, 'Attendance'),
  ('22222222-2222-2222-2222-222222222222', 'Multiplication Master', 'Mastered multiplication tables 1-10', CURRENT_DATE - 7, 'Mathematics'),
  ('22222222-2222-2222-2222-222222222222', 'First Coding Project', 'Completed first Scratch animation independently', CURRENT_DATE - 3, 'Coding'),
  ('33333333-3333-3333-3333-333333333333', 'Letter Recognition Complete', 'Identifies all uppercase and lowercase letters', CURRENT_DATE - 14, 'Reading'),
  ('33333333-3333-3333-3333-333333333333', 'Counting to 20', 'Successfully counts to 20 with one-to-one correspondence', CURRENT_DATE - 5, 'Mathematics');

-- Create indexes for performance
CREATE INDEX idx_sessions_child_id ON sessions(child_id);
CREATE INDEX idx_sessions_date ON sessions(session_date);
CREATE INDEX idx_milestones_child_id ON milestones(child_id);