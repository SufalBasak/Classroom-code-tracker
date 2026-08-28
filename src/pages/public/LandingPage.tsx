import React from 'react';
import { NavLink } from 'react-router-dom';
import MetroHero from '../../components/ui/scroll-locked-video-hero';
import { StaggerTestimonials } from '../../components/ui/stagger-testimonials';
import FaqSection, { FaqData } from '../../components/ui/habit-faq-scroller';
import { Button } from '../../components/common/Button';
import {
  Code2,
  BookOpen,
  BarChart3,
  Flame,
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import { MOCK_COURSES } from '../../data/mockData';
import { authService } from '../../services/authService';

const landingFaqData: FaqData = {
  mainTitle: 'Frequently Asked Questions',
  mainSubtitle: "Have questions about tracking your coding practice on Classroom? We've got answers.",
  rows: [
    {
      id: 'row1',
      speed: '60s',
      direction: 'left',
      faqItems: [
        {
          id: 'q1',
          question: 'Do I need to solve problems inside Classroom?',
          answer: 'No — you solve on the original platform (LeetCode, GFG, HackerRank, Codeforces). Classroom links straight to the exact problem and tracks your progress automatically.'
        },
        {
          id: 'q2',
          question: 'Is Classroom free to use?',
          answer: 'Yes, 100% free for students and developers — full access to curated tracks, progress heatmaps, milestone badges, and the global leaderboard.'
        }
      ]
    },
    {
      id: 'row2',
      speed: '48s',
      direction: 'right',
      faqItems: [
        {
          id: 'q3',
          question: 'How do I connect my LeetCode or Codeforces account?',
          answer: 'Go to Settings → Connected Coding Accounts, enter your public handle, and Classroom auto-syncs your real solved count from that platform.'
        },
        {
          id: 'q4',
          question: 'What is the SQL 100 or DSA 300 sheet?',
          answer: 'These are structured problem tracks designed by top tech mentors. They break large interview topics into daily achievable goals.'
        }
      ]
    },
    {
      id: 'row3',
      speed: '65s',
      direction: 'left',
      faqItems: [
        {
          id: 'q5',
          question: 'Can administrators import problem sets from Excel?',
          answer: 'Yes! Classroom provides a bulk Excel/CSV import tool for educators and admins to upload entire problem sheets in seconds.'
        },
        {
          id: 'q6',
          question: 'What happens if I miss a practice day?',
          answer: 'Your activity heatmap stays intact and you can resume your streak anytime with your next completed problem.'
        }
      ]
    }
  ]
};

export const LandingPage: React.FC = () => {
  const isAuth = authService.isAuthenticated();
  const targetRoute = isAuth ? '/dashboard' : '/register';

  return (
    <div className="space-y-24 pb-20">
      {/* Metro Style Video Hero Section */}
      <MetroHero />

      {/* Value Proposition Grid */}
      <section className="px-6 lg:px-12 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold">
            <Flame className="w-3.5 h-3.5" /> Built for Serious Coding Consistency
          </div>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Everything you need to master problem solving
          </h2>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed">
            Stop losing track of solved questions across multiple coding sites. Unify your progress in one intelligent dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-md shadow-slate-100 space-y-4 hover:border-blue-300 transition-all hover:shadow-lg">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Code2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Multi-Platform Sync</h3>
            <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
              Track LeetCode, GeeksforGeeks, HackerRank, and Codeforces in one central hub.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-md shadow-slate-100 space-y-4 hover:border-blue-300 transition-all hover:shadow-lg">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Curated Learning Tracks</h3>
            <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
              Follow SQL Mastery 100, DSA 300, Arrays, and Dynamic Programming sheets.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-md shadow-slate-100 space-y-4 hover:border-blue-300 transition-all hover:shadow-lg">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">GitHub-Style Heatmaps</h3>
            <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
              Visualize your 52-week practice history and maintain your daily coding streak.
            </p>
          </div>
        </div>
      </section>

      {/* How it Works Step Section */}
      <section className="px-6 lg:px-12 max-w-7xl mx-auto bg-slate-900 text-white rounded-3xl p-10 lg:p-16 space-y-12 shadow-2xl">
        <div className="max-w-xl space-y-3">
          <span className="text-blue-400 font-bold text-xs uppercase tracking-wider">How Classroom Works</span>
          <h2 className="text-3xl font-extrabold text-white">4 Simple Steps to Consistency</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-md shadow-blue-600/50">
              1
            </div>
            <h4 className="font-bold text-base">Select a Course Track</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Choose from SQL Mastery, DSA 300 Sheet, Arrays, or Dynamic Programming.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-md shadow-blue-600/50">
              2
            </div>
            <h4 className="font-bold text-base">Solve Externally</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Click 'Solve' to launch the exact question directly on LeetCode, GFG, or HackerRank.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-md shadow-blue-600/50">
              3
            </div>
            <h4 className="font-bold text-base">Log & Verify</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Mark problems as solved manually or sync connected coding accounts.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-md shadow-blue-600/50">
              4
            </div>
            <h4 className="font-bold text-base">Track Growth</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Watch your heatmaps, level-up achievements, and climb weekly leaderboards.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Courses Preview */}
      <section className="px-6 lg:px-12 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Featured Learning Courses</h2>
            <p className="text-slate-600 text-sm mt-1">Structured problem lists organized by difficulty and topic.</p>
          </div>
          <NavLink to={targetRoute}>
            <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View All Courses
            </Button>
          </NavLink>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_COURSES.slice(0, 3).map((course) => (
            <div key={course.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <img src={course.thumbnail} alt={course.title} className="w-full h-40 object-cover" />
                <div className="p-6 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md font-semibold">{course.category}</span>
                    <span className="text-slate-500">{course.questionIds.length} Questions</span>
                  </div>
                  <h3 className="font-bold text-lg text-slate-900">{course.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{course.description}</p>
                </div>
              </div>
              <div className="p-6 pt-0">
                <NavLink to={isAuth ? `/courses/${course.id}` : '/login'}>
                  <Button variant="primary" size="sm" className="w-full">
                    Start Course
                  </Button>
                </NavLink>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stagger Testimonials Section */}
      <section className="px-6 lg:px-12 max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold">
            <MessageSquare className="w-3.5 h-3.5" /> Loved by Developers & Students
          </div>
          <h2 className="text-3xl font-bold text-slate-900">What Our Developers Say</h2>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            Hear how developers, engineers, and students ace interviews and build daily coding habits with Classroom.
          </p>
        </div>

        <StaggerTestimonials />
      </section>

      {/* FAQ Section */}
      <section className="px-6 lg:px-12">
        <FaqSection data={landingFaqData} />
      </section>

      {/* Final Call to Action */}
      <section className="px-6 lg:px-12 max-w-5xl mx-auto text-center bg-blue-600 text-white rounded-3xl p-12 space-y-6 shadow-xl shadow-blue-600/20">
        <h2 className="text-3xl md:text-4xl font-extrabold">Ready to accelerate your coding practice?</h2>
        <p className="text-blue-100 max-w-xl mx-auto text-sm leading-relaxed">
          Join thousands of developers using Classroom to organize problems, build consistent coding habits, and ace technical interviews.
        </p>
        <div className="pt-2">
          <NavLink to="/register">
            <Button variant="secondary" size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-bold">
              Create Your Free Account Now
            </Button>
          </NavLink>
        </div>
      </section>
    </div>
  );
};
