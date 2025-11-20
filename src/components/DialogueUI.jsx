import React, { useState, useEffect } from 'react';
import { useNPCMemory } from '../hooks/useNPCMemory';
import { INTENTS, INTENT_LABELS, TONES } from '../constants/intents';

export default function DialogueUI({ npc, knownClues, onClose }) {
    const { chat, isTyping } = useNPCMemory(npc);
    const [messages, setMessages] = useState([
        { sender: 'System', text: `You are speaking with ${npc.name}.` }
    ]);

    // Selection State
    const [selectedIntent, setSelectedIntent] = useState(INTENTS.ASK_ALIBI);
    const [selectedTone, setSelectedTone] = useState(TONES.NEUTRAL);
    const [selectedClueId, setSelectedClueId] = useState('');

    const handleSpeak = async () => {
        if (isTyping) return;

        // Construct Interaction Object
        const interaction = {
            intent: selectedIntent,
            tone: selectedTone,
            targetClueId: selectedClueId,
            npcName: npc.name
        };

        // Optimistic UI Update
        let playerText = `[${selectedTone}] ${INTENT_LABELS[selectedIntent]}`;
        if (selectedClueId) {
            const clue = knownClues.find(c => c.id === selectedClueId);
            if (clue) playerText += ` (${clue.description})`;
        }

        setMessages(prev => [...prev, { sender: 'You', text: playerText }]);

        // Call LLM
        const response = await chat(interaction);
        setMessages(prev => [...prev, { sender: npc.name, text: response }]);
    };

    // Filter intents based on context (e.g. only show "Ask about Clue" if clues exist)
    const availableIntents = Object.values(INTENTS).filter(intent => {
        if (intent === INTENTS.ASK_CLUE || intent === INTENTS.CONFRONT) {
            return knownClues && knownClues.length > 0;
        }
        return true;
    });

    return (
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-3xl p-4 pointer-events-auto">
            <div className="bg-arcane-bg/95 border border-arcane-gold p-6 rounded-lg shadow-[0_0_30px_rgba(200,170,110,0.3)] relative backdrop-blur-sm">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-arcane-gold hover:text-white transition-colors"
                >
                    ✕
                </button>

                {/* Chat History */}
                <div className="h-64 overflow-y-auto mb-6 space-y-3 pr-2 custom-scrollbar">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`text-sm p-2 rounded ${msg.sender === 'You' ? 'bg-arcane-teal/10 border-l-2 border-arcane-teal ml-12' : 'bg-arcane-gold/10 border-l-2 border-arcane-gold mr-12'}`}>
                            <span className={`font-bold text-xs uppercase block mb-1 ${msg.sender === 'You' ? 'text-arcane-teal' : 'text-arcane-gold'}`}>
                                {msg.sender}
                            </span>
                            <span className="font-serif text-gray-200 leading-relaxed">{msg.text}</span>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="text-arcane-gold text-left text-xs italic animate-pulse">
                            {npc.name} is thinking...
                        </div>
                    )}
                </div>

                {/* Detective Controls */}
                <div className="grid grid-cols-12 gap-4 items-end border-t border-arcane-gold/30 pt-4">

                    {/* Intent Selector */}
                    <div className="col-span-4">
                        <label className="block text-xs text-arcane-gold uppercase tracking-widest mb-1">Intent</label>
                        <select
                            value={selectedIntent}
                            onChange={(e) => setSelectedIntent(e.target.value)}
                            className="w-full bg-black/50 border border-arcane-gold/50 rounded px-2 py-2 text-white text-sm focus:border-arcane-teal outline-none font-serif"
                        >
                            {availableIntents.map(intent => (
                                <option key={intent} value={intent}>{INTENT_LABELS[intent]}</option>
                            ))}
                        </select>
                    </div>

                    {/* Clue Selector (Conditional) */}
                    {(selectedIntent === INTENTS.ASK_CLUE || selectedIntent === INTENTS.CONFRONT) && (
                        <div className="col-span-3">
                            <label className="block text-xs text-arcane-gold uppercase tracking-widest mb-1">Evidence</label>
                            <select
                                value={selectedClueId}
                                onChange={(e) => setSelectedClueId(e.target.value)}
                                className="w-full bg-black/50 border border-arcane-gold/50 rounded px-2 py-2 text-white text-sm focus:border-arcane-teal outline-none font-serif"
                            >
                                <option value="">Select Clue...</option>
                                {knownClues.map(clue => (
                                    <option key={clue.id} value={clue.id}>{clue.description}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Tone Selector */}
                    <div className="col-span-3">
                        <label className="block text-xs text-arcane-gold uppercase tracking-widest mb-1">Tone</label>
                        <select
                            value={selectedTone}
                            onChange={(e) => setSelectedTone(e.target.value)}
                            className="w-full bg-black/50 border border-arcane-gold/50 rounded px-2 py-2 text-white text-sm focus:border-arcane-teal outline-none font-serif"
                        >
                            {Object.values(TONES).map(tone => (
                                <option key={tone} value={tone}>{tone}</option>
                            ))}
                        </select>
                    </div>

                    {/* Action Button */}
                    <div className="col-span-2">
                        <button
                            onClick={handleSpeak}
                            disabled={isTyping || ((selectedIntent === INTENTS.ASK_CLUE || selectedIntent === INTENTS.CONFRONT) && !selectedClueId)}
                            className="w-full bg-arcane-gold text-arcane-bg font-bold py-2 rounded hover:bg-white transition-colors uppercase text-xs tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Interrogate
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
