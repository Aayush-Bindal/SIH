import React, { useState } from 'react';

interface TooltipProps {
  content: string;
  title?: string;
  children: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  title,
  children,
  side = 'top',
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }[side];

  return (
    <div
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}

      {isVisible && (
        <div
          role="tooltip"
          className={`absolute z-50 pointer-events-none w-64 max-w-xs bg-[#171717] text-white p-2.5 rounded-[6px] text-left text-[12px] shadow-lg border border-[#171717] ${positionClasses}`}
        >
          {title && (
            <div className="font-['Geist'] font-medium text-[12px] text-white flex items-center gap-1.5 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#e2e67d]" />
              <span>{title}</span>
            </div>
          )}
          <p className="text-white/80 font-sans leading-relaxed text-[11px]">{content}</p>
        </div>
      )}
    </div>
  );
};
