
import React from 'react';
import { useControls } from 'react-zoom-pan-pinch';

export const ZoomControls: React.FC = () => {
  const { zoomIn, zoomOut, resetTransform } = useControls();

  return (
    <div className="absolute top-4 right-4 z-50 flex gap-2">
      <button
        onClick={() => zoomOut()}
        className="bg-manjaro-surface text-manjaro-text border border-manjaro-border rounded-lg px-3 py-2 font-semibold transition-all duration-150 hover:bg-manjaro-light active:ring-2 active:ring-manjaro-mint"
        title="Zoom Out"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      </button>
      
      <button
        onClick={() => zoomIn()}
        className="bg-manjaro-surface text-manjaro-text border border-manjaro-border rounded-lg px-3 py-2 font-semibold transition-all duration-150 hover:bg-manjaro-light active:ring-2 active:ring-manjaro-mint"
        title="Zoom In"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      <button
        onClick={() => resetTransform()}
        className="bg-manjaro-surface text-manjaro-text border border-manjaro-border rounded-lg px-3 py-2 font-semibold transition-all duration-150 hover:bg-manjaro-light active:ring-2 active:ring-manjaro-mint"
        title="Reset View"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </div>
  );
};
