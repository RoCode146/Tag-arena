import React from 'react';

interface RabbitIconProps {
  color: string;
  width?: number;
  height?: number;
}

export const RabbitIcon: React.FC<RabbitIconProps> = ({ color, width = 40, height = 50 }) => (
  <svg width={width} height={height} viewBox="0 0 40 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 50C10 44.4772 14.4772 40 20 40C25.5228 40 30 44.4772 30 50H10Z" fill={color} stroke="black" strokeWidth="2"/>
    <path d="M5 25C5 16.7157 11.7157 10 20 10C28.2843 10 35 16.7157 35 25V40H5V25Z" fill={color} stroke="black" strokeWidth="2"/>
    <path d="M8 0C8 5.52285 3.52285 10 0 10V20C6.62742 20 12 14.4772 12 8V0H8Z" fill={color} stroke="black" strokeWidth="2"/>
    <path d="M32 0C32 5.52285 36.4772 10 40 10V20C33.3726 20 28 14.4772 28 8V0H32Z" fill={color} stroke="black" strokeWidth="2"/>
    <circle cx="15" cy="25" r="2" fill="black"/>
    <circle cx="25" cy="25" r="2" fill="black"/>
  </svg>
);


export const TagIcon: React.FC = () => (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="#facc15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 22 22 2 22" />
    </svg>
);

interface PlatformProps {
    x: number;
    y: number;
    width: number;
    height: number;
}

export const MushroomPlatform: React.FC<PlatformProps> = ({ x, y, width, height }) => (
    <g transform={`translate(${x}, ${y})`}>
        <path d={`M ${width * 0.2} ${height} V ${height * 0.5} H ${width * 0.8} V ${height} Z`} fill="#F0E68C" stroke="#D2B48C" strokeWidth="2" />
        <path d={`M 0 ${height * 0.5} C ${width * 0.1} ${height * -0.2}, ${width * 0.9} ${height * -0.2}, ${width} ${height * 0.5} Z`} fill="#FF6347" stroke="#8B0000" strokeWidth="2" />
        <circle cx={width * 0.5} cy={height * 0.1} r={width * 0.1} fill="white" />
        <circle cx={width * 0.25} cy={height * 0.2} r={width * 0.08} fill="white" />
        <circle cx={width * 0.75} cy={height * 0.2} r={width * 0.08} fill="white" />
    </g>
);