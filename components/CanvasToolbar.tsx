
import React from 'react';
import { LayoutDirection } from '../utils/layout';

interface CanvasToolbarProps {
  onApplyLayout: (direction: LayoutDirection) => void;
  onResetView: () => void;
}

export const CanvasToolbar: React.FC<CanvasToolbarProps> = ({ onApplyLayout, onResetView }) => {
  return (
    <div className="absolute top-4 right-4 z-10 flex space-x-2">
      <button
        onClick={() => onApplyLayout('horizontal')}
        className="flex items-center bg-manjaro-surface hover:bg-manjaro-light text-manjaro-text border border-manjaro-border font-semibold py-2 px-4 rounded-xl transition duration-200 shadow-lg"
        title="Apply Horizontal Layout"
      >
        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12M8 12h12M8 17h12M3 7h.01M3 12h.01M3 17h.01" />
        </svg>
        Horizontal
      </button>
      
      <button
        onClick={() => onApplyLayout('vertical')}
        className="flex items-center bg-manjaro-surface hover:bg-manjaro-light text-manjaro-text border border-manjaro-border font-semibold py-2 px-4 rounded-xl transition duration-200 shadow-lg"
        title="Apply Vertical Layout"
      >
        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
        Vertical
      </button>

      <button
        onClick={onResetView}
        className="flex items-center bg-manjaro-surface hover:bg-manjaro-light text-manjaro-text border border-manjaro-border font-semibold py-2 px-4 rounded-xl transition duration-200 shadow-lg"
        title="Reset View"
      >
        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Reset
      </button>
    </div>
  );
};
