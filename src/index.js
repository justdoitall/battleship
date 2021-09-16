import React from 'react';
import ReactDOM from 'react-dom';
import placeShip from './placeShip';
import './index.css';
import ships from './ships.js';

function Square(props) {
    const { status, shot, isShipVisible } = props;

    let marker;
    if (status === "ship") {
        if (shot)
            marker = 'X';
        else
            marker = ""
    } /*else if (status === "not free") {
            marker = '!';
    }*/ else {
        if (shot)
            marker = '·';
        else
            marker = "";
    }
    return (
        <button className={`square ${status === "ship" && isShipVisible ? 'visibleShip' : ''}`} onClick={props.onClick}>
            <div className="marker">{marker}</div>
        </button>
    )
}


function FieldRow(props) {
    return (
        <div className="field-row">
            {props.row.map((square, index) => {
                return (
                    <Square
                        key={index}
                        status={square.status}
                        shot={square.shot}
                        isShipVisible={square.isShipVisible}
                        onClick={() => props.onClick(square.y, square.x)}
                    />
                )
            })}
        </div>
    )
}

function Board(props) {
    return (
        <div>
            {props.board.map((row, index) => {
                if (props.affilation === "computer") {
                return (
                    <FieldRow
                        key={index}
                        row={row}
                        onClick={(y, x) => props.onClick(y, x)}
                    />
                )} else {
                    return (
                        <FieldRow
                            key={index}
                            row={row}
                            onClick={function (y, x) {
                            }}
                        />
                    )
                }
            })}
        </div>
    )
}

function GameLog(props) {
    return (
        <div className="gamelog">
            <div className="gamelog-header">Логи игры</div>
            <ul className="gamelog-list">
                {props.logs.map((item, index) => {
                    if (index === props.logs.length - 1) {
                        return (
                            <li>{`${(index === 0) ? '' : String(index) + '.'} ${item}`}</li>
                        )
                    }
                })}
            </ul>
        </div>
    )
}

function watchShips(field) {
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            alert(j + " " + i + " " + field[j][i].status);
        }
    }
}

/*function prioritize(field, ships) {
    return field[1][1];
}

function shot(prioritize1) {
    
}*/

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fieldToBuild: [],
            playerField: [],
            prioritize: [],
            enemyShips: [...ships],
            playerShips: [...ships],
            //areEnemyShipsInvisible: true,
            isFinished: false,
            logs: ['Waiting'],
            isPlayerTurn: true,
        };

        for (let i = 0; i < 10; i++) {
            this.state.fieldToBuild.push([]);
            this.state.playerField.push([]);
            this.state.prioritize.push([]);
        }

        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                this.state.fieldToBuild[i][j] = {
                    x: j,
                    y: i,
                    status: "free",
                };
                this.state.playerField[i][j] = {
                    x: j,
                    y: i,
                    status: "free",
                };
                this.state.prioritize[i][j] = {
                    x: j,
                    y: i,
                };
            }
        }

        this.state.enemyShips.forEach(ship => {
            placeShip(this.state.fieldToBuild, ship)
        });

        //watchShips(this.state.fieldToBuild);

        this.state.playerShips.forEach(ship => {
            placeShip(this.state.playerField, ship)
        });

    }

    handleClick(y, x) {
        if (this.state.isPlayerTurn) {
            if (this.state.isFinished) {
                return
            } else if (this.state.fieldToBuild[y][x].shot) {
                alert("repeat");
                return
            }

            this.setState(state => {
                const newField = [...state.fieldToBuild];
                newField[y][x].shot = true;
                newField[y][x].isShipVisible = true;

                const newShips = [...state.enemyShips];
                const newLogs = [...state.logs];
                let isFinished = false;
                let isPlayerTurn = true;

                if (newField[y][x].status === "ship") {
                    const hittedShip = newShips.find(ship => (ship.id === newField[y][x].shipId));
                    hittedShip.hp--;
                    // если хитпоинтов больше нуля, то это обычное попадание
                    // если хитпоинтов ноль, то корабль уничтожен
                    if (hittedShip.hp > 0) {
                        newLogs.push('Shot');
                    } else {
                        newLogs.push('Ship destroyed');
                    }

                    if (newShips.every(ship => (ship.hp === 0))) {
                        newLogs.push('Game finished');
                        isFinished = true;
                    }
                } else {
                    newLogs.push('Miss');
                    isPlayerTurn = false;
                }

                return {
                    fieldToBuild: newField,
                    enemyShips: newShips,
                    isFinished: isFinished,
                    logs: newLogs,
                    isPlayerTurn: isPlayerTurn,
                }
            })
        }
    }

    computerTurn(field, ships) {
        let x = Math.trunc(Math.random() * 10);
        let y = Math.trunc(Math.random() * 10);
        if(!this.state.isPlayerTurn) {
            if (field[y][x].shot !== undefined) {
                this.computerTurn(field, ships)
            }
            else {
                this.shot(field[y][x]);
                this.setState(state => {
                    let isPlayerTurn = true;
                    return {
                        isPlayerTurn: isPlayerTurn,
                    }
                })
                /*alert(this.state.isPlayerTurn);*/
            }
        }
    }

    shot(fieldElementElement) {
            fieldElementElement.shot = true;
            fieldElementElement.isShipVisible = true;
    }


    render() {
        this.computerTurn(this.state.playerField, this.state.playerShips);
        return (
            <div className="game">
                {<div className="game-board">
                    <Board
                        affilation = 'player'
                        board = {this.state.playerField}
                    />
                </div>}
                <div className="board-opponent">
                    <Board
                        affilation = 'computer'
                        board = {this.state.fieldToBuild}
                        onClick = {(y, x) => this.handleClick(y, x)}
                    />
                    {this.state.fieldToBuild[5][1].status}
                    {this.state.fieldToBuild[5][1].x}
                    {this.state.fieldToBuild[5][1].y}
                </div>
                <div className="game-info">
                    <GameLog logs={this.state.logs} />
                </div>
            </div>
        );
    }

}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
