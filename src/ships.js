import './index.js';
import './placeShip.js';

class Ship {
    constructor(size) {
        this.size = size;
        this.id = Ship.count();
        this.hp = size;
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


setShips.push(new Ship(4));
setShips.push(new Ship(3));
setShips.push(new Ship(3));
setShips.push(new Ship(2));
setShips.push(new Ship(2));
setShips.push(new Ship(2));
setShips.push(new Ship(1));
setShips.push(new Ship(1));
setShips.push(new Ship(1));
setShips.push(new Ship(1));



export default setShips;