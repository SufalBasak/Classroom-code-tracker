"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";
import { cn } from "../../lib/utils";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Code2,
  ExternalLink,
  MessageSquare
} from "lucide-react";
import { NavLink } from "react-router-dom";
import Logo from "../common/Logo";

export const TextHoverEffect = ({
  text,
  duration,
  className,
}: {
  text: string;
  duration?: number;
  automatic?: boolean;
  className?: string;
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });

  useEffect(() => {
    if (svgRef.current && cursor.x !== null && cursor.y !== null) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100;
      const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100;
      setMaskPosition({
        cx: `${cxPercentage}%`,
        cy: `${cyPercentage}%`,
      });
    }
  }, [cursor]);

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 300 60"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
      className={cn("select-none uppercase cursor-pointer", className)}
    >
      <defs>
        <linearGradient
          id="textGradient"
          gradientUnits="userSpaceOnUse"
          cx="50%"
          cy="50%"
          r="25%"
        >
          {hovered && (
            <>
              <stop offset="0%" stopColor="#eab308" />
              <stop offset="25%" stopColor="#ef4444" />
              <stop offset="50%" stopColor="#80eeb4" />
              <stop offset="75%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </>
          )}
        </linearGradient>

        <motion.radialGradient
          id="revealMask"
          gradientUnits="userSpaceOnUse"
          r="20%"
          initial={{ cx: "50%", cy: "50%" }}
          animate={maskPosition}
          transition={{ duration: duration ?? 0, ease: "easeOut" }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>
        <mask id="textMask">
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#revealMask)"
          />
        </mask>
      </defs>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className="fill-transparent stroke-neutral-800 font-[helvetica] text-4xl md:text-5xl font-bold"
        style={{ opacity: hovered ? 0.7 : 0 }}
      >
        {text}
      </text>
      <motion.text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className="fill-transparent stroke-[#3ca2fa] font-[helvetica] text-4xl md:text-5xl font-bold"
        initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
        animate={{
          strokeDashoffset: 0,
          strokeDasharray: 1000,
        }}
        transition={{
          duration: 4,
          ease: "easeInOut",
        }}
      >
        {text}
      </motion.text>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke="url(#textGradient)"
        strokeWidth="0.3"
        mask="url(#textMask)"
        className="fill-transparent font-[helvetica] text-4xl md:text-5xl font-bold"
      >
        {text}
      </text>
    </svg>
  );
};

export const FooterBackgroundGradient = () => {
  return (
    <div
      className="absolute inset-0 z-0 pointer-events-none"
      style={{
        background:
          "radial-gradient(125% 125% at 50% 10%, #0F0F1166 50%, #3ca2fa33 100%)",
      }}
    />
  );
};

export function HoverFooter() {
  const footerLinks = [
    {
      title: "Practice Tracks",
      links: [
        { label: "SQL Mastery 100", href: "/login" },
        { label: "DSA 300 Sheet", href: "/login" },
        { label: "Arrays & Strings", href: "/login" },
        { label: "Dynamic Programming", href: "/login" },
      ],
    },
    {
      title: "Platforms & Help",
      links: [
        { label: "LeetCode Integration", href: "#" },
        { label: "GeeksforGeeks Tracker", href: "#" },
        { label: "HackerRank & Codeforces", href: "#" },
        {
          label: "Live Community Chat",
          href: "#",
          pulse: true,
        },
      ],
    },
  ];

  const contactInfo = [
    {
      icon: <Mail size={18} className="text-[#3ca2fa]" />,
      text: "support@classroomplus.dev",
      href: "mailto:support@classroomplus.dev",
    },
    {
      icon: <Phone size={18} className="text-[#3ca2fa]" />,
      text: "+91 86373 73116",
      href: "tel:+918637373116",
    },
    {
      icon: <MapPin size={18} className="text-[#3ca2fa]" />,
      text: "Kolkata, India",
    },
  ];

  const socialLinks = [
    { icon: <Globe size={20} />, label: "Globe", href: "#" },
    { icon: <Code2 size={20} />, label: "Code", href: "#" },
    { icon: <ExternalLink size={20} />, label: "Link", href: "#" },
    { icon: <MessageSquare size={20} />, label: "Community", href: "#" },
  ];

  return (
    <footer className="bg-[#0F0F11] text-slate-300 relative h-fit rounded-3xl overflow-hidden m-4 md:m-8 border border-slate-800 shadow-2xl">
      <div className="max-w-7xl mx-auto p-8 md:p-14 z-40 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8 lg:gap-16 pb-12">
          {/* Brand section */}
          <div className="flex flex-col space-y-4">
            <Logo size="lg" variant="light" />
            <p className="text-xs text-slate-400 leading-relaxed">
              Classroom is a modern coding practice and progress-tracking platform designed to help developers build consistent habits and ace technical interviews.
            </p>
          </div>

          {/* Footer link sections */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-white text-base font-bold mb-5 tracking-wide">
                {section.title}
              </h4>
              <ul className="space-y-3 text-xs">
                {section.links.map((link) => (
                  <li key={link.label} className="relative">
                    <NavLink
                      to={link.href}
                      className="hover:text-[#3ca2fa] transition-colors"
                    >
                      {link.label}
                    </NavLink>
                    {link.pulse && (
                      <span className="absolute top-0 right-[-10px] w-2 h-2 rounded-full bg-[#3ca2fa] animate-pulse"></span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact section */}
          <div>
            <h4 className="text-white text-base font-bold mb-5 tracking-wide">
              Contact Us
            </h4>
            <ul className="space-y-3 text-xs">
              {contactInfo.map((item, i) => (
                <li key={i} className="flex items-center space-x-3 text-slate-300">
                  {item.icon}
                  {item.href ? (
                    <a
                      href={item.href}
                      className="hover:text-[#3ca2fa] transition-colors"
                    >
                      {item.text}
                    </a>
                  ) : (
                    <span className="hover:text-[#3ca2fa] transition-colors">
                      {item.text}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="border-t border-slate-800 my-6" />

        {/* Footer bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs space-y-4 md:space-y-0 text-slate-400 relative z-40">
          {/* Social icons */}
          <div className="flex space-x-6">
            {socialLinks.map(({ icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="hover:text-[#3ca2fa] transition-colors"
              >
                {icon}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-center md:text-left">
            &copy; {new Date().getFullYear()} Classroom. All rights reserved. Track. Solve. Improve.
          </p>
        </div>
      </div>

      {/* Text hover effect */}
      <div className="lg:flex hidden h-36 -mt-16 mb-2 relative z-10 justify-center items-center pointer-events-auto">
        <TextHoverEffect text="Classroom" className="z-10" />
      </div>

      <FooterBackgroundGradient />
    </footer>
  );
}

export default HoverFooter;
