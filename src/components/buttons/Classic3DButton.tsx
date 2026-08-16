import React from 'react';
import { BaseButtonProps } from './BaseButtonProps';

export default function Classic3DButton({ color, isPlaying, isLoading, onClick, size = 'small' }: BaseButtonProps) {
  const isLarge = size === 'large';
  const s = (sm: number, lg: number) => isLarge ? lg : sm;

  return (
    <div
      className={`relative cursor-pointer select-none transition-transform duration-75 ${isLarge ? 'mx-auto lg:mx-0 flex-shrink-0 hover:scale-[1.02] active:scale-[0.98]' : 'active:scale-[0.97]'}`}
      style={{
        width: s(92, 325),
        height: s(102, 350),
      }}
      onClick={onClick}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div style={{ width: s(92, 325), height: s(102, 350), position: 'relative' }}>
          {/* Platter bottom rim (darkest, for depth) */}
          <div
            className="absolute rounded-[50%]"
            style={{ width: s(84, 300), height: s(63, 225), bottom: 0, left: s(4, 12.5), background: '#7a7a7a', zIndex: 1 }}
          />

          {/* Platter top surface (lighter grey) */}
          <div
            className="absolute rounded-[50%]"
            style={{ width: s(84, 300), height: s(63, 225), bottom: s(8, 30), left: s(4, 12.5), background: '#d0d0d0', zIndex: 2 }}
          />

          {/* Button cylinder bottom curve (darker shade of button color) */}
          <div
            className="absolute rounded-[50%] transition-all duration-100 ease-out"
            style={{
              width: s(70, 250), height: s(52, 188), bottom: isPlaying ? s(10, 30) : s(14, 50), left: s(11, 37.5),
              backgroundColor: color.dark, zIndex: 3,
            }}
          />

          {/* Button cylinder vertical wall connecting bottom and top cap */}
          <div
            className="absolute transition-all duration-100 ease-out"
            style={{
              width: s(70, 250), height: isPlaying ? s(8, 30) : s(14, 50), bottom: isPlaying ? s(36, 124) : s(40, 144), left: s(11, 37.5),
              backgroundColor: color.dark, zIndex: 3,
            }}
          />

          {/* Button top cap (main color) — moves down when playing */}
          <div
            className="absolute rounded-[50%] transition-all duration-100 ease-out flex items-center justify-center text-white"
            style={{
              width: s(70, 250), height: s(52, 188), bottom: isPlaying ? s(20, 60) : s(28, 100), left: s(11, 37.5),
              backgroundColor: color.main, zIndex: 4,
              boxShadow: isPlaying
                ? 'inset 0 -2px 4px rgba(0,0,0,0.15)'
                : 'inset 0 -4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.08)',
            }}
          >
            {isLoading && (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
