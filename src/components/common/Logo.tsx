import React from 'react';

export interface LogoProps {
  className?: string;
  showTagline?: boolean;
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  showTagline = false,
  variant = 'dark',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'h-7',
    md: 'h-9 md:h-10',
    lg: 'h-12 md:h-14'
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <img
        src="/classroom logo.png"
        alt="Classroom Logo"
        className={`${sizeClasses[size]} w-auto object-contain transition-all ${
          variant === 'light' ? 'brightness-0 invert' : ''
        }`}
      />
      {showTagline && (
        <span className={`text-[10px] font-semibold tracking-wider uppercase hidden sm:inline-block ${
          variant === 'light' ? 'text-slate-400' : 'text-slate-500'
        }`}>
          Track. Solve. Improve.
        </span>
      )}
    </div>
  );
};

export default Logo;
