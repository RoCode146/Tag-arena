
import React from 'react';

const Tree: React.FC<{ x: number, y: number, scale?: number }> = ({ x, y, scale = 1 }) => (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
        <rect x="15" y="50" width="10" height="30" fill="#8B4513"/>
        <circle cx="20" cy="35" r="25" fill="#228B22"/>
    </g>
);

const Flower: React.FC<{ x: number, y: number, color: string }> = ({ x, y, color }) => (
    <g transform={`translate(${x}, ${y})`}>
        <rect x="4.5" y="10" width="1" height="10" fill="green"/>
        <circle cx="5" cy="5" r="5" fill={color}/>
    </g>
);

export const NatureDecorations: React.FC = () => (
    <>
        <Tree x={250} y={620} />
        <Tree x={1250} y={570} />
        <Tree x={450} y={320} />
        <Tree x={150} y={170} />
        <Flower x={220} y={680} color="red" />
        <Flower x={600} y={580} color="yellow" />
        <Flower x={900} y={680} color="pink" />
    </>
);

const Snowman: React.FC<{ x: number, y: number }> = ({ x, y }) => (
    <g transform={`translate(${x}, ${y})`}>
        <circle cx="15" cy="40" r="15" fill="white" stroke="#ccc" />
        <circle cx="15" cy="18" r="12" fill="white" stroke="#ccc" />
        <rect x="5" y="0" width="20" height="10" fill="black" />
        <rect x="0" y="8" width="30" height="2" fill="black" />
    </g>
);

const CandyCane: React.FC<{ x: number, y: number }> = ({ x, y }) => (
    <path d={`M ${x} ${y} v -20 a 10 10 0 0 1 20 0`} stroke="red" strokeWidth="5" fill="none" />
);

export const SnowDecorations: React.FC = () => (
    <>
        <Snowman x={450} y={600} />
        <CandyCane x={1150} y={850} />
        <CandyCane x={850} y={550} />
        <rect x="100" y="650" width="200" height="100" fill="white" rx="10" />
        <rect x="1100" y="600" width="250" height="100" fill="white" rx="10" />
    </>
);

const Cactus: React.FC<{ x: number, y: number }> = ({ x, y }) => (
    <g transform={`translate(${x}, ${y})`}>
        <path d="M 10 50 V 10 H 20 V 50 Z" fill="green" stroke="#056305" strokeWidth="2"/>
        <path d="M 20 20 h 10 v 15 h -10 Z" fill="green" stroke="#056305" strokeWidth="2"/>
        <path d="M 0 30 h 10 v 15 h -10 Z" fill="green" stroke="#056305" strokeWidth="2"/>
    </g>
);

const Pyramid: React.FC<{ x: number, y: number }> = ({ x, y }) => (
    <polygon points={`${x},${y} ${x+50},${y} ${x+25},${y-40}`} fill="#F0E68C" stroke="#D2B48C" strokeWidth="2" />
);

export const SandDecorations: React.FC = () => (
    <>
        <Cactus x={100} y={800} />
        <Cactus x={1400} y={800} />
        <Pyramid x={1100} y={850} />
        <Cactus x={600} y={350} />
    </>
);
