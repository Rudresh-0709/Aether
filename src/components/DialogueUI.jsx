import React, { useState, useEffect } from 'react';
import { useNPCMemory } from '../hooks/useNPCMemory';

export default function DialogueUI({ npc, onClose }) {
    const { chat, isTyping } = useNPCMemory(npc);
    const [messages, setMessages] = useState([
        { sender: 'System', text: `You are speaking with ${npc.name}.` }
    ]);
    const [input, setInput] = useState('');

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isTyping) return;

        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { sender: 'You', text: userMsg }]);

        const response = await chat(userMsg);
        setMessages(prev => [...prev, { sender: npc.name, text: response }]);
    };

    return (
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-2xl p-4 pointer-events-auto">
            <div className="bg-arcane-bg/90 border border-arcane-gold p-4 rounded-lg shadow-[0_0_20px_rgba(200,170,110,0.2)] relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-arcane-gold hover:text-white"
                >
                    ✕
                </button>

                {/* Chat History */}
                <div className="h-48 overflow-y-auto mb-4 space-y-2 pr-2">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`text-sm ${msg.sender === 'You' ? 'text-arcane-teal text-right' : 'text-arcane-gold text-left'}`}>
                            <span className="font-bold opacity-70 text-xs uppercase block">{msg.sender}</span>
                            <span className="font-serif">{msg.text}</span>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="text-arcane-gold text-left text-xs italic animate-pulse">
                            {npc.name} is thinking...
                        </div>
                    )}
                </div>

                {/* Input */}
                <form onSubmit={handleSend} className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask a question..."
                        disabled={isTyping}
                        className="flex-1 bg-black/50 border border-arcane-gold/50 rounded px-3 py-2 text-white focus:outline-none focus:border-arcane-teal transition-colors font-serif disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={isTyping}
                        className="bg-arcane-gold/20 border border-arcane-gold text-arcane-gold px-4 py-2 rounded hover:bg-arcane-gold hover:text-arcane-bg transition-all uppercase text-xs font-bold tracking-wider disabled:opacity-50"
                    >
                        Speak
                    </button>
                </form>
            </div>
        </div>
    );
}
