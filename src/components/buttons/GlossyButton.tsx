import React from 'react';
import { BaseButtonProps } from './BaseButtonProps';

export default function GlossyButton({ color, isPlaying, isLoading, onClick, size = 'small' }: BaseButtonProps) {
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
          {/* Platter bottom rim (metallic dark) */}
          <div
            className="absolute rounded-[50%]"
            style={{ 
              width: s(84, 300), height: s(63, 225), bottom: 0, left: s(4, 12.5), 
              background: 'linear-gradient(to right, #2a2a2a, #5a5a5a, #2a2a2a)', 
              zIndex: 1,
              boxShadow: `0 ${s(8, 20)}px ${s(16, 40)}px rgba(0,0,0,0.4)`
            }}
          />

          {/* Platter top surface (metallic shiny) */}
          <div
            className="absolute rounded-[50%]"
            style={{ 
              width: s(84, 300), height: s(63, 225), bottom: s(8, 30), left: s(4, 12.5), 
              background: 'linear-gradient(135deg, #e0e0e0 0%, #a0a0a0 50%, #d0d0d0 100%)', 
              zIndex: 2,
              border: '1px solid rgba(255,255,255,0.4)'
            }}
          />

          {/* Button cylinder bottom curve */}
          <div
            className="absolute rounded-[50%] transition-all duration-100 ease-out"
            style={{
              width: s(70, 250), height: s(52, 188), bottom: isPlaying ? s(10, 30) : s(14, 50), left: s(11, 37.5),
              background: `linear-gradient(to right, ${color.dark}, ${color.main}, ${color.dark})`,
              zIndex: 3,
            }}
          />

          {/* Button cylinder vertical wall */}
          <div
            className="absolute transition-all duration-100 ease-out"
            style={{
              width: s(70, 250), height: isPlaying ? s(8, 30) : s(14, 50), bottom: isPlaying ? s(36, 124) : s(40, 144), left: s(11, 37.5),
              background: `linear-gradient(to right, ${color.dark}, ${color.main}, ${color.dark})`,
              zIndex: 3,
            }}
          />

          {/* Button top cap (glossy highlight) */}
          <div
            className="absolute rounded-[50%] transition-all duration-100 ease-out flex items-center justify-center text-white"
            style={{
              width: s(70, 250), height: s(52, 188), bottom: isPlaying ? s(20, 60) : s(28, 100), left: s(11, 37.5),
              background: `radial-gradient(ellipse at 50% 20%, #ffffff 0%, ${color.main} 40%, ${color.dark} 90%)`,
              zIndex: 4,
              boxShadow: isPlaying
                ? `inset 0 -${s(2, 6)}px ${s(4, 10)}px rgba(0,0,0,0.5), inset 0 ${s(2, 6)}px ${s(10, 25)}px rgba(255,255,255,0.2)`
                : `inset 0 ${s(4, 12)}px ${s(8, 20)}px rgba(255,255,255,0.7), inset 0 -${s(6, 15)}px ${s(12, 30)}px rgba(0,0,0,0.5), 0 ${s(6, 15)}px ${s(12, 30)}px rgba(0,0,0,0.4)`,
              border: `1px solid rgba(255,255,255,0.3)`
            }}
          >
            {isLoading && (
              <div className="w-5 h-5 border-2 border-white/60 border-t-white rounded-full animate-spin" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
