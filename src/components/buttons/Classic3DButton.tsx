import React, { useId } from 'react';
import { BaseButtonProps } from './BaseButtonProps';

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 59, g: 130, b: 246 };
};

const rgbToHex = (r: number, g: number, b: number) => {
  return `#${[r, g, b].map(x => {
    const h = Math.max(0, Math.min(255, Math.round(x))).toString(16);
    return h.length === 1 ? '0' + h : h;
  }).join('')}`;
};

export default function Classic3DButton({ color, isPlaying, isLoading, onClick, size = 'small' }: BaseButtonProps) {
  const reactId = useId().replace(/:/g, '');
  const buttonId = `btn-${reactId}`;

  const isLarge = size === 'large';
  const isMedium = size === 'medium';
  const s = (sm: number, lg: number) => {
    if (isMedium) return Math.round(sm + (lg - sm) * 0.45);
    if (isLarge) return lg;
    return sm;
  };

  const innerHex = color?.main || '#E74C3C';
  const rgb = hexToRgb(innerHex);
  const darkHex = color?.dark || rgbToHex(Math.max(0, rgb.r - 35), Math.max(0, rgb.g - 35), Math.max(0, rgb.b - 35));
  const medDarkHex = rgbToHex(Math.max(0, rgb.r - 20), Math.max(0, rgb.g - 20), Math.max(0, rgb.b - 20));

  const width = s(92, 325);
  const height = s(102, 350);

  return (
    <div
      className={`relative cursor-pointer select-none transition-transform duration-75 ${
        isLarge || isMedium
          ? 'mx-auto flex-shrink-0 hover:scale-[1.02] active:scale-[0.98]'
          : 'active:scale-[0.97]'
      }`}
      style={{ width, height }}
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 508.88 499.32"
        className="w-full h-full block"
        aria-label="Sound button"
        style={{ overflow: 'visible' }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <style>{`
            .cls-1-${buttonId} { fill: ${darkHex}; }
            .cls-2-${buttonId} { fill: #b0aaab; }
            .cls-3-${buttonId} { fill: url(#linear-gradient-2-${buttonId}); }
            .cls-4-${buttonId} { fill: #1f1f1f; }
            .cls-5-${buttonId} { fill: ${medDarkHex}; }
            .cls-6-${buttonId} { fill: ${innerHex}; }
            .cls-7-${buttonId} { fill: #404140; }
            .cls-8-${buttonId} { fill: url(#linear-gradient-${buttonId}); }
            .cls-8p-${buttonId} { fill: url(#linear-gradient-pressed-${buttonId}); }
            .cls-3p-${buttonId} { fill: url(#linear-gradient-2-pressed-${buttonId}); }
          `}</style>
          <linearGradient id={`linear-gradient-${buttonId}`} x1="883.46" y1="-341.94" x2="1037.44" y2="-75.24" gradientTransform="translate(1217.61 -59.25) rotate(-180)" gradientUnits="userSpaceOnUse">
            <stop offset=".05" stopColor="#fff" stopOpacity=".83"/>
            <stop offset=".05" stopColor="#fff" stopOpacity=".79"/>
            <stop offset=".09" stopColor="#fff" stopOpacity=".46"/>
            <stop offset=".11" stopColor="#fff" stopOpacity=".33"/>
            <stop offset=".2" stopColor="#fff" stopOpacity=".12"/>
            <stop offset=".25" stopColor="#fff" stopOpacity="0"/>
          </linearGradient>
          <linearGradient id={`linear-gradient-2-${buttonId}`} x1="254.44" y1="293.77" x2="254.44" y2="23.06" gradientUnits="userSpaceOnUse">
            <stop offset=".05" stopColor="#fff" stopOpacity=".83"/>
            <stop offset=".15" stopColor="#fff" stopOpacity=".61"/>
            <stop offset=".26" stopColor="#fff" stopOpacity=".43"/>
            <stop offset=".36" stopColor="#fff" stopOpacity=".27"/>
            <stop offset=".46" stopColor="#fff" stopOpacity=".15"/>
            <stop offset=".55" stopColor="#fff" stopOpacity=".07"/>
            <stop offset=".65" stopColor="#fff" stopOpacity=".02"/>
            <stop offset=".73" stopColor="#fff" stopOpacity="0"/>
          </linearGradient>
          <linearGradient id={`linear-gradient-pressed-${buttonId}`} x1="890.69" y1="-358.27" x2="1031.73" y2="-113.99" gradientTransform="translate(1217.61 -59.25) rotate(-180)" gradientUnits="userSpaceOnUse">
            <stop offset=".05" stopColor="#fff" stopOpacity=".83"/>
            <stop offset=".05" stopColor="#fff" stopOpacity=".79"/>
            <stop offset=".09" stopColor="#fff" stopOpacity=".46"/>
            <stop offset=".11" stopColor="#fff" stopOpacity=".33"/>
            <stop offset=".2" stopColor="#fff" stopOpacity=".12"/>
            <stop offset=".25" stopColor="#fff" stopOpacity="0"/>
          </linearGradient>
          <linearGradient id={`linear-gradient-2-pressed-${buttonId}`} x1="254.44" y1="300.24" x2="254.44" y2="79.26" gradientUnits="userSpaceOnUse">
            <stop offset=".05" stopColor="#fff" stopOpacity=".83"/>
            <stop offset=".15" stopColor="#fff" stopOpacity=".61"/>
            <stop offset=".26" stopColor="#fff" stopOpacity=".43"/>
            <stop offset=".36" stopColor="#fff" stopOpacity=".27"/>
            <stop offset=".46" stopColor="#fff" stopOpacity=".15"/>
            <stop offset=".55" stopColor="#fff" stopOpacity=".07"/>
            <stop offset=".65" stopColor="#fff" stopOpacity=".02"/>
            <stop offset=".73" stopColor="#fff" stopOpacity="0"/>
          </linearGradient>
        </defs>

        {/* Base layer */}
        <g className="button-base">
          <g>
            <path className={`cls-4-${buttonId}`} d="M482.41,213.7H26.47c-10.23,18.8-15.83,39.21-15.83,60.54v50.43c0,7.1.71,14.08,2.22,20.92,16.02,75.81,118.07,134.27,241.58,134.27s225.56-58.46,241.58-134.27c1.47-6.84,2.22-13.82,2.22-20.92v-50.43l-15.83-60.54Z"/>
            <path className={`cls-7-${buttonId}`} d="M498.24,274.24c0,94.1-109.15,170.4-243.8,170.4S10.63,368.34,10.63,274.24c0-21.33,5.6-41.73,15.83-60.54,34.94-64.22,123.82-109.86,227.97-109.86s193.03,45.64,227.97,109.86c10.23,18.8,15.83,39.21,15.83,60.54Z"/>
            <ellipse className={`cls-2-${buttonId}`} cx="255.32" cy="270.96" rx="235.23" ry="160.56"/>
          </g>
        </g>

        {/* Top button layer */}
        {!isPlaying ? (
          <g className={`button-top button-top-unpressed button-top-${buttonId}`}>
            <g>
              <path className={`cls-1-${buttonId}`} d="M462.66,154.7v94c0,6-.63,11.94-1.9,17.73-13.68,64.23-100.85,113.74-206.32,113.74s-192.63-49.51-206.32-113.74c-1.27-5.79-1.9-11.72-1.9-17.73v-94h416.43Z"/>
              <ellipse className={`cls-5-${buttonId}`} cx="254.44" cy="154.7" rx="208.22" ry="139.17"/>
              <ellipse className={`cls-6-${buttonId}`} cx="254.53" cy="152.02" rx="197.7" ry="131.14"/>
            </g>
            <path className={`cls-8-${buttonId}`} d="M257.8,283.16c-51.32,0-102.69-12.82-141.89-38.46-38.78-25.35-60.16-59.32-60.2-95.66-.05-36.1,21.01-69.85,59.28-95.03,77.9-51.29,205.05-51.3,283.44-.02,38.77,25.35,60.15,59.32,60.2,95.65.05,36.1-21.02,69.86-59.31,95.05-38.94,25.64-90.2,38.47-141.52,38.47ZM256.54,23.66c-50.01,0-99.95,12.49-137.89,37.48-35.93,23.64-55.7,54.85-55.66,87.88.04,33.27,20.13,64.71,56.56,88.53h0c76.37,49.96,200.23,49.97,276.1,0,35.95-23.65,55.72-54.87,55.68-87.9-.04-33.27-20.13-64.7-56.56-88.52-38.18-24.98-88.24-37.47-138.24-37.47Z"/>
            <ellipse className={`cls-3-${buttonId}`} cx="254.44" cy="150.44" rx="187.39" ry="116.99"/>
          </g>
        ) : (
          <g className={`button-top button-top-pressed button-top-${buttonId}`} transform="translate(0, 8)">
            <g>
              <path className={`cls-1-${buttonId}`} d="M458.43,173.78v69.35c0,5.06-.62,10.08-1.86,14.96-13.41,54.21-98.81,95.99-202.14,95.99s-188.72-41.78-202.13-95.99c-1.24-4.89-1.86-9.9-1.86-14.96v-69.35l3.47-10h401.06c.91,2.83,1.66,5.71,2.22,8.61.42.46.83.92,1.24,1.39Z"/>
              <path className={`cls-5-${buttonId}`} d="M458.45,185.49c0,.51-.01,1.01-.02,1.52-.1,4.86-.72,9.65-1.82,14.35-13.46,57.37-98.84,101.6-202.16,101.6s-188.69-44.22-202.15-101.6c-1.22-5.19-1.85-10.49-1.85-15.87v-.15c.01-4.4.43-8.73,1.27-13,.55-2.89,1.29-5.74,2.2-8.57,17.7-54.5,100.75-95.74,200.52-95.74s182.84,41.25,200.53,95.74c.91,2.83,1.66,5.71,2.22,8.61.68,3.51,1.09,7.07,1.22,10.67.01.3.02.61.02.91.01.51.02,1.01.02,1.52Z"/>
              <ellipse className={`cls-6-${buttonId}`} cx="254.53" cy="183.24" rx="193.69" ry="110.69"/>
            </g>
            <path className={`cls-8p-${buttonId}`} d="M257.02,293.61c-49.82,0-99.69-11.18-137.74-33.55-37.64-22.11-58.4-51.74-58.44-83.44-.04-31.48,20.39-60.92,57.55-82.89,75.62-44.74,199.05-44.75,275.15-.02,37.64,22.11,58.4,51.74,58.44,83.44.05,31.49-20.4,60.94-57.57,82.91-37.8,22.37-87.57,33.55-137.38,33.55ZM255.8,67.26c-48.54,0-97.03,10.9-133.86,32.69-34.88,20.62-54.07,47.85-54.03,76.65.04,29.02,19.54,56.44,54.91,77.22h0c74.14,43.58,194.38,43.58,268.03,0,34.9-20.63,54.1-47.86,54.05-76.67-.04-29.02-19.54-56.44-54.9-77.21-37.07-21.79-85.66-32.68-134.2-32.68Z"/>
            <ellipse className={`cls-3p-${buttonId}`} cx="254.44" cy="183.24" rx="183.59" ry="95.5"/>
          </g>
        )}
      </svg>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="w-6 h-6 border-2 border-white/60 border-t-white rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
