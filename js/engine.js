export class GameEngine {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.isRunning = false;
        this.lastTime = 0;
        
        // Resize handling
        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Game State
        this.entities = [];
        this.player = null;
        
        // Input State
        this.keys = {};
        window.addEventListener('keydown', (e) => this.keys[e.code] = true);
        window.addEventListener('keyup', (e) => this.keys[e.code] = false);
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.lastTime = performance.now();
            requestAnimationFrame((t) => this.loop(t));
            console.log('AETHER NOIR: Engine started.');
        }
    }

    stop() {
        this.isRunning = false;
    }

    loop(timestamp) {
        if (!this.isRunning) return;

        const deltaTime = (timestamp - this.lastTime) / 1000; // Seconds
        this.lastTime = timestamp;

        this.update(deltaTime);
        this.render();

        requestAnimationFrame((t) => this.loop(t));
    }

    update(dt) {
        // Update logic here
        // Example: Player movement
        // if (this.keys['ArrowUp']) ...
    }

    render() {
        // Clear screen
        this.ctx.fillStyle = '#1a1c29'; // Background color
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw Grid (Placeholder for world)
        this.drawGrid();

        // Draw Entities
        // this.entities.forEach(e => e.render(this.ctx));
        
        // Debug Text
        this.ctx.fillStyle = '#c8aa6e';
        this.ctx.font = '20px Cinzel';
        this.ctx.fillText('AETHER NOIR - PROTOTYPE', 20, 40);
    }

    drawGrid() {
        this.ctx.strokeStyle = 'rgba(200, 170, 110, 0.1)'; // Faint gold
        this.ctx.lineWidth = 1;
        const gridSize = 50;
        
        for (let x = 0; x < this.canvas.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        for (let y = 0; y < this.canvas.height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }
}
