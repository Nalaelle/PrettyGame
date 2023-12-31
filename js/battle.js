const msgImportant = document.getElementById('msgImportant');
let endGame = false;

// Cette fonction créer les élement du DOM nécessaire pour le jeu
function createGrid(player, grid, id) {
    const gridOfDom = document.getElementById(grid);
    const letters = [' ', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

    const playerGrid = document.createElement('div');
    playerGrid.classList.add('playerGrid');

    const score = document.createElement('p');
    score.textContent = `Score : ${player.score ?? 0}`;
    score.classList.add(`score`);
    score.classList.add(`score${id}`);

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const theadRow = document.createElement('tr');

    // column letter
    letters.forEach(letter => {
        const letterHeader = document.createElement('th');
        letterHeader.textContent = letter;
        letterHeader.classList.add('case');
        theadRow.appendChild(letterHeader);
    });
    thead.appendChild(theadRow);
    table.appendChild(thead);

    // body grid
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
            cell.classList.add(`cell${id}`);
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
    playerGrid.appendChild(table);
}

// Objet bateau
class Boat {
    constructor(name, size, letter, position, dir, isPlaced, isTouched) {
        this.name = name;
        this.size = size;
        this.letter = letter;
        this.position = position;
        this.dir = dir;
        this.isPlaced = isPlaced;
        this.isTouched = isTouched;
    }
}

// Objet joueur
class Player {
    id = 0;
    name = "";
    boats = [];
    boatIsPlaced = false;
    score = 0;
    myTurn = false;

    constructor(id, name, score, boats, boatIsPlaced, myTurn) {
        this.id = id;
        this.name = name;
        this.score = score;
        this.boats = boats;
        this.boatIsPlaced = boatIsPlaced;
        this.myTurn = myTurn;
    }

    // grille de position
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

    // Methode utilisé pour placer les bateaux aléatoirement
    placeShipsRandomly() {
        const gridLength = 10;
        const ships = this.boats;
        for (const ship of ships) {
            let placed = false
            if (ship.isPlaced) return;

            while (!placed) {
                const isHorizontal = Math.random() < 0.5; // Direction aléatoire
                const row = Math.floor(Math.random() * gridLength)
                const col = Math.floor(Math.random() * gridLength)

                if (this.checkDir(row, col, ship.size, isHorizontal)) {
                    this.placeShip(row, col, ship.size, isHorizontal, ship.letter)
                    ship.position = this.getShipPositions(row, col, ship.size, isHorizontal)
                    ship.isPlaced = true
                    ship.dir = isHorizontal ? 'H' : 'V';
                    placed = true
                }
            }
        }
    }

    // Vérifie la direction
    checkDir(row, col, size, isHorizontal) {
        const gridLength = 10
        const endRow = isHorizontal ? row : row + size - 1;
        const endCol = isHorizontal ? col + size - 1 : col;

        // si le bateau sort de la grille
        if (endRow >= gridLength || endCol >= gridLength) {
            return false
        }
        // déjà occupées
        for (let i = row; i <= endRow; i++) {
            for (let j = col; j <= endCol; j++) {
                if (this.gridofPos[i][j] !== 0) {
                    return false;
                }
            }
        }
        return true
    }

    // Place les bateau sur la grille
    placeShip(row, col, size, isHorizontal, letter) {
        for (let i = 0; i < size; i++) {
            if (isHorizontal) {
                this.gridofPos[row][col + i] = letter;
            } else {
                this.gridofPos[row + i][col] = letter;
            }
        }
    }

    // retourne les positions du bateau
    getShipPositions(row, col, size, isHorizontal) {
        const positions = []
        for (let i = 0; i < size; i++) {
            if (isHorizontal) {
                positions.push([row, col + i])
            } else {
                positions.push([row + i, col])
            }
        }
        return positions
    }
}

// Methode pour placer les bateaux à la main
function placesBoatByHand(playerGrid, player) {
    let currentBoat = player.boats[0];
    let allBoatIsPlaced = false;
    // Récupère le bateau en cours
    const checkCurrentBoat = () => {
        for (let i of player.boats) {
            if (i.position.length !== i.size) {
                currentBoat = i;
                break;
            }
        }
        if (player.boats[player.boats.length - 1].isPlaced) {
            allBoatIsPlaced = true
            player.boatIsPlaced = true;
        }
    }
    checkCurrentBoat();

    // Ecoute les click sur la grille et vérifie le choix du joueur
    playerGrid.addEventListener('click', function (event) {
        const cell = event.target;
        if (cell.classList.contains(`cell${player.id}`) && !allBoatIsPlaced) {
            let row = parseInt(cell.parentElement.classList[0].slice(-1));
            let col = parseInt(cell.classList[3].slice(-1));
            const direction = prompt('Entrez H pour horizontal ou V pour vertical')
            const isHorizontal = direction === 'H';
            // const isHorizontal = Math.random() < 0.5; // Direction aléatoire si on veut desactiver le prompt

            console.log(row, col, currentBoat.size, isHorizontal)
            // vérifie si le bateau peut être placé avec la methode checkDir du joueur
            if (player.checkDir(row, col, currentBoat.size, isHorizontal)) {
                player.placeShip(row, col, currentBoat.size, isHorizontal, currentBoat.letter)
                currentBoat.position = player.getShipPositions(row, col, currentBoat.size, isHorizontal)
                currentBoat.isPlaced = true
                currentBoat.dir = isHorizontal ? 'H' : 'V';
                checkCurrentBoat();
                hideBoat(playerGrid, player, false)

            } else {
                if (!player.checkDir(row, col, currentBoat.size, isHorizontal)) msgImportant.textContent = `Vous ne pouvez pas placer le bateau ici`;
                return console.log('position passe pas')
            }
            msgImportant.textContent = `Vous pouvez placer le bateau ${currentBoat.name} de taille ${currentBoat.size}`;

        }
    })
}

// Vérifie si le bateau est coulé
function checkFlow(playerTarget, letterOfCurrentBoat) {
    playerTarget.boats.map((elt) => {
        if (elt.letter === letterOfCurrentBoat) {
            elt.isTouched = elt.isTouched + 1
            // console.log(elt.name, elt.isTouched)
            if (elt.isTouched === elt.size) {
                // console.log('coulé')
                msgImportant.textContent = `Vous avez Coulé un bateau`;
                return true
            }
            return ''
        }
        return ''
    })
    return ''
}

// Vérifie si la cible est touché
function checkTargetShot(pos, playerTarget) {
    console.log(playerTarget.gridofPos)
    for (let i in playerTarget.gridofPos) {
        for (let j in playerTarget.gridofPos[i]) {
            const test = [parseFloat(i), parseInt(j)]
            console.log(test, pos)
            if (playerTarget.gridofPos[i][j] !== 0 && (test[0] === pos[0] && test[1] === pos[1])) {
                // console.log('Touché la cible')
                return playerTarget.gridofPos[i][j]
            }
        }
    }
}

// Methode pour tirer sur la cible
function shot(playerShooter, playerTarget, gridOfTargetDom) {
    let turn = 1;
    msgImportant.textContent = `C'est ${playerShooter.name} qui tire`;
    let score = document.querySelector(`.score${playerShooter.id}`);

    // Ecoute les click sur la grille et vérifie le choix du joueur
    gridOfTargetDom.addEventListener('click', function (event) {
        const cell = event.target; // attention prend tout les click
        if ((cell.classList.contains(`cell${playerTarget.id}`)) && (turn === 1)) {
            turn = 0
            let posRow = parseInt(cell.parentElement.classList[0].slice(-1)); // Position de la ligne
            let posCol = parseInt(cell.classList[3].slice(-1)); // Position de la colonne
            const pos = [posRow, posCol];
            let S = 0;

            const letterOfCurrentBoat = checkTargetShot(pos, playerTarget) ?? false // Retourne la lettre correspondant au bateau touché

            cell.textContent = 'X';
            cell.style.background = '#0662da';
            if (letterOfCurrentBoat) {
                cell.style.background = '#b006c7';
                S = S + 1;
                if (checkFlow(playerTarget, letterOfCurrentBoat)) msgImportant.textContent = `Vous avez touché un bateau`;
            }
            playerShooter.score = playerShooter.score + S
            score.textContent = `Score : ${playerShooter.score}`;
            turn = 0

            // Fin de partie
            if (playerShooter.score === 17) {
                endGame = true
                return msgImportant.textContent = `Bravo ${playerShooter.name} vous avez Gagné !!!`;
            }
            return playerShooter.score;
        }
        turn = 0
        // console.log('mauvais click')
    })
    return turn
}

// Methode pour afficher/cacher les bateaux
function hideBoat(grid, player, hideBoatOne) {
    const cells = grid.querySelectorAll('.cell');
    if (hideBoatOne) {
        cells.forEach(cell => { // Efface les bateaux
            if (cell.textContent !== 'X') {
                cell.textContent = ''
            }
        })
    } else {// Parcours la grille du joueur et affiche les bateaux
        for (let i in player.gridofPos) {
            for (let j in player.gridofPos[i]) {
                if (player.gridofPos[i][j] !== 0) {
                    const cell = grid.querySelector(`.numRow${(i * 1)} .numCell${j * 1}`);
                    cell.textContent = (`${player.gridofPos[i][j]}`)
                }
            }
        }
    }
}

// Methode pour jouer
function play() {
    const namePlayerOne = 'Joueur1'
    const namePlayerTwo = 'Joueur2'

    // ** INSTANCES GRID  ** //
    createGrid({name: namePlayerOne}, 'gridPlayerOne', 1);
    createGrid({name: namePlayerTwo}, 'gridPlayerTwo', 2);
    const reset = document.getElementById('btnReset')

    // ** INSTANCES PLAYERS  ** //
    let playerOne = new Player(1, namePlayerOne, 0, [], false, false);
    let playerTwo = new Player(2, namePlayerTwo, 0, [], false, false);

    const nOne = document.getElementById('namePlayerOne')
    const nTwo = document.getElementById('namePlayerTwo')
    nOne.addEventListener('input', (e) => {
        playerOne.name = e.target.value
    })
    nTwo.addEventListener('input', (e) => {
        playerTwo.name = e.target.value
    })


    const userGridOne = document.getElementById('gridPlayerOne');
    const userGridTwo = document.getElementById('gridPlayerTwo');

    // ** PRINT OR HIDE ** //
    const btnHideOne = document.getElementById('btnHide_One')
    const btnHideTwo = document.getElementById('btnHide_Two')

    let hideBoatOne = false;
    btnHideOne.addEventListener('click', (event) => {
        hideBoatOne = !hideBoatOne
        hideBoat(userGridOne, playerOne, hideBoatOne)
        btnHideOne.textContent = hideBoatOne ? 'Voir' : 'Cacher'
    })
    let hideBoatTwo = false;
    btnHideTwo.addEventListener('click', (event) => {
        hideBoatTwo = !hideBoatTwo
        hideBoat(userGridTwo, playerTwo, hideBoatTwo)
        btnHideTwo.textContent = hideBoatTwo ? 'Voir' : 'Cacher'
    })

    // ** PLACES BOATS ** //
    const btnPlaceBoatOne = document.getElementById('btnPlaceBoat_One');
    const btnPlaceBoatTwo = document.getElementById('btnPlaceBoat_Two');

    // Listener  btn place Hand player 1
    btnPlaceBoatOne.addEventListener('click', function () {
        if (playerOne.boatIsPlaced) return msgImportant.textContent = `Vous avez déjà des bateaux ${playerOne.name}`;
        if (playerOne.boats.length === 0) {
            for (let boat of boats) {
                playerOne.boats.push(new Boat(boat.name, boat.size, boat.letter, [], boat.dir, boat.isPlaced, boat.isTouched))
            }
        }
        msgImportant.textContent = `Cliquez sur une case pour placer un bateau`;
        placesBoatByHand(userGridOne, playerOne)
        playerOne.boatIsPlaced = true;
        hideBoat(userGridOne, playerOne, false)
        start()
    });
    // Listener  btn place Hand player 2
    btnPlaceBoatTwo.addEventListener('click', function () {
        if (playerTwo.boatIsPlaced) return msgImportant.textContent = `Vous avez déjà des bateaux ${playerTwo.name}`;
        if (playerTwo.boats.length === 0) {
            for (let boat of boats) {
                playerTwo.boats.push(new Boat(boat.name, boat.size, boat.letter, [], boat.dir, boat.isPlaced, boat.isTouched))
            }
        }
        msgImportant.textContent = `Cliquez sur une case pour placer un bateau`;
        placesBoatByHand(userGridTwo, playerTwo)
        playerTwo.boatIsPlaced = true
        hideBoat(userGridTwo, playerTwo, false)
        start()
    });

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

    // Listener  btn random player 1
    btnRandomBoatsOne.addEventListener('click', (event) => {
        if (playerOne.boatIsPlaced) {
            if (playerOne.boats[playerOne.boats.length - 1].position.length === 0) {
                return msgImportant.textContent = `Vous devez placer vos bateaux à la main ${playerOne.name}`;
            } else {
                return msgImportant.textContent = `Vous avez déjà des bateaux ${playerOne.name}`;
            }
        }
        console.log(playerOne.boats.length)
        if (playerOne.boats.length === 0) {
            for (let boat of boats) {
                playerOne.boats.push(new Boat(boat.name, boat.size, boat.letter, boat.position, boat.dir, boat.isPlaced, boat.isTouched))
            }
        }
        playerOne.placeShipsRandomly()
        playerOne.boatIsPlaced = true;
        hideBoat(userGridOne, playerOne, false) // affiche les bateaux
        if (playerOne.boatIsPlaced && playerTwo.boatIsPlaced) {
            msgImportant.textContent = `Vous pouvez commencer à jouer ${playerOne.name} et ${playerTwo.name}`;
            start()
        }
    })
    // Listener  btn random player 2
    btnRandomBoatsTwo.addEventListener('click', () => {
        if (playerTwo.boatIsPlaced) {
            if (playerTwo.boats[playerTwo.boats.length - 1].position.length === 0) {
                return msgImportant.textContent = `Vous devez placer vos bateaux à la main ${playerTwo.name}`;
            } else {
                return msgImportant.textContent = `Vous avez déjà des bateaux ${playerTwo.name}`;
            }
        }
        if (playerTwo.boats.length === 0) {
            for (let boat of boats) {
                playerTwo.boats.push(new Boat(boat.name, boat.size, boat.letter, boat.position, boat.dir, boat.isPlaced, boat.isTouched))
            }
        }
        playerTwo.placeShipsRandomly()
        playerTwo.boatIsPlaced = true;
        hideBoat(userGridTwo, playerTwo, false) // affiche les bateaux
        if (playerOne.boatIsPlaced && playerTwo.boatIsPlaced) {
            msgImportant.textContent = `Vous pouvez commencer à jouer ${playerOne.name} et ${playerTwo.name}`;
            start()
        }
    });

    // ** START SHOT  ** //
    const start = () => {
        if (endGame) return msgImportant.textContent = `La partie est terminée ! `;
        if (playerOne.boatIsPlaced && playerTwo.boatIsPlaced) {
            // Vérifie à qui est le tour en commencant par le joueur 1
            playerOne.myTurn = true
            btnShotOne.addEventListener('click', function () {
                if (playerOne.myTurn) {
                    if (endGame) return msgImportant.textContent = `La partie est terminée ! `;
                    msgImportant.textContent = `C'est ${playerOne.name} qui tire`;
                    shot(playerOne, playerTwo, userGridTwo)
                    playerOne.myTurn = false;
                    playerTwo.myTurn = true;
                } else {
                    msgImportant.textContent = `C'est le tour de ${playerTwo.name}`;
                }

            })
            btnShotTwo.addEventListener('click', function () {
                if (playerTwo.myTurn) {
                    if (endGame) return msgImportant.textContent = `La partie est terminée ! `;
                    msgImportant.textContent = `C'est ${playerTwo.name} qui tire`;
                    shot(playerTwo, playerOne, userGridOne)
                    playerOne.myTurn = true;
                    playerTwo.myTurn = false;
                } else {
                    msgImportant.textContent = `C'est le tour de ${playerOne.name}`;
                }

            })
        }
    }

    // ** RESET ** //
    reset.addEventListener('click', () => {
        window.location.reload()
    })
}

play();