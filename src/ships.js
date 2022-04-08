import './index.js';
import './placeShip.js';

class Ship {
    constructor(size) {
        this.size = size;
        this.id = Ship.count();
        this.hp = size;
        this.startHp = size;
    }

    static count() {
        if (!this.id)
            this.id = 1;
        else
            this.id++;
        return this.id;
    }

}

const setShips = [];
const setShips2 = [];
let ships;
for (let i = 0; i < 2; i++) {
    if (i === 0) {
        ships = setShips;
    } else
        ships = setShips2

    ships.push(new Ship(4));
    ships.push(new Ship(3));
    ships.push(new Ship(3));
    ships.push(new Ship(2));
    ships.push(new Ship(2));
    ships.push(new Ship(2));
    ships.push(new Ship(1));
    ships.push(new Ship(1));
    ships.push(new Ship(1));
    ships.push(new Ship(1));

}


export {setShips, setShips2};
