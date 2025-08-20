
import React from 'react';

const LyraIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g filter="url(#filter0_f_93_2)">
      <path d="M50 20C66.5685 20 80 33.4315 80 50C80 66.5685 66.5685 80 50 80C33.4315 80 20 66.5685 20 50C20 33.4315 33.4315 20 50 20Z" fill="url(#paint0_radial_93_2)"/>
    </g>
    <path d="M50 30C52.6894 30 55.3375 30.5372 57.8011 31.5733C64.6934 34.3644 69.6356 39.3066 72.4267 46.1989C73.4628 48.6625 74 51.3106 74 54C74 65.0457 65.0457 74 54 74C51.3106 74 48.6625 73.4628 46.1989 72.4267C39.3066 69.6356 34.3644 64.6934 31.5733 57.8011C30.5372 55.3375 30 52.6894 30 50C30 38.9543 38.9543 30 50 30Z" stroke="url(#paint1_linear_93_2)" strokeWidth="3"/>
    <defs>
      <filter id="filter0_f_93_2" x="0" y="0" width="100" height="100" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
        <feGaussianBlur stdDeviation="10" result="effect1_foregroundBlur_93_2"/>
      </filter>
      <radialGradient id="paint0_radial_93_2" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(50 50) rotate(90) scale(30)">
        <stop stopColor="#67E8F9"/>
        <stop offset="1" stopColor="#A855F7" stopOpacity="0.7"/>
      </radialGradient>
      <linearGradient id="paint1_linear_93_2" x1="30" y1="30" x2="74" y2="74" gradientUnits="userSpaceOnUse">
        <stop stopColor="white"/>
        <stop offset="1" stopColor="white" stopOpacity="0.3"/>
      </linearGradient>
    </defs>
  </svg>
);

export default LyraIcon;
