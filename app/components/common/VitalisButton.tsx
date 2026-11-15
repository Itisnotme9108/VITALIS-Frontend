import React from 'react';
import { playButtonClick } from '@/app/services/interaction-sound';

export interface VitalisButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'cyan';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  active?: boolean;
  soundScale?: number;
  corners?: boolean;
}

export const VitalisButton = React.forwardRef<HTMLButtonElement, VitalisButtonProps>(
  (
    {
      children,
      className = '',
      variant = 'secondary',
      size = 'md',
      active = false,
      soundScale = 1.0,
      corners = true,
      onClick,
      disabled,
      ...props
    },
    ref
  ) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      playButtonClick(soundScale);
      if (onClick) {
        onClick(e);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return;
      if (e.key === 'Enter' || e.key === ' ') {
        playButtonClick(soundScale);
      }
      if (props.onKeyDown) {
        props.onKeyDown(e);
      }
    };

    const baseStyles =
      'relative inline-flex items-center justify-center font-mono font-medium text-xs tracking-wider uppercase transition-colors select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed rounded-none border';

    const sizeStyles = {
      sm: 'h-7 px-2.5 text-[10px] gap-1.5',
      md: 'h-8 px-3.5 text-xs gap-2',
      lg: 'h-10 px-5 text-sm gap-2.5',
      icon: 'h-8 w-8 p-0'
    }[size];

    const variantStyles = {
      primary:
        'bg-cyan-500/20 border-cyan-400 text-cyan-300 hover:bg-cyan-500/30 active:bg-cyan-500/40 shadow-[0_0_12px_rgba(0,240,255,0.15)]',
      cyan:
        'bg-cyan-400 text-slate-950 font-semibold border-cyan-300 hover:bg-cyan-300 active:bg-cyan-200 shadow-[0_0_16px_rgba(0,240,255,0.3)]',
      secondary:
        'bg-slate-900/90 border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:text-white hover:border-slate-600 active:bg-slate-700',
      outline:
        'bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800/60 hover:text-cyan-300 hover:border-cyan-500/60 active:bg-slate-800',
      ghost:
        'bg-transparent border-transparent text-slate-400 hover:bg-slate-800/70 hover:text-slate-100 hover:border-slate-700/50 active:bg-slate-800',
      danger:
        'bg-rose-950/40 border-rose-600/70 text-rose-300 hover:bg-rose-900/50 hover:text-rose-200 active:bg-rose-900/70'
    }[variant];

    const activeStyles = active
      ? 'border-cyan-400 text-cyan-300 bg-cyan-950/60 shadow-[inset_0_0_8px_rgba(0,240,255,0.2)]'
      : '';

    return (
      <button
        ref={ref}
        disabled={disabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={`${baseStyles} ${sizeStyles} ${variantStyles} ${activeStyles} ${className}`}
        {...props}
      >
        {corners && (
          <>
            <span className="absolute -top-[1px] -left-[1px] w-1 h-1 bg-current opacity-30 pointer-events-none" />
            <span className="absolute -top-[1px] -right-[1px] w-1 h-1 bg-current opacity-30 pointer-events-none" />
            <span className="absolute -bottom-[1px] -left-[1px] w-1 h-1 bg-current opacity-30 pointer-events-none" />
            <span className="absolute -bottom-[1px] -right-[1px] w-1 h-1 bg-current opacity-30 pointer-events-none" />
          </>
        )}
        {children}
      </button>
    );
  }
);

VitalisButton.displayName = 'VitalisButton';
