"use client";

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

const SQRT_5000 = Math.sqrt(5000);

export const testimonials = [
  {
    tempId: 0,
    testimonial: "CodeSnap helped me track over 180 LeetCode & GFG problems. I landed my SDE role at Amazon!",
    by: "Sufal Basak, Software Engineer at Amazon",
    imgSrc: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
  },
  {
    tempId: 1,
    testimonial: "The SQL Mastery & DSA 300 tracks organized my daily practice. The 84-day heatmap kept me consistent every single day.",
    by: "Ananya Sharma, Tech Lead at InnovateCo",
    imgSrc: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
  },
  {
    tempId: 2,
    testimonial: "I used to lose track of solved problems across platforms. CodeSnap unified LeetCode, GFG, and HackerRank in one dashboard!",
    by: "Rahul Verma, Senior Developer at Stripe",
    imgSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
  },
  {
    tempId: 3,
    testimonial: "Bulk importing course questions from Excel spreadsheets takes 10 seconds. Best platform for educators & students!",
    by: "Dr. Arvind Mehta, CS Professor at Tech University",
    imgSrc: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
  },
  {
    tempId: 4,
    testimonial: "If I could give CodeSnap 11 stars, I'd give 12. The dark mode heatmap and analytics are breathtaking.",
    by: "Priya Nair, Product Designer at Canva",
    imgSrc: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80"
  },
  {
    tempId: 5,
    testimonial: "SO SO HAPPY WE FOUND CODESNAP! Saved our batch 100+ hours of manual problem tracking.",
    by: "Vikram Das, Student Placement Lead",
    imgSrc: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80"
  },
  {
    tempId: 6,
    testimonial: "Took some convincing for our coding club, but now that we're on CodeSnap, we're never going back.",
    by: "Kavita Rao, Coding Club President",
    imgSrc: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80"
  },
  {
    tempId: 7,
    testimonial: "I would be lost without CodeSnap's in-depth analytics. The difficulty breakdown and streak tracking ROI is 100X.",
    by: "Daniel Kim, Data Engineer at Snowflake",
    imgSrc: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80"
  },
  {
    tempId: 8,
    testimonial: "It's just the best coding tracker platform. Period.",
    by: "Fernando, Fullstack Developer at Vercel",
    imgSrc: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80"
  },
  {
    tempId: 9,
    testimonial: "The direct external problem link table makes practicing DSA seamless. Outstanding platform!",
    by: "Sneha Reddy, Backend Developer at Swiggy",
    imgSrc: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
  }
];

interface TestimonialCardProps {
  position: number;
  testimonial: typeof testimonials[0];
  handleMove: (steps: number) => void;
  cardSize: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ 
  position, 
  testimonial, 
  handleMove, 
  cardSize 
}) => {
  const isCenter = position === 0;

  return (
    <div
      onClick={() => handleMove(position)}
      className={cn(
        "absolute left-1/2 top-1/2 cursor-pointer border-2 p-8 transition-all duration-500 ease-in-out select-none",
        isCenter 
          ? "z-10 bg-blue-600 text-white border-blue-600 shadow-xl" 
          : "z-0 bg-white text-slate-800 border-slate-200 hover:border-blue-400"
      )}
      style={{
        width: cardSize,
        height: cardSize,
        clipPath: `polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)`,
        transform: `
          translate(-50%, -50%) 
          translateX(${(cardSize / 1.5) * position}px)
          translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
        boxShadow: isCenter ? "0px 8px 0px 4px rgba(37, 99, 235, 0.25)" : "0px 0px 0px 0px transparent"
      }}
    >
      <span
        className="absolute block origin-top-right rotate-45 bg-slate-300"
        style={{
          right: -2,
          top: 48,
          width: SQRT_5000,
          height: 2
        }}
      />
      <img
        src={testimonial.imgSrc}
        alt={`${testimonial.by.split(',')[0]}`}
        className="mb-4 h-14 w-12 rounded-lg bg-slate-100 object-cover object-top border border-white/40 shadow-sm"
      />
      <h3 className={cn(
        "text-base sm:text-lg font-bold leading-snug line-clamp-3",
        isCenter ? "text-white" : "text-slate-900"
      )}>
        "{testimonial.testimonial}"
      </h3>
      <p className={cn(
        "absolute bottom-6 left-8 right-8 text-xs font-semibold italic truncate",
        isCenter ? "text-blue-100" : "text-slate-500"
      )}>
        - {testimonial.by}
      </p>
    </div>
  );
};

export const StaggerTestimonials: React.FC = () => {
  const [cardSize, setCardSize] = useState(365);
  const [testimonialsList, setTestimonialsList] = useState(testimonials);

  const handleMove = (steps: number) => {
    const newList = [...testimonialsList];
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift();
        if (!item) return;
        newList.push({ ...item, tempId: Math.random() });
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop();
        if (!item) return;
        newList.unshift({ ...item, tempId: Math.random() });
      }
    }
    setTestimonialsList(newList);
  };

  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia("(min-width: 640px)");
      setCardSize(matches ? 365 : 290);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div
      className="relative w-full overflow-hidden bg-slate-100/70 rounded-3xl border border-slate-200"
      style={{ height: 580 }}
    >
      {testimonialsList.map((testimonial, index) => {
        const position = testimonialsList.length % 2
          ? index - (testimonialsList.length + 1) / 2
          : index - testimonialsList.length / 2;
        return (
          <TestimonialCard
            key={testimonial.tempId}
            testimonial={testimonial}
            handleMove={handleMove}
            position={position}
            cardSize={cardSize}
          />
        );
      })}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-3 z-20">
        <button
          onClick={() => handleMove(-1)}
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl text-xl transition-all shadow-sm",
            "bg-white border border-slate-300 text-slate-700 hover:bg-blue-600 hover:text-white hover:border-blue-600",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          )}
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleMove(1)}
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl text-xl transition-all shadow-sm",
            "bg-white border border-slate-300 text-slate-700 hover:bg-blue-600 hover:text-white hover:border-blue-600",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          )}
          aria-label="Next testimonial"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
