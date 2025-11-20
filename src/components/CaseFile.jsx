import React from 'react';

export default function CaseFile({ mystery, onClose }) {
    return (
        <div className="absolute top-4 left-4 bg-black/90 border border-red-500/50 p-4 max-w-md text-xs font-mono text-red-400 pointer-events-auto z-50">
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold uppercase">Top Secret: Truth Layer</h3>
                <button onClick={onClose} className="hover:text-white">[HIDE]</button>
            </div>
            <div className="space-y-2">
                <p><span className="text-white">Victim:</span> {mystery.victim}</p>
                <p><span className="text-white">Killer:</span> {mystery.killer}</p>
                <p><span className="text-white">Motive:</span> {mystery.motive}</p>
                <p><span className="text-white">Weapon:</span> {mystery.weapon}</p>
                <div className="border-t border-red-500/30 pt-2 mt-2">
                    <p className="text-white mb-1">Timeline:</p>
                    {Object.entries(mystery.timeline).map(([time, events]) => (
                        <div key={time} className="pl-2">
                            <span className="text-gray-400">{time}:</span>
                            {Object.entries(events).map(([person, event]) => (
                                <div key={person} className="pl-2 text-gray-500">
                                    - {person}: {event}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
