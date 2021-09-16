export default (field, ship) => {
    buildShip(field, ship);
}

function randomStartSquare(field, ship) {
    let x = Math.trunc(Math.random() * 10);
    let y = Math.trunc(Math.random() * 10);
    /*alert("rSS " + x + " " + y + " " + ship.direction + " " + ship.id);*/
    /*if ((field[y][x].status !== "free") || ((x - 1 + ship.size > 9) && (ship.direction === "horizontal")) || ((y - 1 + ship.size > 9) && (ship.direction === "vertical")))
        randomStartSquare(field, ship);*/
    if (field[y][x].status !== "free") {
        /*alert("field contains ship");*/
        randomStartSquare(field, ship);
    }
    else if ((x - 1 + ship.size > 9) && (ship.direction === "horizontal")) {
        /*alert("too much x");*/
        randomStartSquare(field, ship);
    }
    else if ((y - 1 + ship.size > 9) && (ship.direction === "vertical")) {
        /*alert("too much y");*/
        randomStartSquare(field, ship);
    }

    else {
        /*alert("all right rSS " + ship.id);*/
        ship.startSquare = {x, y}
    }
}

function randomDirection(ship) {
    let isDirection = Math.trunc(Math.random() * 2);
    if (isDirection === 1)
        ship.direction = "vertical";
    else
        ship.direction = "horizontal";
}

function buildShip(field, ship) {
    randomDirection(ship);
    randomStartSquare(field, ship);
    let niceShip = true;
    /*alert("bS " + ship.startSquare.x + " " + ship.startSquare.y + " " + ship.direction + " " + ship.id);*/

    if (ship.direction === "horizontal") {
        for (let i = ship.startSquare.x; i < ship.startSquare.x + ship.size; i++) {
            if (field[ship.startSquare.y][i].status !== "free") {
                niceShip = false;
                break;
            }
        }
        if (niceShip === true) {
            for (let i = ship.startSquare.x; i < ship.startSquare.x + ship.size; i++) {
                field[ship.startSquare.y][i].status = "ship";
                field[ship.startSquare.y][i].shipId = ship.id;
            }
        }
        else {
            buildShip(field, ship);
        }
    }
    else if (ship.direction === "vertical") {

        for (let i = ship.startSquare.y; i < ship.startSquare.y + ship.size; i++) {
            if (field[i][ship.startSquare.x].status !== "free") {
                niceShip = false;
                break;
            }
        }
        if (niceShip === true) {
            for (let i = ship.startSquare.y; i < ship.startSquare.y + ship.size; i++) {
                field[i][ship.startSquare.x].status = "ship";
                field[i][ship.startSquare.x].shipId = ship.id;
            }
        }
        else {
            buildShip(field, ship);
        }
    }
    else {
        alert("mistake");
    }

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            if (field[j][i].shipId === ship.id) {
                for (let k = field[j][i].x - 1; k <= field[j][i].x + 1; k++) {
                    for (let n = field[j][i].y - 1; n <= field[j][i].y + 1; n++) {
                        if ((k < 0) || (k > 9))
                            continue;
                        if ((n < 0) || (n > 9))
                            continue;
                        if (field[n][k].status === "free") {
                            field[n][k].status = "not free";
                        }
                            }
                }
            }

        }
    }

    /*alert("all right bS " + ship.id);*/

}