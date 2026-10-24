-- SkyTeam Training Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Departments table
create table departments (
  id text primary key check (id in ('FLIGHT_DECK', 'CABIN_CREW', 'GROUND_CREW', 'SHARED_CORE')),
  name text not null,
  color text not null,
  description text,
  created_at timestamptz default now()
);

-- Users table
create table users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  password_hash text not null,
  name text not null,
  role text not null check (role in ('ADMIN', 'TRAINER', 'TRAINEE')),
  department text not null references departments(id),
  airline text not null,
  avatar text,
  progress integer default 0,
  joined_date date not null default current_date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Courses table
create table courses (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  department text not null references departments(id),
  description text not null,
  icon text not null,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Modules table
create table modules (
  id uuid primary key default uuid_generate_v4(),
  course_id uuid not null references courses(id) on delete cascade,
  title text not null,
  order_index integer not null,
  created_at timestamptz default now()
);

-- Lessons table
create table lessons (
  id uuid primary key default uuid_generate_v4(),
  module_id uuid not null references modules(id) on delete cascade,
  title text not null,
  type text not null check (type in ('video', 'reading', 'quiz')),
  duration text not null,
  content text,
  video_url text,
  order_index integer not null,
  created_at timestamptz default now()
);

-- Course progress tracking
create table user_course_progress (
  user_id uuid references users(id) on delete cascade,
  course_id uuid references courses(id) on delete cascade,
  progress integer not null default 0,
  status text not null default 'not-started' check (status in ('not-started', 'in-progress', 'completed')),
  completed_at timestamptz,
  last_accessed_at timestamptz,
  primary key (user_id, course_id)
);

-- Assessments table
create table assessments (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  type text not null check (type in ('written', 'practical')),
  department text not null references departments(id),
  description text not null,
  passing_score integer not null,
  time_limit integer not null,
  course_id uuid references courses(id),
  created_at timestamptz default now()
);

-- Assessment questions
create table assessment_questions (
  id uuid primary key default uuid_generate_v4(),
  assessment_id uuid not null references assessments(id) on delete cascade,
  question text not null,
  type text not null check (type in ('mcq', 'true-false', 'essay')),
  options jsonb,
  correct_answer integer,
  explanation text,
  order_index integer not null,
  created_at timestamptz default now()
);

-- Assessment results
create table assessment_results (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  assessment_id uuid references assessments(id) on delete cascade,
  score integer not null,
  passed boolean not null,
  answers jsonb not null,
  started_at timestamptz not null,
  completed_at timestamptz,
  created_at timestamptz default now()
);

-- Trainees table (for trainers to manage)
create table trainees (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  trainer_id uuid references users(id),
  name text not null,
  department text not null references departments(id),
  progress integer not null default 0,
  status text not null default 'active' check (status in ('active', 'in-progress', 'completed', 'suspended')),
  created_at timestamptz default now()
);

-- Insert default departments
insert into departments (id, name, color, description) values
  ('FLIGHT_DECK', 'Flight Deck', '#0066cc', 'Master flight operations, navigation, and aircraft handling procedures.'),
  ('CABIN_CREW', 'Cabin Crew', '#30a46c', 'Learn passenger service, safety protocols, and in-flight procedures.'),
  ('GROUND_CREW', 'Ground Crew', '#d4a843', 'Master airport operations, vehicle handling, and ground procedures.'),
  ('SHARED_CORE', 'Shared Core', '#7c3aed', 'Essential training applicable across all departments.');

-- Insert default admin user (password: admin123)
insert into users (email, password_hash, name, role, department, airline)
values ('admin@skyteam.training', '$2a$10$YQlixxo/RkVdia.BBMSBu.Dq6GnJpAeMxQmQgQYQYjXQZ5gQYQYQY', 'System Admin', 'ADMIN', 'SHARED_CORE', 'SkyTeam Aviation');

-- Row Level Security policies
alter table users enable row level security;
alter table courses enable row level security;
alter table modules enable row level security;
alter table lessons enable row level security;
alter table assessments enable row level security;
alter table assessment_questions enable row level security;
alter table user_course_progress enable row level security;
alter table assessment_results enable row level security;
alter table trainees enable row level security;

-- Users: users can read their own data, admins can read all
create policy "Users can read own profile" on users for select using (auth.uid() = id or exists (select 1 from users u2 where u2.id = auth.uid() and u2.role = 'ADMIN'));
create policy "Admins can update all users" on users for update using (exists (select 1 from users u where u.id = auth.uid() and u.role = 'ADMIN'));

-- Courses: everyone can read published courses
create policy "Anyone can read published courses" on courses for select using (status = 'published');
create policy "Admins can manage courses" on courses for all using (exists (select 1 from users u where u.id = auth.uid() and u.role = 'ADMIN'));

-- Modules: everyone can read
create policy "Anyone can read modules" on modules for select using (true);

-- Lessons: everyone can read
create policy "Anyone can read lessons" on lessons for select using (true);

-- Assessments: everyone can read their department's assessments
create policy "Users can read assessments" on assessments for select using (
  exists (select 1 from users u where u.id = auth.uid() and u.department = assessments.department)
  or exists (select 1 from users u where u.id = auth.uid() and u.role = 'ADMIN')
);

-- User course progress: users can read their own progress
create policy "Users can read own progress" on user_course_progress for select using (user_id = auth.uid());
create policy "Users can update own progress" on user_course_progress for update using (user_id = auth.uid());
create policy "Admins can read all progress" on user_course_progress for all using (exists (select 1 from users u where u.id = auth.uid() and u.role = 'ADMIN'));

-- Assessment results: users can read their own
create policy "Users can read own results" on assessment_results for select using (user_id = auth.uid());
create policy "Users can insert own results" on assessment_results for insert with check (user_id = auth.uid());
create policy "Admins can read all results" on assessment_results for all using (exists (select 1 from users u where u.id = auth.uid() and u.role = 'ADMIN'));

-- Trainers can manage their trainees
create policy "Trainers can manage trainees" on trainees for all using (
  exists (select 1 from users u where u.id = auth.uid() and (u.role = 'TRAINER' or u.role = 'ADMIN'))
);

-- Function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger for users table
create trigger update_users_updated_at before update on users
  for each row execute function update_updated_at_column();

-- Trigger for courses table
create trigger update_courses_updated_at before update on courses
  for each row execute function update_updated_at_column();
