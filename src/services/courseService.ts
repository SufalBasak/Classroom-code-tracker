import { Course } from '../types';
import { MOCK_COURSES } from '../data/mockData';
import { supabase } from '../lib/supabase';

const COURSES_STORAGE_KEY = 'codesnap_courses';

export const courseService = {
  getCourses(): Course[] {
    const stored = localStorage.getItem(COURSES_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse cached courses', e);
      }
    }
    return MOCK_COURSES;
  },

  async fetchCoursesFromSupabase(): Promise<Course[]> {
    try {
      const { data, error } = await supabase.from('courses').select('*').order('created_at', { ascending: true });
      if (!error && data && data.length > 0) {
        const formatted: Course[] = data.map((c: any) => ({
          id: c.id,
          title: c.title,
          slug: c.slug || c.title.toLowerCase().replace(/\s+/g, '-'),
          description: c.description || '',
          thumbnail: c.thumbnail || 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80',
          category: c.category || 'General',
          difficulty: c.difficulty || 'Easy',
          questionIds: c.question_ids || [],
          enrolledUsersCount: c.enrolled_users_count || 120,
          published: c.published !== false
        }));
        localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(formatted));
        return formatted;
      }
    } catch (err) {
      console.warn('Supabase courses fetch notice:', err);
    }
    return this.getCourses();
  },

  getCourseById(id: string): Course | undefined {
    return this.getCourses().find((c) => c.id === id || c.slug === id);
  },

  saveCourse(courseData: Partial<Course>): Course {
    const courses = this.getCourses();
    let updatedCourse: Course;

    if (courseData.id) {
      const index = courses.findIndex((c) => c.id === courseData.id);
      if (index !== -1) {
        updatedCourse = { ...courses[index], ...courseData };
        courses[index] = updatedCourse;
      } else {
        updatedCourse = {
          id: courseData.id,
          title: courseData.title || 'Untitled Course',
          slug: (courseData.title || 'course').toLowerCase().replace(/\s+/g, '-'),
          description: courseData.description || '',
          category: courseData.category || 'General',
          difficulty: courseData.difficulty || 'Easy',
          thumbnail: courseData.thumbnail || 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80',
          questionIds: courseData.questionIds || [],
          enrolledUsersCount: courseData.enrolledUsersCount || 0,
          published: courseData.published !== false
        };
        courses.push(updatedCourse);
      }
    } else {
      const newId = `c_${Date.now()}`;
      updatedCourse = {
        id: newId,
        title: courseData.title || 'Untitled Course',
        slug: (courseData.title || 'course').toLowerCase().replace(/\s+/g, '-'),
        description: courseData.description || '',
        category: courseData.category || 'General',
        difficulty: courseData.difficulty || 'Easy',
        thumbnail: courseData.thumbnail || 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80',
        questionIds: courseData.questionIds || [],
        enrolledUsersCount: 0,
        published: true
      };
      courses.push(updatedCourse);
    }

    localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(courses));

    supabase.from('courses').upsert({
      id: updatedCourse.id,
      title: updatedCourse.title,
      slug: updatedCourse.slug,
      description: updatedCourse.description,
      thumbnail: updatedCourse.thumbnail,
      category: updatedCourse.category,
      difficulty: updatedCourse.difficulty,
      question_ids: updatedCourse.questionIds
    }).then();

    return updatedCourse;
  },

  deleteCourse(id: string): void {
    const courses = this.getCourses().filter((c) => c.id !== id);
    localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(courses));
    supabase.from('courses').delete().eq('id', id).then();
  },

  reorderCourses(newOrder: Course[]): void {
    localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(newOrder));
  },

  reorderQuestionsInCourse(courseId: string, questionIds: string[]): Course {
    const course = this.getCourseById(courseId);
    if (!course) throw new Error('Course not found');
    return this.saveCourse({ ...course, questionIds });
  },

  joinCourse(courseId: string, currentJoinedIds?: string[]): string[] {
    const course = this.getCourseById(courseId);
    if (course) {
      this.saveCourse({
        ...course,
        enrolledUsersCount: (course.enrolledUsersCount || 0) + 1
      });
    }
    const joined = currentJoinedIds || [];
    if (!joined.includes(courseId)) {
      return [...joined, courseId];
    }
    return joined;
  }
};
