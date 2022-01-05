import { readFileSync } from 'fs';

const baseStats = JSON.parse(readFileSync('./baseStats.json').toString());

export class Player {
    public ships: Ship[];
}

export class Ship {
    public alive: boolean = true;
    public cost: number;
    public combat: number;
    public move: number;
    public capacity: number;

    private _upgraded = false;

    constructor(public readonly name: ShipType, public readonly faction: any) {
        let stats = baseStats[name.toString().toLowerCase()];
        this.cost = stats.cost;
        this.combat = stats.combat;
        this.move = stats.move;
        this.capacity = stats.capacity;
    }

    public upgrade() {
        if (this._upgraded) return;
        switch (this.name) {
            case ShipType.CARRIER: {
                this.move += 1;
                this.capacity += 2;
                break;
            }
            case ShipType.CRUISER: {
                this.combat -= 1;
                this.move += 1;
                this.capacity += 1;
                break;
            }
            case ShipType.DESTROYER: {
                this.combat -= 1;
                break;
            }
            case ShipType.DREADNOUGHT: {
                this.move += 1;
                break;
            }
            case ShipType.FIGHTER: {
                this.combat -= 1;
                this.move += 2;
                break;
            }
            case ShipType.WAR_SUN: {
                this.cost = 12;
                this.combat = 3;
                this.move = 2;
                this.capacity = 6;
                break;
            }
            default: {
                throw new Error('Unknown ship type');
            }
        }
        this._upgraded = true;
    }

    get upgraded(): boolean {
        return this._upgraded;
    }
}

export enum LogType {
    ENTRY,
    ROUND,
}

export enum ShipType {
    CARRIER,
    CRUISER,
    DESTROYER,
    DREADNOUGHT,
    FIGHTER,
    FLAGSHIP,
    WAR_SUN,
}

export enum TechnologyType {
    BIOTIC,
    PROPULSION,
    CYBERNETIC,
    WARFARE,
}

export interface LogBase {
    type: LogType;
}

export class LogEntry implements LogBase {
    public type: LogType = LogType.ENTRY;
    public name: ShipType;
    public combat: number;

    constructor(attacker: Ship, public rolled: number, public player: number) {
        this.name = attacker.name;
        this.combat = attacker.combat;
    }

    get hit(): boolean {
        return this.combat <= this.rolled;
    }
}

export class LogRound implements LogBase {
    public type = LogType.ROUND;
}

export const SHIPS = {
    carrier: new Ship(ShipType.CARRIER, 3),
    cruiser: new Ship(ShipType.CRUISER, 2),
    destroyer: new Ship(ShipType.DESTROYER, 1),
    dreadnought: new Ship(ShipType.DREADNOUGHT, 4),
    fighter: new Ship(ShipType.FIGHTER, 0.5),
    war_sun: new Ship(ShipType.WAR_SUN, 0),
};
