import React, { useState } from 'react';
import { RabbitIcon } from './icons';
import { PLAYER_COLORS, PLAYER_NAMES } from '../constants';

interface LobbyScreenProps {
  onProceed: (playerCount: number) => void;
  initialPlayerCount: number;
}

const LobbyScreen: React.FC<LobbyScreenProps> = ({ onProceed, initialPlayerCount }) => {
    const [playerCount, setPlayerCount] = useState(initialPlayerCount);
    const [inviteText, setInviteText] = useState('INVITE FRIENDS');

    const handlePlayerCountChange = (amount: number) => {
        setPlayerCount(prev => Math.max(2, Math.min(10, prev + amount)));
    };

    const handleInvite = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            setInviteText('LINK COPIED!');
            setTimeout(() => setInviteText('INVITE FRIENDS'), 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            alert("Failed to copy link. Please copy the URL from your browser's address bar.");
        });
    };

    const players = Array.from({ length: playerCount }, (_, i) => ({
        id: i,
        name: i === 0 ? 'You' : `${PLAYER_NAMES[i]} (AI)`,
        color: PLAYER_COLORS[i],
    }));

    return (
        <div className="w-full h-full bg-gradient-to-b from-purple-500 to-indigo-600 flex flex-col items-center justify-center p-8 relative overflow-hidden text-white">
            <h1 className="text-8xl font-bold text-stroke mb-6">GAME LOBBY</h1>
            
            <div className="bg-white/10 p-6 rounded-2xl shadow-lg border-2 border-white/20 w-full max-w-4xl flex flex-col items-center">
                <div className="mb-6 w-full max-w-sm">
                    <label className="text-3xl font-bold text-stroke-sm mb-2 block text-center">PLAYERS</label>
                    <div className="flex items-center justify-center space-x-4 bg-black/20 p-2 rounded-xl">
                        <button onClick={() => handlePlayerCountChange(-1)} className="text-5xl font-bold w-16 h-16 bg-red-500 rounded-lg border-b-4 border-red-700 active:border-b-0">-</button>
                        <span className="text-6xl font-bold w-24 text-center">{playerCount}</span>
                        <button onClick={() => handlePlayerCountChange(1)} className="text-5xl font-bold w-16 h-16 bg-green-500 rounded-lg border-b-4 border-green-700 active:border-b-0">+</button>
                    </div>
                </div>

                <div className="w-full h-64 overflow-y-auto bg-black/20 rounded-xl p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                    {players.map(player => (
                        <div key={player.id} className="bg-white/10 p-3 rounded-lg flex flex-col items-center justify-center text-center">
                            <RabbitIcon color={player.color} width={60} height={70}/>
                            <p className="font-bold text-lg mt-1 truncate">{player.name}</p>
                        </div>
                    ))}
                </div>

                <div className="flex space-x-4">
                    <button 
                        onClick={handleInvite}
                        className="bg-blue-500 text-3xl font-bold py-4 px-8 rounded-lg border-b-8 border-blue-700 active:border-b-2 transform hover:scale-105 transition-transform"
                    >
                        {inviteText}
                    </button>
                    <button 
                        onClick={() => onProceed(playerCount)}
                        className="bg-yellow-500 text-3xl font-bold py-4 px-12 rounded-lg border-b-8 border-yellow-700 active:border-b-2 transform hover:scale-105 transition-transform"
                    >
                        PROCEED
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LobbyScreen;