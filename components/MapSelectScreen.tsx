
import React, { useState } from 'react';
import { GameSettings, MapData } from '../types';
import { MAPS } from '../constants';

interface MapSelectScreenProps {
  onStartGame: (settings: GameSettings) => void;
  onBack: () => void;
  initialSettings: GameSettings;
}

const MapPreview: React.FC<{ map: MapData; isSelected: boolean; onClick: () => void }> = ({ map, isSelected, onClick }) => (
  <div
    onClick={onClick}
    className={`w-1/3 aspect-[4/3] p-4 cursor-pointer transform transition-transform duration-200 hover:scale-105 ${isSelected ? 'scale-105' : ''}`}
  >
    <div className={`w-full h-full rounded-2xl border-8 ${isSelected ? 'border-yellow-400' : 'border-white'} shadow-lg overflow-hidden flex items-center justify-center`} style={{ background: map.background }}>
      <div className="relative w-full h-full scale-50">
          {map.decorations}
      </div>
    </div>
    <h3 className="text-center text-3xl text-white font-bold mt-2 text-stroke-sm">{map.name}</h3>
  </div>
);

const MapSelectScreen: React.FC<MapSelectScreenProps> = ({ onStartGame, onBack, initialSettings }) => {
  const [settings, setSettings] = useState<GameSettings>(initialSettings);

  const handleMapSelect = (mapId: string) => {
    setSettings(prev => ({ ...prev, mapId }));
  };
  
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseInt(e.target.value, 10);
    if (time >= 30 && time <= 300) {
        setSettings(prev => ({ ...prev, gameTime: time }));
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-b from-teal-400 to-cyan-600 flex flex-col items-center justify-center p-8">
      <h1 className="text-7xl font-bold text-white text-stroke mb-8">CHOOSE MAP</h1>
      
      <div className="flex w-full max-w-6xl justify-center items-start mb-8">
        {MAPS.map(map => (
          <MapPreview key={map.id} map={map} isSelected={settings.mapId === map.id} onClick={() => handleMapSelect(map.id)} />
        ))}
      </div>

      <div className="flex items-center space-x-4 mb-8">
        <label className="text-3xl text-white font-bold text-stroke-sm" htmlFor="game-time">TIME (SEC):</label>
        <input 
            type="number"
            id="game-time"
            min="30"
            max="300"
            step="10"
            value={settings.gameTime}
            onChange={handleTimeChange}
            className="w-32 text-center text-3xl font-bold p-2 rounded-lg border-4 border-gray-600"
        />
      </div>

      <div className="flex items-center space-x-6">
        <button onClick={onBack} className="p-4 bg-white rounded-lg border-4 border-gray-600 shadow-lg transform hover:scale-105 transition-transform">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <button 
          onClick={() => onStartGame(settings)}
          className="bg-white text-4xl text-gray-800 font-bold py-4 px-12 rounded-lg border-4 border-b-8 border-gray-600 active:border-b-4 transform hover:scale-105 transition-transform"
        >
          START GAME
        </button>
      </div>
    </div>
  );
};

export default MapSelectScreen;