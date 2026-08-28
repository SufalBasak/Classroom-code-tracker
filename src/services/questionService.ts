import { Question, QuestionStatus, VerificationType, PlatformId, Difficulty } from '../types';
import { MOCK_QUESTIONS } from '../data/mockData';
import { supabase } from '../lib/supabase';

const QUESTIONS_STORAGE_KEY = 'codesnap_questions';

export interface QuestionFilters {
  search?: string;
  platform?: string;
  difficulty?: string;
  topic?: string;
  status?: string;
  courseId?: string;
}

export const questionService = {
  getQuestions(): Question[] {
    const stored = localStorage.getItem(QUESTIONS_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse cached questions', e);
      }
    }
    return MOCK_QUESTIONS;
  },

  async fetchQuestionsFromSupabase(): Promise<Question[]> {
    try {
      const { data, error } = await supabase.from('questions').select('*').order('created_at', { ascending: true });
      if (!error && data && data.length > 0) {
        const formatted: Question[] = data.map((q: any) => ({
          id: q.id,
          title: q.title,
          description: q.description || '',
          platform: (q.platform as PlatformId) || 'LeetCode',
          difficulty: (q.difficulty as Difficulty) || 'Easy',
          topic: q.topic || 'General',
          externalUrl: q.external_url || '#',
          status: (q.status as QuestionStatus) || 'NOT_STARTED',
          verification: 'VERIFIED' as VerificationType,
          tags: [q.topic || 'General'],
          courseId: q.course_id
        }));
        localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(formatted));
        return formatted;
      }
    } catch (err) {
      console.warn('Supabase questions fetch notice:', err);
    }
    return this.getQuestions();
  },

  getQuestionById(id: string): Question | undefined {
    return this.getQuestions().find((q) => q.id === id);
  },

  saveQuestion(questionData: Partial<Question>): Question {
    const questions = this.getQuestions();
    let updatedQuestion: Question;

    if (questionData.id) {
      const index = questions.findIndex((q) => q.id === questionData.id);
      if (index !== -1) {
        updatedQuestion = { ...questions[index], ...questionData };
        questions[index] = updatedQuestion;
      } else {
        updatedQuestion = {
          id: questionData.id,
          title: questionData.title || 'Untitled Question',
          platform: questionData.platform || 'LeetCode',
          externalUrl: questionData.externalUrl || '#',
          difficulty: questionData.difficulty || 'Easy',
          topic: questionData.topic || 'General',
          tags: questionData.tags || [questionData.topic || 'General'],
          status: questionData.status || 'NOT_STARTED',
          verification: questionData.verification || 'VERIFIED',
          courseId: questionData.courseId
        };
        questions.push(updatedQuestion);
      }
    } else {
      const newId = `q_${Date.now()}`;
      updatedQuestion = {
        id: newId,
        title: questionData.title || 'Untitled Question',
        platform: questionData.platform || 'LeetCode',
        externalUrl: questionData.externalUrl || '#',
        difficulty: questionData.difficulty || 'Easy',
        topic: questionData.topic || 'General',
        tags: questionData.tags || [questionData.topic || 'General'],
        status: questionData.status || 'NOT_STARTED',
        verification: questionData.verification || 'VERIFIED',
        courseId: questionData.courseId
      };
      questions.push(updatedQuestion);
    }

    localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(questions));

    supabase.from('questions').upsert({
      id: updatedQuestion.id,
      title: updatedQuestion.title,
      platform: updatedQuestion.platform,
      difficulty: updatedQuestion.difficulty,
      topic: updatedQuestion.topic,
      external_url: updatedQuestion.externalUrl,
      status: updatedQuestion.status,
      course_id: updatedQuestion.courseId
    }).then();

    return updatedQuestion;
  },

  deleteQuestion(id: string): void {
    const questions = this.getQuestions().filter((q) => q.id !== id);
    localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(questions));
    supabase.from('questions').delete().eq('id', id).then();
  },

  markAsSolved(id: string, isSolved?: boolean): Question {
    const question = this.getQuestionById(id);
    if (!question) throw new Error('Question not found');

    let nextStatus: QuestionStatus;
    if (typeof isSolved === 'boolean') {
      nextStatus = isSolved ? 'SOLVED' : 'NOT_STARTED';
    } else {
      nextStatus = question.status === 'SOLVED' ? 'NOT_STARTED' : 'SOLVED';
    }

    const solvedAt = nextStatus === 'SOLVED' ? new Date().toISOString() : undefined;

    return this.saveQuestion({
      ...question,
      status: nextStatus,
      solvedAt
    });
  },

  toggleQuestionStatus(id: string): Question {
    return this.markAsSolved(id);
  },

  filterQuestions(questionsOrFilters: Question[] | QuestionFilters, maybeFilters?: QuestionFilters): Question[] {
    let questions: Question[];
    let filters: QuestionFilters;

    if (Array.isArray(questionsOrFilters)) {
      questions = questionsOrFilters;
      filters = maybeFilters || {};
    } else {
      questions = this.getQuestions();
      filters = questionsOrFilters || {};
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      questions = questions.filter(
        (item) => item.title.toLowerCase().includes(q) || item.topic.toLowerCase().includes(q)
      );
    }

    if (filters.platform && filters.platform !== 'ALL') {
      questions = questions.filter((item) => item.platform === filters.platform);
    }

    if (filters.difficulty && filters.difficulty !== 'ALL') {
      questions = questions.filter((item) => item.difficulty === filters.difficulty);
    }

    if (filters.topic && filters.topic !== 'ALL') {
      questions = questions.filter((item) => item.topic === filters.topic);
    }

    if (filters.status && filters.status !== 'ALL') {
      questions = questions.filter((item) => item.status === filters.status);
    }

    if (filters.courseId) {
      questions = questions.filter((item) => item.courseId === filters.courseId);
    }

    return questions;
  },

  bulkImportQuestions(importedQuestions: Partial<Question>[]): Question[] {
    const newQuestions: Question[] = [];
    for (const item of importedQuestions) {
      const q = this.saveQuestion(item);
      newQuestions.push(q);
    }
    return newQuestions;
  },

  bulkImportFromCsvRows(rows: any[]): { imported: number; errors: { row: number; reason: string }[] } {
    const errors: { row: number; reason: string }[] = [];
    let count = 0;

    rows.forEach((row, idx) => {
      if (!row.title && !row.Title) {
        errors.push({ row: idx + 1, reason: 'Missing question title' });
        return;
      }
      this.saveQuestion({
        title: row.title || row.Title || 'Imported Question',
        platform: (row.platform || row.Platform || 'LeetCode') as PlatformId,
        externalUrl: row.url || row.URL || row.externalUrl || '#',
        difficulty: (row.difficulty || row.Difficulty || 'Easy') as Difficulty,
        topic: row.topic || row.Topic || 'General',
        courseId: row.courseId
      });
      count++;
    });

    return { imported: count, errors };
  }
};
