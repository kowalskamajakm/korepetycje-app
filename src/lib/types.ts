export type Student = {
  id: string;
  full_name: string;
  subject: string | null;
  level: string | null;
  notes: string | null;
  teams_link: string | null;
  created_at: string;
};

export type LessonStatus = "zaplanowana" | "odbyta" | "odwolana";

export type Lesson = {
  id: string;
  student_id: string;
  lesson_date: string;
  start_time: string;
  duration_minutes: number;
  status: LessonStatus;
  notes: string | null;
  students: { id: string; full_name: string } | null;
};

export type PaymentStatus = "nieoplacone" | "oplacone";

export type Payment = {
  id: string;
  student_id: string;
  description: string;
  amount: number;
  due_date: string;
  status: PaymentStatus;
  paid_at: string | null;
  students: { id: string; full_name: string } | null;
};

export type HomeworkStatus = "do_zrobienia" | "zrobione";

export type Homework = {
  id: string;
  student_id: string;
  description: string;
  due_date: string | null;
  status: HomeworkStatus;
  students: { id: string; full_name: string } | null;
};

export type Material = {
  id: string;
  title: string;
  file_path: string;
  file_size: number | null;
  student_id: string | null;
  created_at: string;
  students: { id: string; full_name: string } | null;
};

export type StudentAccount = {
  id: string;
  full_name: string | null;
  email: string | null;
} | null;

export type ParentLink = {
  parent_id: string;
  profiles: {
    id: string;
    full_name: string | null;
    email: string | null;
  } | null;
};
