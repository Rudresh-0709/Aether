export class Entity {
    constructor(x, y, color = '#fff') {
        this.x = x;
        this.y = y;
        this.size = 32;
        this.color = color;
        this.isSolid = true;
    }

    update(dt) {
        // Base update logic
    }

    render(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
}

export class Player extends Entity {
    constructor(x, y, name, role) {
        super(x, y, '#00ffcc'); // Neon Teal for player
        this.name = name;
        this.role = role; // 'Enforcer', 'ChemBaron', 'Aristocrat', 'Drifter'
        this.speed = 200;
        this.inventory = [];
    }

    move(dx, dy, dt) {
        this.x += dx * this.speed * dt;
        this.y += dy * this.speed * dt;
    }

    interact(target) {
        console.log(`${this.name} (${this.role}) interacts with`, target);
        // Base interaction logic
    }
}

// --- Specific Classes ---

export class Enforcer extends Player {
    constructor(x, y, name) {
        super(x, y, name, 'Enforcer');
        this.strength = 10;
        this.color = '#ff4444'; // Reddish for strength
    }

    interact(target) {
        if (target.type === 'LockedDoor') {
            console.log('Enforcer smashes the door!');
            return true; // Interaction successful
        }
        return super.interact(target);
    }

    getDialogueOption() {
        return "Threaten";
    }
}

export class ChemBaron extends Player {
    constructor(x, y, name) {
        super(x, y, name, 'ChemBaron');
        this.intellect = 10;
        this.color = '#44ff44'; // Greenish for chem
    }

    interact(target) {
        if (target.type === 'ChemicalClue') {
            console.log('Chem-Baron analyzes the substance.');
            return true;
        }
        return super.interact(target);
    }
}

export class Aristocrat extends Player {
    constructor(x, y, name) {
        super(x, y, name, 'Aristocrat');
        this.charisma = 10;
        this.color = '#c8aa6e'; // Gold for wealth
    }

    interact(target) {
        if (target.type === 'VIPArea') {
            console.log('Aristocrat flashes their badge/money.');
            return true;
        }
        return super.interact(target);
    }

    getDialogueOption() {
        return "Bribe";
    }
}

export class Drifter extends Player {
    constructor(x, y, name) {
        super(x, y, name, 'Drifter');
        this.instinct = 10;
        this.color = '#aa44ff'; // Violet for mystery
    }

    // Special ability: Heartbeat monitor (visual feedback)
    detectLies(npc) {
        if (npc.isLying) {
            console.log('Drifter detects a spike in heartbeat.');
            return true;
        }
        return false;
    }
}
