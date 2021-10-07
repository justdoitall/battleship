import React from 'react';
import ReactDOM from 'react-dom';
import placeShip from './placeShip';
import './index.css';
import ships from './ships.js';
import ships2 from './ships2.js';
import restartGame from './restartGame.js';

function Square(props) {
    const { status, shot, isShipVisible, isShipDestroyed, affiliation } = props;

    let marker;
    if (status === "ship") {
        if (shot)
            marker = 'X';
        else
            marker = ""
    } else {
        if (shot)
            marker = '·';
        else
            marker = "";
    }
    return (
        <button className={`square ${isShipDestroyed ? 'destroyedShip' : ''} ${status === "ship" && !isShipVisible && affiliation === "player" ? 'undamagedShip' : ''} ${status === "ship" && isShipVisible ? 'visibleShip' : ''}`} onClick={props.onClick}>
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
                        isShipDestroyed={square.isShipDestroyed}
                        affiliation = {props.affiliation}
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
                if (props.affiliation === "computer") {
                return (
                    <FieldRow
                        key={index}
                        row={row}
                        affiliation = "computer"
                        onClick={(y, x) => props.onClick(y, x)}
                    />
                )} else {
                    return (
                        <FieldRow
                            key={index}
                            row={row}
                            affiliation = "player"
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
            <ul className="gamelog-list">
                {props.logs.map((item, index) => {
                    if (index > props.logs.length - 6) {
                        return (
                            <li>{`${(index === 0) ? '' : String(index) + '.'} ${item}`}</li>
                        )
                    }
                })}
            </ul>
        </div>
    )
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fieldToBuild: [],
            playerField: [],
            prioritize: [],
            enemyShips: [...ships],
            playerShips: [...ships2],
            isFinished: false,
            logs: ['Waiting'],
            isPlayerTurn: true,
            value: props.name,
            isNameAdded: false,
        };
        // делаем массивы двумерными и заполняем стартовыми данными
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
                    points: 5,
                };
            }
        }
        //расставляем корабли
        this.state.enemyShips.forEach(ship => {
            placeShip(this.state.fieldToBuild, ship)
        });

        this.state.playerShips.forEach(ship => {
            placeShip(this.state.playerField, ship)
        });

    }

    handleClick(y, x) {
        if (this.state.isFinished) {
            return
        }
        if (this.state.isPlayerTurn) {
             if (this.state.fieldToBuild[y][x].shot) {
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
                    // если хп больше нуля, то это попадание
                    // если хп ноль, то корабль уничтожен
                    if (hittedShip.hp > 0) {
                        newLogs.push('Shot');
                    } else {
                        newLogs.push('Ship destroyed');
                        for (let i = 0; i < 10; i++) {
                            for (let j = 0; j < 10; j++) {
                              if (newField[j][i].shipId === hittedShip.id) {
                                  newField[j][i].isShipDestroyed = true;
                              }
                            }
                        }
                    }

                    if (newShips.every(ship => (ship.hp === 0))) {
                        newLogs.push('Game finished');
                        isFinished = true;
                    }
                    // если промах, то передаем ход
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

    async computerTurn() {
        if (this.state.isFinished) {
            return
        }
        if (!this.state.isPlayerTurn) {
            await this.timeout();
            this.setState(state => {
                const newField = [...state.playerField];
                const newShips = [...state.playerShips];
                const newLogs = [...state.logs];
                const newPrioritize = [...state.prioritize];
                let isPlayerTurn = false;
                let isFinished = false;
                // вызов функции, которая оценивает все поля на данный момент по балльной системе
                // и возвращает поле с наивысшими баллами либо одно из таких рандомно, если их несколько
                let shotSquare = this.setPrioritize(newField, newPrioritize);
                shotSquare.shot = true;
                shotSquare.isShipVisible = true;
                let k = shotSquare.y;
                let n = shotSquare.x;
                if (shotSquare.status === "ship") {
                    const hittedShip = newShips.find(ship => (ship.id === shotSquare.shipId));
                    hittedShip.hp--;
                    if (hittedShip.hp > 0) {
                        newLogs.push('Shot');
                        // здесь и дальше небольшие функции, задающие баллы конкретным полям в зависимости от
                        // происходящих событий
                        if (hittedShip.startHp - hittedShip.hp === 1) {
                            this.highPrioritizeSquare(k - 1, n, newPrioritize);
                            this.highPrioritizeSquare(k + 1, n, newPrioritize);
                            this.highPrioritizeSquare(k, n - 1, newPrioritize);
                            this.highPrioritizeSquare(k, n + 1, newPrioritize);
                        } else {
                            if (hittedShip.direction === "vertical") {
                                for (let i = 0; i < 10; i++) {
                                    for (let j = 0; j < 10; j++) {
                                        if ((newField[j][i].shipId === hittedShip.id) && (newField[j][i].shot)) {
                                            this.higherPrioritizeSquare(newField[j][i].y - 1, newField[j][i].x, newPrioritize);
                                            this.higherPrioritizeSquare(newField[j][i].y + 1, newField[j][i].x, newPrioritize);
                                        }

                                    }
                                }
                            } else {
                                for (let i = 0; i < 10; i++) {
                                    for (let j = 0; j < 10; j++) {
                                        if ((newField[j][i].shipId === hittedShip.id) && (newField[j][i].shot)) {
                                            this.higherPrioritizeSquare(newField[j][i].y, newField[j][i].x + 1, newPrioritize);
                                            this.higherPrioritizeSquare(newField[j][i].y, newField[j][i].x - 1, newPrioritize);
                                        }

                                    }
                                }
                            }

                        }

                    } else {
                        newLogs.push('Ship destroyed');
                        for (let i = 0; i < 10; i++) {
                            for (let j = 0; j < 10; j++) {
                                // для каждой клетки, имеющей айдишник такой же, как у уничтоженного корабля,
                                // пройтись по ним и всем соседям и задать им количество очков, равное 0,
                                // убрав их из расчетов поля для выстрела
                                if (newField[j][i].shipId === hittedShip.id) {
                                    newField[j][i].isShipDestroyed = true;
                                    for (let k = newField[j][i].x - 1; k <= newField[j][i].x + 1; k++) {
                                        for (let n = newField[j][i].y - 1; n <= newField[j][i].y + 1; n++) {
                                            if ((k < 0) || (k > 9))
                                                continue;
                                            if ((n < 0) || (n > 9))
                                                continue;
                                            if (newPrioritize[n][k].points !== 0) {
                                                newPrioritize[n][k].points = 0;
                                            }
                                        }
                                    }
                                }

                            }
                        }
                    }

                    if (newShips.every(ship => (ship.hp === 0))) {
                        newLogs.push('Game finished');
                        isFinished = true;
                    }
                } else {
                    // шахматный порядок стрельбы, если нет других факторов
                    newLogs.push('Miss');
                    isPlayerTurn = true;
                    this.lowPrioritizeSquare(k - 1, n, newPrioritize);
                    this.lowPrioritizeSquare(k + 1, n, newPrioritize);
                    this.lowPrioritizeSquare(k, n - 1, newPrioritize);
                    this.lowPrioritizeSquare(k, n + 1, newPrioritize);
                }
                return {
                    playerField: newField,
                    playerShips: newShips,
                    isFinished: isFinished,
                    logs: newLogs,
                    isPlayerTurn: isPlayerTurn,
                    prioritize: newPrioritize,
                }
            })
        }
    }

    highPrioritizeSquare(k, n, newPrioritize) {
        if (((k < 0) || (k > 9)) || ((n < 0) || (n > 9))) {
            return;
        }
        if (newPrioritize[k][n].points !== 0) {
            newPrioritize[k][n].points = 10;
        }
    }

    higherPrioritizeSquare(k, n, newPrioritize) {
        if (((k < 0) || (k > 9)) || ((n < 0) || (n > 9))) {
            return;
        }
        if (newPrioritize[k][n].points !== 0) {
            newPrioritize[k][n].points = 20;
        }
    }

    lowPrioritizeSquare(k, n, newPrioritize) {
        if (((k < 0) || (k > 9)) || ((n < 0) || (n > 9))) {
            return;
        }
        if (newPrioritize[k][n].points !== 0) {
            newPrioritize[k][n].points--;
        }
    }

    setPrioritize(newField, newPrioritize) {
        let highestPrioritize = 1;
        let highestPrioritizeArray = [];
        let x;
        let y;
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                if (highestPrioritize < newPrioritize[i][j].points) {
                    highestPrioritize = newPrioritize[i][j].points
                }
            }
        }
            for (let i = 0; i < 10; i++) {
                for (let j = 0; j < 10; j++) {
                    if (highestPrioritize === newPrioritize[i][j].points) {
                        highestPrioritizeArray.push(newPrioritize[i][j]);
                    }
                }
            }
            let random = Math.trunc(Math.random() * highestPrioritizeArray.length);
             x = highestPrioritizeArray[random].x;
             y = highestPrioritizeArray[random].y;

        newPrioritize[y][x].points = 0;
        return newField[y][x];

    }

    timeout() {
        return new Promise( res => setTimeout(res, 300) );
    }




    render() {
        this.computerTurn(this.state.playerField, this.state.playerShips);
        let text = this.state.isPlayerTurn ? "Ход " + this.state.value : "Ход компьютера:";
        return (
            <div className="game">
                {<div className="game-board">
                    <Board
                        affiliation = 'player'
                        board = {this.state.playerField}
                    />
                </div>}
                <div className="board-opponent">
                    <Board
                        affiliation = 'computer'
                        board = {this.state.fieldToBuild}
                        onClick = {(y, x) => this.handleClick(y, x)}
                    />
                </div>
                <div className="game-info">
                    {<div className="game-info-name">{text}</div>}
                    <GameLog logs={this.state.logs} />
                </div>
                <button className="button" onClick={ restartGame.bind(this) }>
                    <span>Reload</span>
                </button>
            </div>
        );
    }
}


class Start extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isNameAdded: false,
            value: "",
        };
        this.onNameChangeHandler = this.onNameChangeHandler.bind(this);
    }

    onNameChangeHandler(event) {
        if (!this.state.isNameAdded) {
            this.setState({
                value: event.target.value
            });
        }
    }

    buttonClick() {
        this.setState({
            isButtonPressed: true
        });
    }

    render() {
        if (this.state.isButtonPressed) {
            return <Game name={this.state.value} />;
        } else
            return (
                <div>
                    <div className="battleship">
                        Welcome to Battleship
                    </div>
                    <form className="name">
                        <label>Player Name:
                            <input className="form" type="text"
                                   value={this.state.value}
                                   placeholder="enter player name"
                                   onChange={this.onNameChangeHandler}/>
                        </label>
                    </form>
                    <button className="buttonPlay" onClick={this.buttonClick.bind(this)}>
                        Play
                    </button>
                </div>
            );
    }


}

// ========================================

ReactDOM.render(
    <Start />,
    document.getElementById('root')
);
