import React, { useState } from 'react';
import GameCanvas from './components/GameCanvas';
import DialogueUI from './components/DialogueUI';
import EvidenceBoard from './components/EvidenceBoard';
import CaseFile from './components/CaseFile';
import { useEvidenceTracker } from './hooks/useEvidenceTracker';

function App() {
  const [activeNPC, setActiveNPC] = useState(null);
  const [showEvidence, setShowEvidence] = useState(false);
  const [showDebug, setShowDebug] = useState(true);
  const [worldData, setWorldData] = useState(null);

  const { knownClues, suspectStatus } = useEvidenceTracker();

  return (
    <div className="w-screen h-screen bg-arcane-bg relative overflow-hidden">
      {/* 3D World Layer */}
      <div className="absolute inset-0 z-0">
        <GameCanvas
          onInteract={(npc) => setActiveNPC(npc)}
          onLoadComplete={setWorldData}
        />
      </div>

      {/* HUD Layer */}
      <div className="absolute top-4 right-4 z-20 flex gap-2 pointer-events-auto">
        <button
          onClick={() => setShowEvidence(true)}
          className="bg-arcane-bg/80 border border-arcane-gold text-arcane-gold px-4 py-2 rounded hover:bg-arcane-gold hover:text-arcane-bg transition-colors font-serif"
        >
          EVIDENCE BOARD
        </button>
      </div>

      {/* UI Overlays */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        {activeNPC && (
          <DialogueUI
            npc={activeNPC}
            knownClues={knownClues}
            onClose={() => setActiveNPC(null)}
          />
        )}

        {showEvidence && worldData && (
          <EvidenceBoard
            clues={worldData.mystery.clues} // Show all for now, or filter by knownClues
            suspects={worldData.mystery.suspects}
            onClose={() => setShowEvidence(false)}
          />
        )}

        {showDebug && worldData && (
          <CaseFile
            mystery={worldData.mystery}
            onClose={() => setShowDebug(false)}
          />
        )}
      </div>
    </div>
  );
}

export default App;
