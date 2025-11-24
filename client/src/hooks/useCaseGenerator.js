import { useState, useEffect } from 'react';

// Mock LLM Response
const MOCK_CASE_DATA = {
  room: {
    width: 10,
    depth: 10,
    walls: [
      { x: -5, z: 0, width: 0.5, depth: 10, height: 3 }, // Left
      { x: 5, z: 0, width: 0.5, depth: 10, height: 3 },  // Right
      { x: 0, z: -5, width: 10, depth: 0.5, height: 3 }, // Back
    ],
    furniture: [
      { id: 'desk', type: 'box', x: 0, z: -3, width: 2, depth: 1, height: 1, color: '#4a3b2a' },
      { id: 'safe', type: 'box', x: 4, z: -4, width: 1, depth: 1, height: 1.5, color: '#333' },
    ]
  },
  npcs: [
    { id: 'suspect1', name: 'Baroness Vane', x: 2, z: -2, color: '#ff00ff', role: 'Killer' },
    { id: 'suspect2', name: 'Doctor Thorne', x: -2, z: -1, color: '#00ffff', role: 'Innocent' }
  ]
};

export function useCaseGenerator() {
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API latency
    const timer = setTimeout(() => {
      setCaseData(MOCK_CASE_DATA);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return { caseData, loading };
}
