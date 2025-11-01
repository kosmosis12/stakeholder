
import React from 'react';
import { PlusIcon } from './icons';

interface WelcomeScreenProps {
    onAddAccount: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onAddAccount }) => {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center text-manjaro-textAlt p-8">
            <h2 className="text-3xl font-bold text-manjaro-mint mb-2">Welcome to the Stakeholder Map</h2>
            <p className="max-w-md mb-8 text-manjaro-text">
                Visualize buying committees, understand influence hierarchies, and keep track of key players. 
                Start by creating your first account.
            </p>
            <button
                onClick={onAddAccount}
                className="flex items-center justify-center bg-manjaro-mint hover:bg-manjaro-mintDark text-white font-semibold py-3 px-6 rounded-xl transition duration-200 text-lg shadow-glow"
            >
                <PlusIcon className="w-6 h-6 mr-2" /> Create New Account
            </button>
        </div>
    );
};
