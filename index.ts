import { LogBase, LogEntry, LogRound, Ship, SHIPS } from './data';

const dice = () => Math.floor(Math.random() * 10) + 1;

let dreadnought = SHIPS.dreadnought;
let destroyer = SHIPS.destroyer;
let player1 = [dreadnought, dreadnought];
let player2 = [dreadnought, destroyer];
let logs: LogBase[] = [];

while (
    player1.map((player) => player.alive).every((v) => !v) &&
    player2.map((player) => player.alive).every((v) => !v)
) {
    let hits = [0, 0];

    [player1, player2].map((player, i) =>
        player
            .map<boolean>((ship) => {
                let hit = dice();
                logs.push(new LogEntry(ship, hit, i));
                return ship.combat <= hit;
            })
            .forEach((hit) => (hits[i] += +hit))
    );

    player1.splice(player1.length - hits[1] - 1, hits[1]);
    player2.splice(player2.length - hits[0] - 1, hits[0]);
    logs.push(new LogRound());
}

console.log(logs);
console.log(
    player1.map((s) => s.name),
    player2.map((s) => s.name)
);
