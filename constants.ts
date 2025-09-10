import React from 'react';
// FIX: Import the `Platform` type to correctly type the platform arrays.
import { MapData, Platform } from './types';
import { NatureDecorations, SnowDecorations, SandDecorations } from './components/MapDecorations';

export const GAME_WIDTH = 1600;
export const GAME_HEIGHT = 900;

export const PLAYER_WIDTH = 40;
export const PLAYER_HEIGHT = 50;

export const GRAVITY = 0.8;
export const MAX_FALL_SPEED = 15;
export const PLAYER_SPEED = 7;
export const JUMP_FORCE = -18;
export const BOUNCY_JUMP_FORCE = -28;
export const TAG_COOLDOWN_TIME = 120; // 2 seconds at 60fps

export const PLAYER_COLORS = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', '#33FFA1', '#FFC300', '#C70039', '#900C3F', '#581845'];
export const PLAYER_NAMES = ['Bunny', 'Hops', 'Fluffy', 'Cottontail', 'Thumper', 'Jumper', 'Nibbles', 'Shadow', 'Dash', 'Bolt'];


// FIX: Explicitly type the platform array to ensure 'type' property conforms to the 'Platform' interface.
const naturePlatforms: Platform[] = [
    { x: 0, y: 850, width: 1600, height: 50 },
    { x: 200, y: 700, width: 250, height: 30 },
    { x: 550, y: 600, width: 200, height: 30 },
    { x: 850, y: 700, width: 150, height: 30 },
    { x: 1200, y: 650, width: 300, height: 30 },
    { x: 100, y: 500, width: 150, height: 30 },
    { x: 400, y: 400, width: 200, height: 30 },
    { x: 750, y: 450, width: 250, height: 30 },
    { x: 1100, y: 350, width: 200, height: 30 },
    { x: 0, y: 250, width: 250, height: 30 },
    { x: 1350, y: 200, width: 250, height: 30 },
    { x: 700, y: 150, width: 200, height: 30 },
    // Bouncy Mushrooms
    { x: 580, y: 830, width: 60, height: 20, type: 'mushroom' },
    { x: 1050, y: 830, width: 60, height: 20, type: 'mushroom' },
    { x: 780, y: 430, width: 60, height: 20, type: 'mushroom' },
];

// FIX: Explicitly type the platform array to ensure 'movement.type' property conforms to the 'Platform' interface.
const snowPlatforms: Platform[] = [
    { x: 0, y: 850, width: 400, height: 50 },
    { x: 1200, y: 850, width: 400, height: 50 },
    { x: 100, y: 750, width: 200, height: 30 },
    { x: 400, y: 650, width: 150, height: 30, movement: { type: 'vertical', distance: 100, speed: 2, offset: 0 } },
    { x: 650, y: 550, width: 300, height: 30 },
    { x: 1100, y: 700, width: 250, height: 30 },
    { x: 1400, y: 600, width: 150, height: 30 },
    { x: 50, y: 450, width: 100, height: 30 },
    { x: 300, y: 350, width: 200, height: 30 },
    { x: 800, y: 400, width: 250, height: 30, movement: { type: 'horizontal', distance: 200, speed: 2.5, offset: 100 } },
    { x: 1200, y: 300, width: 300, height: 30 },
    { x: 700, y: 200, width: 200, height: 30, movement: { type: 'vertical', distance: 50, speed: 1.5, offset: 50 } },
];

// FIX: Explicitly type the platform array to ensure 'movement.type' property conforms to the 'Platform' interface.
const sandPlatforms: Platform[] = [
    { x: 0, y: 850, width: 1600, height: 50 },
    { x: 50, y: 750, width: 300, height: 30 },
    { x: 450, y: 650, width: 200, height: 30, movement: { type: 'horizontal', distance: 150, speed: 2, offset: 0 } },
    { x: 750, y: 700, width: 150, height: 30 },
    { x: 1000, y: 600, width: 250, height: 30 },
    { x: 1350, y: 750, width: 200, height: 30 },
    { x: 200, y: 500, width: 150, height: 30 },
    { x: 550, y: 400, width: 300, height: 30, movement: { type: 'vertical', distance: 100, speed: 2.5, offset: 200 } },
    { x: 950, y: 450, width: 200, height: 30 },
    { x: 1250, y: 350, width: 150, height: 30 },
    { x: 0, y: 250, width: 200, height: 30, movement: { type: 'horizontal', distance: 100, speed: 1.5, offset: 50 } },
    { x: 1400, y: 200, width: 200, height: 30 },
];


export const MAPS: MapData[] = [
    {
        id: 'nature',
        name: 'Green Meadows',
        background: 'linear-gradient(to bottom, #87CEEB, #6dd5ed)',
        platforms: naturePlatforms,
        platformStyle: { className: 'fill-lime-600 stroke-lime-800', strokeWidth: "4" },
        decorations: React.createElement(NatureDecorations),
    },
    {
        id: 'snow',
        name: 'Winter Wonderland',
        background: 'linear-gradient(to bottom, #a1c4fd, #c2e9fb)',
        platforms: snowPlatforms,
        platformStyle: { className: 'fill-slate-100 stroke-slate-400', strokeWidth: "4", rx: "5" },
        decorations: React.createElement(SnowDecorations),
    },
    {
        id: 'sand',
        name: 'Desert Dunes',
        background: 'linear-gradient(to bottom, #fde4a8, #f8c26c)',
        platforms: sandPlatforms,
        platformStyle: { className: 'fill-amber-400 stroke-amber-600', strokeWidth: "4" },
        decorations: React.createElement(SandDecorations),
    }
];