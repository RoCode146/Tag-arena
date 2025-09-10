import React from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { GameSettings, MapData, Player, Platform } from '../types';
import { MAPS, GAME_WIDTH, GAME_HEIGHT, PLAYER_WIDTH, PLAYER_HEIGHT, GRAVITY, MAX_FALL_SPEED, PLAYER_SPEED, JUMP_FORCE, BOUNCY_JUMP_FORCE, PLAYER_COLORS, PLAYER_NAMES, TAG_COOLDOWN_TIME } from '../constants';
import { RabbitIcon, TagIcon, MushroomPlatform } from './icons';

interface GameProps {
  settings: GameSettings;
  onBackToMenu: () => void;
  onPlayAgain: () => void;
}

type GamePhase = 'Countdown' | 'Playing' | 'GameOver';

const Game: React.FC<GameProps> = ({ settings, onBackToMenu, onPlayAgain }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [timeLeft, setTimeLeft] = useState(settings.gameTime);
  const [gamePhase, setGamePhase] = useState<GamePhase>('Countdown');
  const [countdown, setCountdown] = useState(3);
  const [viewBox, setViewBox] = useState(`0 0 ${GAME_WIDTH} ${GAME_HEIGHT}`);
  const [platformState, setPlatformState] = useState<Platform[]>([]);

  const mapData = useRef<MapData>(MAPS.find(m => m.id === settings.mapId) || MAPS[0]);
  const gameLoopRef = useRef<number | null>(null);
  const playerInputs = useRef<{ [key: number]: { left: boolean; right: boolean; jump: boolean } }>({});
  const winner = useRef<Player[]>([]);
  const loser = useRef<Player | null>(null);
  const animationFrame = useRef(0);

  const initializePlayers = useCallback(() => {
    const newPlayers: Player[] = [];
    const availablePlatforms = mapData.current.platforms.filter(p => p.y < GAME_HEIGHT - 50);

    for (let i = 0; i < settings.playerCount; i++) {
        const spawnPlatform = availablePlatforms[i % availablePlatforms.length] || mapData.current.platforms[0];
        newPlayers.push({
            id: i,
            name: i === 0 ? 'You' : PLAYER_NAMES[i % PLAYER_NAMES.length],
            color: PLAYER_COLORS[i % PLAYER_COLORS.length],
            position: { x: spawnPlatform.x + spawnPlatform.width / 2 - PLAYER_WIDTH / 2, y: spawnPlatform.y - PLAYER_HEIGHT - 20 },
            velocity: { x: 0, y: 0 },
            isIt: false,
            isOnGround: false,
            isAi: i !== 0,
            tagCooldown: 0,
        });
        playerInputs.current[i] = { left: false, right: false, jump: false };
    }
    const firstIt = Math.floor(Math.random() * settings.playerCount);
    newPlayers[firstIt].isIt = true;
    setPlayers(newPlayers);
  }, [settings.playerCount]);
  
  useEffect(() => {
    setPlatformState(mapData.current.platforms.map(p => ({...p})));
    initializePlayers();
  }, [initializePlayers]);

  useEffect(() => {
    if (gamePhase === 'Playing' && players.length > 0) {
        const PADDING = 250;
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

        players.forEach(p => {
            minX = Math.min(minX, p.position.x);
            maxX = Math.max(maxX, p.position.x + PLAYER_WIDTH);
            minY = Math.min(minY, p.position.y);
            maxY = Math.max(maxY, p.position.y + PLAYER_HEIGHT);
        });

        const midX = (minX + maxX) / 2;
        const midY = (minY + maxY) / 2;
        const width = maxX - minX + PADDING * 2;
        const height = maxY - minY + PADDING * 2;

        const scale = Math.min(GAME_WIDTH / width, GAME_HEIGHT / height);
        const clampedScale = Math.max(0.4, Math.min(1, scale));

        const viewboxWidth = GAME_WIDTH / clampedScale;
        const viewboxHeight = GAME_HEIGHT / clampedScale;
        const viewboxX = midX - viewboxWidth / 2;
        const viewboxY = midY - viewboxHeight / 2;
        
        setViewBox(`${viewboxX} ${viewboxY} ${viewboxWidth} ${viewboxHeight}`);
    } else if (gamePhase !== 'Playing') {
        setViewBox(`0 0 ${GAME_WIDTH} ${GAME_HEIGHT}`);
    }
  }, [players, gamePhase]);


  useEffect(() => {
    if (gamePhase === 'Countdown') {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setGamePhase('Playing');
      }
    }
  }, [gamePhase, countdown]);

  useEffect(() => {
    if (gamePhase !== 'Playing') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGamePhase('GameOver');
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gamePhase]);

  const gameLoop = useCallback(() => {
    if (gamePhase !== 'Playing') return;
    animationFrame.current++;

    const currentPlatforms = mapData.current.platforms.map(p => {
        if (p.movement) {
            const { type, distance, speed, offset } = p.movement;
            const cycle = Math.sin((animationFrame.current + offset) * speed * 0.01);
            const newPos = { ...p };
            if (type === 'horizontal') {
                newPos.x = p.x + cycle * distance;
            } else {
                newPos.y = p.y + cycle * distance;
            }
            return newPos;
        }
        return p;
    });
    setPlatformState(currentPlatforms);

    setPlayers(prevPlayers => {
        const itPlayer = prevPlayers.find(p => p.isIt);
        
        let newPlayers = [...prevPlayers];

        const taggedPlayerIndices: number[] = [];

        newPlayers = newPlayers.map((p, pIndex) => {
            let { x, y } = p.position;
            let { x: vx, y: vy } = p.velocity;
            let isOnGround = false;
            let platformMovementX = 0;

            const inputs = playerInputs.current[p.id];

            if (p.isAi && itPlayer) {
              const isChasing = p.isIt;
              const target = isChasing
                  ? newPlayers.filter(pl => !pl.isIt).sort((a,b) => Math.hypot(a.position.x - p.position.x, a.position.y - p.position.y) - Math.hypot(b.position.x - p.position.x, b.position.y - p.position.y))[0]
                  : itPlayer;

              if (target) {
                  const direction = target.position.x > x ? 1 : -1;
                  const distanceX = Math.abs(target.position.x - x);
                  const distanceY = target.position.y - y;
                  
                  if (isChasing) { // Move towards target
                      vx = PLAYER_SPEED * direction;
                      // Logic to walk off ledges
                      if (p.isOnGround && distanceY > 50 && distanceX < 100) {
                          // Check if there is a platform below the edge
                          const edgeX = direction > 0 ? x + PLAYER_WIDTH : x;
                          const isPlatformBelow = currentPlatforms.some(plat => edgeX > plat.x && edgeX < plat.x + plat.width && y < plat.y);
                          if (!isPlatformBelow) {
                              // Continue walking off
                          }
                      }
                  } else { // Flee from target
                      if (distanceX < 300) {
                         vx = -PLAYER_SPEED * direction;
                         // Panic jump
                         if(distanceX < 100 && p.isOnGround && Math.random() < 0.05) {
                            vy = JUMP_FORCE;
                         }
                      } else {
                         vx = p.velocity.x * 0.95; 
                         if (p.isOnGround && Math.abs(vx) < 0.1) vx = 0;
                      }
                  }
                  
                  // Smarter jump logic
                  if (p.isOnGround && distanceY < -50 && distanceX < 300 && isChasing && Math.random() < 0.03) {
                      vy = JUMP_FORCE;
                  }
              }
            } else if (!p.isAi) {
                if (inputs.left) vx = -PLAYER_SPEED;
                else if (inputs.right) vx = PLAYER_SPEED;
                else vx = 0;

                if (inputs.jump && p.isOnGround) {
                    vy = JUMP_FORCE;
                    inputs.jump = false; // Consume jump input
                }
            }

            vy += GRAVITY;
            if (vy > MAX_FALL_SPEED) vy = MAX_FALL_SPEED;

            let nextX = x + vx;
            let nextY = y + vy;

            currentPlatforms.forEach((platform, index) => {
                const originalPlatform = mapData.current.platforms[index];
                if (nextX + PLAYER_WIDTH > platform.x && nextX < platform.x + platform.width &&
                    y + PLAYER_HEIGHT <= platform.y && nextY + PLAYER_HEIGHT > platform.y) {
                    nextY = platform.y - PLAYER_HEIGHT;
                    
                    if (originalPlatform.type === 'mushroom') {
                        vy = BOUNCY_JUMP_FORCE;
                    } else {
                        vy = 0;
                    }

                    isOnGround = true;

                    if(originalPlatform.movement?.type === 'horizontal') {
                        platformMovementX = platform.x - originalPlatform.x;
                    }
                }
            });
            
            if (platformMovementX !== 0) {
                nextX += platformMovementX;
            }

            if (nextX < 0) nextX = 0;
            if (nextX + PLAYER_WIDTH > GAME_WIDTH) nextX = GAME_WIDTH - PLAYER_WIDTH;
            if (nextY + PLAYER_HEIGHT > GAME_HEIGHT) {
                nextY = GAME_HEIGHT - PLAYER_HEIGHT; vy = 0; isOnGround = true;
            }
            if (nextY < 0) { nextY = 0; vy = 0; }

            if (p.isIt && p.tagCooldown <= 0) {
              newPlayers.forEach((other, otherIndex) => {
                if (pIndex !== otherIndex && !other.isIt) {
                    if (Math.abs(nextX - other.position.x) < PLAYER_WIDTH && Math.abs(nextY - other.position.y) < PLAYER_HEIGHT) {
                        taggedPlayerIndices.push(pIndex, otherIndex);
                    }
                }
              });
            }

            return { ...p, position: { x: nextX, y: nextY }, velocity: { x: vx, y: vy }, isOnGround, tagCooldown: Math.max(0, p.tagCooldown - 1) };
        });

        if (taggedPlayerIndices.length > 0) {
            const [tagerIndex, tageeIndex] = taggedPlayerIndices;
            newPlayers[tagerIndex].isIt = false;
            newPlayers[tagerIndex].tagCooldown = TAG_COOLDOWN_TIME;
            newPlayers[tageeIndex].isIt = true;
            newPlayers[tageeIndex].tagCooldown = TAG_COOLDOWN_TIME;
        }

        return newPlayers;
    });

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gamePhase]);

  useEffect(() => {
    if (gamePhase === 'Playing') {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gamePhase, gameLoop]);
  
  useEffect(() => {
    if (gamePhase === 'GameOver') {
      loser.current = players.find(p => p.isIt) || null;
      winner.current = players.filter(p => !p.isIt);
    }
  }, [gamePhase, players]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gamePhase !== 'Playing' || !playerInputs.current[0]) return;
      if (e.key === 'ArrowLeft' || e.key === 'a') playerInputs.current[0].left = true;
      if (e.key === 'ArrowRight' || e.key === 'd') playerInputs.current[0].right = true;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === ' ') { 
        e.preventDefault(); 
        playerInputs.current[0].jump = true; 
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (gamePhase !== 'Playing' || !playerInputs.current[0]) return;
      if (e.key === 'ArrowLeft' || e.key === 'a') playerInputs.current[0].left = false;
      if (e.key === 'ArrowRight' || e.key === 'd') playerInputs.current[0].right = false;
      // Note: jump is not set to false here. It's consumed in the game loop.
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gamePhase]);

  const Overlay = () => {
    if (gamePhase === 'Countdown') {
      return (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-white text-[15rem] font-bold text-stroke animate-ping">{countdown > 0 ? countdown : 'GO!'}</div>
            <div className="absolute text-white text-[15rem] font-bold text-stroke">{countdown > 0 ? countdown : 'GO!'}</div>
        </div>
      );
    }
    if (gamePhase === 'GameOver') {
      return (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-white">
          <h2 className="text-8xl font-bold text-stroke mb-4">GAME OVER</h2>
          <div className="text-center mb-8">
            <h3 className="text-5xl font-bold text-red-500 mb-2">LOSER</h3>
            <p className="text-4xl">{loser.current?.name}</p>
          </div>
          <div className="text-center">
            <h3 className="text-5xl font-bold text-green-500 mb-2">WINNERS</h3>
            <div className="flex flex-wrap justify-center gap-x-4 text-3xl max-w-4xl">
              {winner.current.map(p => <span key={p.id}>{p.name}</span>)}
            </div>
          </div>
          <div className="flex space-x-4 mt-12">
            <button onClick={onPlayAgain} className="bg-blue-500 text-3xl font-bold py-3 px-8 rounded-lg border-b-4 border-blue-700 hover:bg-blue-600">PLAY AGAIN</button>
            <button onClick={onBackToMenu} className="bg-gray-500 text-3xl font-bold py-3 px-8 rounded-lg border-b-4 border-gray-700 hover:bg-gray-600">MAIN MENU</button>
          </div>
        </div>
      );
    }
    return null;
  };
  
  const platformStyle = mapData.current.platformStyle;

  return (
    <div className="w-full h-full relative overflow-hidden" style={{ background: mapData.current.background }}>
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white text-6xl font-bold text-stroke bg-black bg-opacity-25 px-6 py-2 rounded-xl z-20">
        {timeLeft}
      </div>
      
      <svg width="100%" height="100%" viewBox={viewBox} className="absolute top-0 left-0">
        <g>{mapData.current.decorations}</g>

        {platformState.map((p, i) => {
            const originalPlatform = mapData.current.platforms[i];
            if(originalPlatform.type === 'mushroom') {
                return <MushroomPlatform key={i} x={p.x} y={p.y} width={p.width} height={p.height} />;
            }
            return <rect key={i} x={p.x} y={p.y} width={p.width} height={p.height} className={platformStyle?.className || "fill-green-600"} stroke={platformStyle ? 'currentColor' : '#059669'} strokeWidth={platformStyle?.strokeWidth || '4'} rx={platformStyle?.rx} />
        })}

        {players.map(p => (
            <g key={p.id} transform={`translate(${p.position.x}, ${p.position.y})`}>
                <RabbitIcon color={p.color} width={PLAYER_WIDTH} height={PLAYER_HEIGHT} />
                {p.isIt && <g transform={`translate(${PLAYER_WIDTH / 2}, -30)`}><TagIcon /></g>}
            </g>
        ))}
      </svg>
      <Overlay />
    </div>
  );
};

export default Game;