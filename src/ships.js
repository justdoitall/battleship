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

setShips2.push(new Ship(4));
setShips2.push(new Ship(3));
setShips2.push(new Ship(3));
setShips2.push(new Ship(2));
setShips2.push(new Ship(2));
setShips2.push(new Ship(2));
setShips2.push(new Ship(1));
setShips2.push(new Ship(1));
setShips2.push(new Ship(1));
setShips2.push(new Ship(1));




export {setShips, setShips2};
