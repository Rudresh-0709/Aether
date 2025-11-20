import { useState } from 'react';

export function useEvidenceTracker() {
    const [knownClues, setKnownClues] = useState([]);
    const [suspectStatus, setSuspectStatus] = useState({}); // { id: "Suspicious" | "Cleared" }

    const addClue = (clue) => {
        if (!knownClues.find(c => c.id === clue.id)) {
            setKnownClues(prev => [...prev, clue]);
        }
    };

    const updateSuspectStatus = (suspectId, status) => {
        setSuspectStatus(prev => ({
            ...prev,
            [suspectId]: status
        }));
    };

    return {
        knownClues,
        suspectStatus,
        addClue,
        updateSuspectStatus
    };
}
