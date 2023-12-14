const msgImportant = document.getElementById('msgImportant');

function createGrid(player, grid, id) {
    const gridOfDom = document.getElementById(grid);
    const letters = [' ', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

    // Création de la table et de son thead
    const playerGrid = document.createElement('div');
    playerGrid.classList.add('playerGrid');
    const playerName = document.createElement('h2');
    playerName.textContent = player.name;
    const score = document.createElement('p');
    score.textContent = `Score : ${player.score ?? 0}`;
    score.classList.add(`score`);
    score.classList.add(`score${id}`);

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const theadRow = document.createElement('tr');

    // Ajout des lettres dans le thead
    letters.forEach(letter => {
        const letterHeader = document.createElement('th');
        letterHeader.textContent = letter;
        letterHeader.classList.add('case');
        theadRow.appendChild(letterHeader);
    });
    thead.appendChild(theadRow);
    table.appendChild(thead);

    // Création du tbody avec ses lignes et colonnes
    const tbody = document.createElement('tbody');
    for (let i = 1; i <= 10; i++) {
        const row = document.createElement('tr');
        const rowNumber = document.createElement('td');
        rowNumber.textContent = i;
        rowNumber.classList.add('case');
        row.appendChild(rowNumber);

        for (let j = 0; j < letters.length - 1; j++) {
            const cell = document.createElement('td');
            cell.classList.add('cell');
            cell.classList.add('case');
            cell.classList.add(`numCell${j}`);
            row.appendChild(cell);
        }

        row.classList.add(`numRow${i - 1}`);
        tbody.appendChild(row);
    }
    playerGrid.appendChild(score)
    table.appendChild(tbody);
    gridOfDom.appendChild(playerGrid);
    playerGrid.appendChild(playerName);
    playerGrid.appendChild(table);
}

///*******

class Boat {
    constructor(name, size, letter, position, dir, isPlaced, isTouched) {
        this.name = name;
        this.size = size;
        this.letter = letter;
        this.position = position;
        this.dir = dir;
        this.isPlaced = isPlaced;
        this.isTouched = isTouched;
        // add isDead
    }

}

class Player {
    id = 0;
    name = "";
    boats = [];
    boatIsPlaced = false;
    score = 0;
    shots = [];

    constructor(id, name, score, boats, shots, boatIsPlaced) {
        this.id = id;
        this.name = name;
        this.score = score;
        this.boats = boats;
        this.shots = shots;
        this.boatIsPlaced = boatIsPlaced;
    }

    gridofPos = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 0
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 1
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 2
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 3
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 4
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 5
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 6
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 7
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 8
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 9
    ]

    placeShipsRandomly() {
        const gridLength = 10; // Taille de la grille
        const ships = this.boats; // Liste des bateaux du joueur
        // Pour chaque bateau, essayez de le placer aléatoirement dans la grille
        for (const ship of ships) {
            let placed = false;
            if (ship.isPlaced) return;

            while (!placed) {
                const isHorizontal = Math.random() < 0.5; // Direction aléatoire
                const row = Math.floor(Math.random() * gridLength);
                const col = Math.floor(Math.random() * gridLength);

                if (this.canPlaceShip(row, col, ship.size, isHorizontal)) {
                    this.placeShip(row, col, ship.size, isHorizontal, ship.letter);
                    ship.position = this.getShipPositions(row, col, ship.size, isHorizontal);
                    ship.isPlaced = true;
                    ship.dir = isHorizontal ? 'H' : 'V';
                    placed = true;
                }
            }
        }
    }

    // Vérifie si un bateau peut être placé dans une certaine direction
    canPlaceShip(row, col, size, isHorizontal) {
        const gridLength = 10; // Taille de la grille
        const endRow = isHorizontal ? row : row + size - 1;
        const endCol = isHorizontal ? col + size - 1 : col;

        // Vérifie si le bateau sort de la grille
        if (endRow >= gridLength || endCol >= gridLength) {
            return false;
        }

        // Vérifie si les cases sont déjà occupées par un autre bateau
        for (let i = row; i <= endRow; i++) {
            for (let j = col; j <= endCol; j++) {
                if (this.gridofPos[i][j] !== 0) {
                    return false;
                }
            }
        }

        return true;
    }

    // Place un bateau dans la grille du joueur
    placeShip(row, col, size, isHorizontal, letter) {
        for (let i = 0; i < size; i++) {
            if (isHorizontal) {
                this.gridofPos[row][col + i] = letter; // 1
            } else {
                this.gridofPos[row + i][col] = letter; // 1
            }
        }
    }

    // Obtient les positions occupées par un bateau
    getShipPositions(row, col, size, isHorizontal) {
        const positions = [];

        for (let i = 0; i < size; i++) {
            if (isHorizontal) {
                positions.push([row, col + i]);
            } else {
                positions.push([row + i, col]);
            }
        }
        return positions;
    }
}

// const a = new Boat('A', 5, 'A', [], '', false, false)
// const b = new Boat('B', 6, 'B', [], '', false, false)
// const c = new Boat('C', 4, 'C', [], '', false, false)
// const d = new Boat('D', 3, 'D', [], '', false, false)
// const e = new Boat('E', 4, 'E', [], '', false, false)
// const f = new Boat('F', 2, 'F', [], '', false, false)
// const r = new Player(1, 'mmm', 0, [], [], false);
// r.boats.push(a, b, c, d, e, f)
// console.log(r.placeShipsRandomly())
// console.log(r.gridofPos)
// console.log(r.boats)

function placesBoat(playerGrid, player) {
    const boat = [
        {name: "Porte-avion", size: 5, letter: 'P', position: []},
        {name: "Croiseur", size: 4, letter: 'C', position: []},
        {name: "Destroyer", size: 3, letter: 'D', position: []},
        {name: "Sous-marin", size: 3, letter: 'S', position: []},
        {name: "Torpilleur", size: 2, letter: 'T', position: []}

    ]
    const id = player.id;

    const msg = playerGrid.firstElementChild
    let position = [];
    let currentBoat = boat[0];
    const checkPosBoat = () => {
        for (let i of boat) {
            if (i.position.length !== i.size) {
                console.log(currentBoat)
                msg.textContent = `Placez le : ${i.name} il doit contenir ${i.size} cases.`;
                currentBoat = i;
                break;
            }
        }
        if (boat[4].position.length === 2) {
            msg.textContent = ` `;
            msgImportant.textContent = `Vous pouvez commencer à jouer ${player.name}`;
            player.boatIsPlaced = true;
            console.log(player)
            console.log(player.boatIsPlaced)
        }
    }
    checkPosBoat();

// TODO : j'ai ajouter des numero au class des colone et ligne pour gerer la direction H ou V à faire plus tard
    playerGrid.addEventListener('click', function (event) {
        // console.log(currentBoat.name, currentBoat.size)
        const addPosition = (posRow, posCol) => {
            cell.textContent = currentBoat.letter;
            // cell.classList.add(`boat${currentBoat.letter}${id}`);
            position.push([posRow, posCol]);
        }
        const cell = event.target;
        if (cell.classList.contains('cell')) {
            if (position.length < currentBoat.size && currentBoat.position.length < currentBoat.size) {
                if (cell.textContent === 'P' || cell.textContent === 'C' || cell.textContent === 'D' || cell.textContent === 'S' || cell.textContent === 'T') {
                    msgImportant.textContent = `Cette case est déjà prise`;
                } else {
                    let posRow = parseInt(cell.parentElement.classList[0].slice(-1)) + 1;
                    let posCol = parseInt(cell.classList[2].slice(-1)) + 1;
                    // console.log(posRow, posCol)
                    if (position.length === 0) {
                        addPosition(posRow, posCol);

                    } else if (position.length === 1) {
                        if (position[0][0] === posRow && (posCol === position[0][1] + 1 || posCol === position[0][1] - 1)) {
                            msgImportant.textContent = `Vous avez choisi horizontal`;
                            addPosition(posRow, posCol);
                            currentBoat.dir = 'horizontal';

                        } else if (position[0][1] === posCol && (posRow === position[0][0] + 1 || posRow === position[0][0] - 1)) {
                            msgImportant.textContent = `Vous avez choisi verticale`;
                            addPosition(posRow, posCol);
                            currentBoat.dir = 'vertical';

                        } else {
                            msgImportant.textContent = `Vous devez choisir une position valide`;
                        }
                    } else if (position.length > 1) {
                        if ((currentBoat.dir === 'horizontal' && posRow !== position[0][0]) || (currentBoat.dir === 'vertical' && posCol !== position[0][1])) {
                            msgImportant.textContent = `Vous devez choisir une position valide`;
                            //  TODO : gerer le cas ou on change de direction
                            // } else if (currentBoat.dir === 'horizontal' && posCol === (position[position.length - 1][1] + 1 || posCol === position[position.length - 1][1] - 1)) {
                            // } else if (currentBoat.dir === 'horizontal' && posCol === position[position.length - 1][1] + 1) {
                        } else if (currentBoat.dir === 'horizontal') {
                            addPosition(posRow, posCol);
                            // } else if (currentBoat.dir === 'vertical' && posRow === position[position.length - 1][0] + 1) {
                        } else if (currentBoat.dir === 'vertical') {
                            addPosition(posRow, posCol);
                        } else {
                            msgImportant.textContent = `Vous devez choisir une position valide`;
                        }
                    }
                }
            } else if (position.length === currentBoat.size && currentBoat.position.length === 0) {
                currentBoat.position = position;
                player.boats.push(new Boat(currentBoat.name, currentBoat.size, currentBoat.letter, currentBoat.position, currentBoat.dir, currentBoat.isPlaced, currentBoat.isTouched))
                position = [];
                checkPosBoat();
                // console.log('p', position);
            }
        }
    })
    return player.boatIsPlaced;
}

// function placesBoatRandom(grid, player){
//
// }

// TODO NE FONCTIONNE PAS
function checkWin(playerShooter, playerTarget, score) {
    let check = 0;
    let size = -1;
    playerTarget.boats.map(boat => {
        if (boat.position.includes(0)) {
            for (let i of boat.position) {
                if (i === 0) {
                    check = check + 1;
                    size = boat.size;
                    if (check === size) {
                        return check = 10;
                    }
                }
            }
        }
    })
    if (check === 10) {
        msgImportant.textContent = `Vous avez coulé un bateau`;
        playerShooter.score = playerShooter.score + 1;
        score.textContent = `Score : ${playerShooter.score}`;
    }
}

// function fin de partie
function endOfGame(player, score) {
    if (player.score === 14) {
        msgImportant.textContent = `Vous avez gagné`;
        score.textContent = `Score : ${player.score}`;
    } else {
        console.log('la partie continue')
        score.textContent = `Score : ${player.score}`;
    }
}

function shot(playerShooter, playerTarget, gridOfTargetDom) {
    let turn = 1;
    msgImportant.textContent = `C'est ${playerShooter.name} qui tire`;
    let score = document.querySelector(`.score${playerShooter.id}`);
    let stateOfShot = false;
    let letterOfCurrentBoat;
    let S = 0;
    gridOfTargetDom.addEventListener('click', function (event) {
        const cell = event.target;
        if (cell.classList.contains('cell') && turn === 1) {
            let posRow = parseInt(cell.parentElement.classList[0].slice(-1));
            let posCol = parseInt(cell.classList[2].slice(-1));
            const pos = [posRow, posCol];

            for (let i in playerTarget.gridofPos) {
                for (let j in playerTarget.gridofPos[i]) {
                    const test = [parseFloat(i), parseInt(j)]
                    if (playerTarget.gridofPos[i][j] !== 0 && (test[0] === pos[0] && test[1] === pos[1])) {
                        console.log('Touché la cible')
                        // console.log(playerTarget.gridofPos[i][j])
                        letterOfCurrentBoat = playerTarget.gridofPos[i][j]
                        stateOfShot = true
                        break;
                    }
                }
                if (stateOfShot) break;
            }
            cell.textContent = 'X';
            cell.style.background = '#0662da';
            if (stateOfShot) {
                cell.style.background = '#b006c7';
                S = S + 1;
                // console.log(playerTarget.boats[shotedBoat[0]].name)
                playerTarget.boats.map((elt) => {
                    if (elt.letter === letterOfCurrentBoat) {
                        elt.isTouched = elt.isTouched + 1
                        console.log(elt.name, elt.isTouched)
                    }
                    if (elt.isTouched === elt.size) {
                        turn = 0
                        console.log('coulé')
                        msgImportant.textContent = `Vous avez Coulé un bateau`;
                        return turn;
                    }
                })
                letterOfCurrentBoat = ''
                score.textContent = `Score : ${playerShooter.score}`;
                msgImportant.textContent = `Vous avez touché un bateau`;

            }
        }
        playerShooter.score = playerShooter.score + S
        console.log(stateOfShot, letterOfCurrentBoat, ' S ', S, ' P.S : ', playerShooter.score)
        turn = 0
        return playerShooter.score;
    })
    return turn
}

// function shot(playerShooter, playerTarget, gridOfTargetDom) {
//     let turn = 1;
//     msgImportant.textContent = `C'est ${playerShooter.name} qui tire`;
//     let score = document.querySelector(`.score${playerShooter.id}`);
//     let stateOfShot = false;
//     let letterOfCurrentBoat = '';
//     gridOfTargetDom.addEventListener('click', function (event) {
//         const cell = event.target;
//         if (cell.classList.contains('cell') && turn === 1) {
//             const posRow = parseInt(cell.parentElement.classList[0].slice(-1));
//             const posCol = parseInt(cell.classList[2].slice(-1));
//             const pos = [posRow, posCol];
//
//             for (let i = 0; i < playerTarget.boats.length; i++) {
//                 const boat = playerTarget.boats[i];
//                 for (let j = 0; j < boat.position.length; j++) {
//                     const boatPos = boat.position[j];
//                     if (boatPos[0] === posRow && boatPos[1] === posCol) {
//                         console.log('Touché la cible');
//                         letterOfCurrentBoat = boat.letter;
//                         stateOfShot = true;
//                         break;
//                     }
//                 }
//                 if (stateOfShot) break;
//             }
//
//             cell.textContent = 'X';
//             cell.style.background = '#0662da';
//             if (stateOfShot) {
//                 cell.style.background = '#b006c7';
//                 playerTarget.boats.forEach((elt) => {
//                     if (elt.letter === letterOfCurrentBoat) {
//                         elt.isTouched += 1;
//                         console.log(elt.name, elt.isTouched);
//                         if (elt.isTouched === elt.size) {
//                             turn = 0;
//                             console.log('coulé');
//                             msgImportant.textContent = `Vous avez Coulé un bateau`;
//                             score.textContent = `Score : ${playerShooter.score}`;
//                             return; // Arrêter la fonction si un bateau est coulé
//                         }
//                     }
//                 });
//                 letterOfCurrentBoat = '';
//                 playerShooter.score += 1; // Incrémentation du score après chaque tir réussi
//                 score.textContent = `Score : ${playerShooter.score}`;
//                 msgImportant.textContent = `Vous avez touché un bateau`;
//             }
//             stateOfShot = false; // Réinitialisation de stateOfShot pour le prochain tir
//             S = 0; // Réinitialisation de S à la fin de chaque tir
//             console.log(stateOfShot, letterOfCurrentBoat, ' P.S : ', playerShooter.score);
//             turn = 0;
//         }
//     });
//     return turn;
// }


// si bateau coulé, verifier si tous les bateaux sont coulés
// si tous les bateaux sont coulés, fin de partie
// si pas tous les bateaux sont coulés, continuer à jouer
function hideBoat(grid, player, hideBoatOne) {
    // for i in player.boat
    // affiche bateau
    // la case . texte content = boat
    // all case . texte content = ''
    const cells = grid.querySelectorAll('.cell');
    if (hideBoatOne) {
        // console.log('cacher')
        cells.forEach(cell => {
            if (cell.textContent !== 'X') {
                cell.textContent = ''
            }
        });
    } else {
        // console.log('afficher')
        if (player.boatIsPlaced) {
            for (let i in player.gridofPos) {
                for (let j in player.gridofPos[i]) {
                    if (player.gridofPos[i][j] !== 0) {
                        // console.log(i, j, player.gridofPos[i][j])
                        const cell = grid.querySelector(`.numRow${i} .numCell${j}`);
                        cell.textContent = player.gridofPos[i][j]
                    }
                }
            }
        }
    }
}

function play() {
    let namePlayerOne = "Amélie";
    let namePlayerTwo = "Marie";
    // let namePlayerOne = prompt('Entrez votre nom Joueur 1') ?? 'Joueur1'
    // let namePlayerTwo = prompt('Entrez votre nom Joueur 2') ?? 'Joueur2'

    // ** INSTANCES GAMES  ** //
    createGrid({name: namePlayerOne}, 'gridPlayerOne', 1);
    createGrid({name: namePlayerTwo}, 'gridPlayerTwo', 2);
    const reset = document.getElementById('btnReset')

    let playerOne = new Player(1, namePlayerOne, 0, [], [], false);
    let playerTwo = new Player(2, namePlayerTwo, 0, [], [], false);

    const userGridOne = document.getElementById('gridPlayerOne');
    const userGridTwo = document.getElementById('gridPlayerTwo');

    // ** PRINT OR HIDE ** //
    const btnHideOne = document.getElementById('btnHide_One')
    const btnHideTwo = document.getElementById('btnHide_Two')

    let hideBoatOne = true;
    btnHideOne.addEventListener('click', (event) => {
        hideBoatOne = !hideBoatOne
        // console.log(hideBoatOne)
        hideBoat(userGridOne, playerOne, hideBoatOne)
    })
    let hideBoatTwo = true;
    btnHideTwo.addEventListener('click', (event) => {
        hideBoatTwo = !hideBoatTwo
        // console.log(hideBoatTwo)
        hideBoat(userGridTwo, playerTwo, hideBoatTwo)
    })

    // ** PLACES BOATS ** //
    // const btnPlaceBoatOne = document.getElementById('btnPlaceBoat_One');
    // const btnPlaceBoatTwo = document.getElementById('btnPlaceBoat_Two');
    //
    // btnPlaceBoatOne.addEventListener('click', function () {
    //     if (playerOne.boatIsPlaced) {
    //         msgImportant.textContent = `Le joueur 1 a déjà placé ses bateaux`;
    //         return;
    //     }
    //     placesBoat(userGridOne, playerOne)
    //     playerOne.boatIsPlaced = true;
    // });
    // btnPlaceBoatTwo.addEventListener('click', function () {
    //     if (!playerOne.boatIsPlaced) {
    //         msgImportant.textContent = `Le joueur 1 doit placer ses bateaux avant de commencer à jouer`;
    //         return;
    //     } else if (playerTwo.boatIsPlaced) {
    //         msgImportant.textContent = `Le joueur 2 a déjà placé ses bateaux`;
    //         return;
    //     }
    //     placesBoat(userGridTwo, playerTwo)
    // });

    /************************
     TODO:
     probleme de position des bateau
     prble de tir touché ou non
     verification du gagnant coulé

     prbleme de bateau aléatoire
     ajouter la torpille


     ***********************/

        // ** RANDOM PLACES BOATS ** //
    const boats = [
            {name: "Porte-avion", size: 5, letter: 'P', isTouched: 0},
            {name: "Croiseur", size: 4, letter: 'C', isTouched: 0},
            {name: "Destroyer", size: 3, letter: 'D', isTouched: 0},
            {name: "Sous-marin", size: 3, letter: 'S', isTouched: 0},
            {name: "Torpilleur", size: 2, letter: 'T', isTouched: 0}
        ];
    const btnRandomBoatsOne = document.getElementById('btnRandomBoat_One');
    const btnRandomBoatsTwo = document.getElementById('btnRandomBoat_Two');
    const btnShotOne = document.getElementById('btnShot_One');
    const btnShotTwo = document.getElementById('btnShot_Two');


    btnRandomBoatsOne.addEventListener('click', (event) => {
        for (let boat of boats) {
            playerOne.boats.push(new Boat(boat.name, boat.size, boat.letter, boat.position, boat.dir, boat.isPlaced, boat.isTouched))
        }
        playerOne.placeShipsRandomly()
        console.log(playerOne)
        playerOne.boatIsPlaced = true;
        if (playerOne.boatIsPlaced && playerTwo.boatIsPlaced) {
            msgImportant.textContent = `Vous pouvez commencer à jouer ${playerOne.name} et ${playerTwo.name}`;
            start()
        }
    })
    btnRandomBoatsTwo.addEventListener('click', () => {
        for (let boat of boats) {
            playerTwo.boats.push(new Boat(boat.name, boat.size, boat.letter, boat.position, boat.dir, boat.isPlaced, boat.isTouched))
        }
        playerTwo.placeShipsRandomly()
        console.log(playerTwo)
        playerTwo.boatIsPlaced = true;
        if (playerOne.boatIsPlaced && playerTwo.boatIsPlaced) {
            msgImportant.textContent = `Vous pouvez commencer à jouer ${playerOne.name} et ${playerTwo.name}`;
            start()
        }
    });

    // ** START SHOT  ** //
    const start = () => {
        if (playerOne.boatIsPlaced && playerTwo.boatIsPlaced) {

            btnShotOne.addEventListener('click', function () {
                msgImportant.textContent = `C'est ${playerOne.name} qui tire`;
                shot(playerOne, playerTwo, userGridTwo);
                if (playerOne.score !== 14) {
                    start()
                }
            });

            btnShotTwo.addEventListener('click', function () {
                msgImportant.textContent = `C'est ${playerTwo.name} qui tire`;

                shot(playerTwo, playerOne, userGridOne);
                if (playerOne.score !== 14) {
                    start()
                }
            });

        }
    }


    reset.addEventListener('click', () => {
        window.location.reload()
    })
}

play();

/* TODO:
* - afficher / cacher les grilles
* - Gestion des tirs
* - Gestion des scores
* - Gestion des tours
* - Gestion de la fin de partie
*
 */