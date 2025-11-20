import React from 'react';

export default function EvidenceBoard({ clues, suspects, onClose }) {
    return (
        <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center p-10 pointer-events-auto">
            <div className="bg-arcane-bg border-2 border-arcane-gold w-full h-full max-w-6xl p-8 relative overflow-y-auto shadow-[0_0_50px_rgba(200,170,110,0.1)]">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-arcane-gold hover:text-white text-xl"
                >
                    ✕ CLOSE CASE FILE
                </button>

                <h1 className="text-3xl text-arcane-gold font-serif mb-8 border-b border-arcane-gold/30 pb-4">
                    EVIDENCE BOARD
                </h1>

                <div className="grid grid-cols-2 gap-8">
                    {/* Suspects */}
                    <div>
                        <h2 className="text-xl text-arcane-teal mb-4 uppercase tracking-widest">Suspects</h2>
                        <div className="space-y-4">
                            {suspects.map(suspect => (
                                <div key={suspect.id} className="bg-black/40 p-4 border border-arcane-gold/30 flex items-start gap-4">
                                    <div className="w-16 h-16 bg-gray-800 border border-gray-600 shrink-0">
                                        {/* Placeholder Portrait */}
                                        <div className="w-full h-full" style={{ backgroundColor: suspect.color }}></div>
                                    </div>
                                    <div>
                                        <h3 className="text-arcane-gold font-bold">{suspect.name}</h3>
                                        <p className="text-sm text-gray-400 italic">{suspect.role}</p>
                                        <p className="text-xs text-gray-500 mt-2">{suspect.traits}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Clues */}
                    <div>
                        <h2 className="text-xl text-arcane-teal mb-4 uppercase tracking-widest">Clues Found</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {clues.length === 0 && <p className="text-gray-500 italic">No clues found yet...</p>}
                            {clues.map(clue => (
                                <div key={clue.id} className="bg-black/40 p-4 border border-arcane-gold/30">
                                    <h3 className="text-white font-bold text-sm">{clue.description}</h3>
                                    <p className="text-xs text-gray-400 mt-1">Location: {clue.location}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
