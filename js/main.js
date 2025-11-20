import { GameEngine } from './engine.js';

window.addEventListener('DOMContentLoaded', () => {
    console.log('AETHER NOIR: Initializing...');
    
    const canvas = document.getElementById('game-canvas');
    const engine = new GameEngine(canvas);
    
    engine.start();
});
