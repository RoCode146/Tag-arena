export enum GameScreen {
  Lobby,
  MapSelect,
  Game,
}

export interface Vector2D {
  x: number;
  y: number;
}

export interface Player {
  id: number;
  name: string;
  color: string;
  position: Vector2D;
  velocity: Vector2D;
  isIt: boolean;
  isOnGround: boolean;
  isAi: boolean;
  tagCooldown: number;
}

export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  type?: 'default' | 'bouncy' | 'mushroom';
  movement?: {
    type: 'horizontal' | 'vertical';
    distance: number;
    speed: number;
    offset: number; // to de-sync platform movements
  };
}

export interface MapData {
  id: string;
  name: string;
  background: string;
  platforms: Platform[];
  platformStyle?: {
      className: string;
      strokeWidth?: string;
      rx?: string;
  };
  decorations: React.ReactNode;
}

export interface GameSettings {
    playerCount: number;
    gameTime: number;
    mapId: string;
}