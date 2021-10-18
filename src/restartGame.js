import './index.js';
import {setShips, setShips2} from './ships.js';
import placeShip from "./placeShip";

export default function restartGame() {
    this.setState({
        isFinished: true,
    });
    this.setState( state => {
        const newFieldToBuild = [...state.fieldToBuild];
        const newPlayerField = [...state.playerField];
        const newPrioritize = [...state.prioritize];
        const newEnemyShips = [...setShips];
        const newPlayerShips = [...setShips2];
        const newIsFinished = false;
        const newIsPlayerTurn = true;
        const newLogs = ['Waiting'];


        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                newFieldToBuild[i][j] = {
                    x: j,
                    y: i,
                    status: "free",
                    isShipDestroyed: false,
                    shot: false,
                    isShipVisible: false,
                    shipId: undefined,
                };
                newPlayerField[i][j] = {
                    x: j,
                    y: i,
                    status: "free",
                    isShipDestroyed: false,
                    shot: false,
                    isShipVisible: false,
                    shipId: undefined,
                };
                newPrioritize[i][j] = {
                    x: j,
                    y: i,
                    points: 5,
                };
            }
        }


        newEnemyShips.forEach(ship => {
            ship.hp = ship.startHp;
            ship.startSquare = undefined;
            placeShip(this.state.fieldToBuild, ship)

        });

        newPlayerShips.forEach(ship => {
            ship.hp = ship.startHp;
            ship.startSquare = undefined;
            placeShip(this.state.playerField, ship)

        });
        return {
            fieldToBuild: newFieldToBuild,
            playerField: newPlayerField,
            prioritize: newPrioritize,
            enemyShips: newEnemyShips,
            playerShips: newPlayerShips,
            isPlayerTurn: newIsPlayerTurn,
            isFinished: newIsFinished,
            logs: newLogs,
        }
    });
}