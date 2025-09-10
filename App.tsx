
import React, { useState, useCallback } from 'react';
import { GameScreen, GameSettings } from './types';
import LobbyScreen from './components/MainMenu';
import MapSelectScreen from './components/MapSelectScreen';
import Game from './components/Game';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>(GameScreen.Lobby);
  const [gameSettings, setGameSettings] = useState<GameSettings>({
    playerCount: 2,
    gameTime: 120,
    mapId: 'nature'
  });

  const handleStartGame = useCallback((settings: GameSettings) => {
    setGameSettings(settings);
    setCurrentScreen(GameScreen.Game);
  }, []);

  const handleProceedToMapSelect = useCallback((count: number) => {
    setGameSettings(prev => ({ ...prev, playerCount: count }));
    setCurrentScreen(GameScreen.MapSelect);
  }, []);

  const handleBackToLobby = useCallback(() => {
    setCurrentScreen(GameScreen.Lobby);
  }, []);
  
  const handleBackToMapSelect = useCallback(() => {
    setCurrentScreen(GameScreen.MapSelect);
  }, []);

  const renderScreen = () => {
    switch (currentScreen) {
      case GameScreen.Lobby:
        return <LobbyScreen onProceed={handleProceedToMapSelect} initialPlayerCount={gameSettings.playerCount} />;
      case GameScreen.MapSelect:
        return <MapSelectScreen onStartGame={handleStartGame} onBack={handleBackToLobby} initialSettings={gameSettings} />;
      case GameScreen.Game:
        return <Game settings={gameSettings} onBackToMenu={handleBackToLobby} onPlayAgain={handleBackToMapSelect} />;
      default:
        return <LobbyScreen onProceed={handleProceedToMapSelect} initialPlayerCount={gameSettings.playerCount} />;
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-black">
      <div className="aspect-[16/9] w-full max-w-screen-2xl h-auto max-h-screen">
        {renderScreen()}
      </div>
    </div>
  );
};

export default App;