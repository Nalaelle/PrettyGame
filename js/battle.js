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
    }
}

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

    // check direction
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

    // Place boat in grid
    placeShip(row, col, size, isHorizontal, letter) {
        for (let i = 0; i < size; i++) {
            if (isHorizontal) {
                this.gridofPos[row][col + i] = letter;
            } else {
                this.gridofPos[row + i][col] = letter;
            }
        }
    }

    // get position
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

function checkFlow(playerTarget, letterOfCurrentBoat) {
    playerTarget.boats.map((elt) => {
        if (elt.letter === letterOfCurrentBoat) {
            elt.isTouched = elt.isTouched + 1
            console.log(elt.name, elt.isTouched)
            if (elt.isTouched === elt.size) {
                console.log('coulé')
                msgImportant.textContent = `Vous avez Coulé un bateau`;
                return true
            }
            return ''
        }
        return ''
    })
    return ''
}

function checkTargetShot(pos, playerTarget) {
    for (let i in playerTarget.gridofPos) {
        for (let j in playerTarget.gridofPos[i]) {
            const test = [parseFloat(i), parseInt(j)]
            if (playerTarget.gridofPos[i][j] !== 0 && (test[0] === pos[0] && test[1] === pos[1])) {
                console.log('Touché la cible')
                return playerTarget.gridofPos[i][j]
            }
        }
    }
}

function shot(playerShooter, playerTarget, gridOfTargetDom) {
    let turn = 1;
    msgImportant.textContent = `C'est ${playerShooter.name} qui tire`;
    let score = document.querySelector(`.score${playerShooter.id}`);

    gridOfTargetDom.addEventListener('click', function (event) {
        const cell = event.target; // attention prend tout les click
        if ((cell.classList.contains('cell')) && (turn === 1)) {
            turn = 0
            let posRow = parseInt(cell.parentElement.classList[0].slice(-1));
            let posCol = parseInt(cell.classList[2].slice(-1));
            const pos = [posRow, posCol];
            let S = 0;

            const letterOfCurrentBoat = checkTargetShot(pos, playerTarget) ?? false

            cell.textContent = 'X';
            cell.style.background = '#0662da';
            if (letterOfCurrentBoat) {
                cell.style.background = '#b006c7';
                S = S + 1;
                if (checkFlow(playerTarget, letterOfCurrentBoat)) msgImportant.textContent = `Vous avez touché un bateau`;
                // TODO juste pour verifier le bateau
                // const getCurrentBoat = playerTarget.boats.filter((elt) => elt.letter === letterOfCurrentBoat)
                // console.log(getCurrentBoat)

            }
            playerShooter.score = playerShooter.score + S
            score.textContent = `Score : ${playerShooter.score}`;
            turn = 0

            // Fin de partie
            if (playerShooter.score === 17) {
                return msgImportant.textContent = `Bravo ${playerShooter.name} vous avez Gagné !!!`;
            }
            return playerShooter.score;
        }
        turn = 0
        console.log('mauvais click')
    })
    return turn
}

function hideBoat(grid, player, hideBoatOne) {
    const cells = grid.querySelectorAll('.cell');
    if (hideBoatOne) {
        cells.forEach(cell => {
            if (cell.textContent !== 'X') {
                cell.textContent = ''
            }
        })
    } else {
        if (player.boatIsPlaced) {
            for (let i in player.gridofPos) {
                for (let j in player.gridofPos[i]) {
                    if (player.gridofPos[i][j] !== 0) {
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

    let playerOne = new Player(1, namePlayerOne, 0, [], false, false);
    let playerTwo = new Player(2, namePlayerTwo, 0, [], false, false);

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

    btnPlaceBoatOne.addEventListener('click', function () {
        if (playerOne.boatIsPlaced) return msgImportant.textContent = `Vous avez déjà des bateaux ${playerOne.name}`;
        for (let boat of boats) {
            playerOne.boats.push(new Boat(boat.name, boat.size, boat.letter, boat.position, boat.dir, boat.isPlaced, boat.isTouched))
        }
        placesBoatByHand(userGridOne, playerOne)
        playerOne.boatIsPlaced = true;
        hideBoat(userGridOne, playerOne, false)
    });
    btnPlaceBoatTwo.addEventListener('click', function () {
        if (!playerTwo.boatIsPlaced) return msgImportant.textContent = `Vous avez déjà des bateaux ${playerTwo.name}`;
        for (let boat of boats) {
            playerTwo.boats.push(new Boat(boat.name, boat.size, boat.letter, boat.position, boat.dir, boat.isPlaced, boat.isTouched))
        }
        placesBoatByHand(userGridTwo, playerTwo)
        playerTwo.boatIsPlaced = true
        hideBoat(userGridTwo, playerTwo, false)
    });

    /************************
     TODO:
     verifier positionnement des bateaux manuel
     verifier et modifier l'affichage des message   -> si j'ai le temps popover
     ajouter la torpille

     gere apres gagné desactiver les tir ?

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
        if (playerOne.boatIsPlaced) return msgImportant.textContent = `Vous avez déjà des bateaux ${playerOne.name}`;
        for (let boat of boats) {
            playerOne.boats.push(new Boat(boat.name, boat.size, boat.letter, boat.position, boat.dir, boat.isPlaced, boat.isTouched))
        }
        playerOne.placeShipsRandomly()
        playerOne.boatIsPlaced = true;
        hideBoat(userGridOne, playerOne, false)
        if (playerOne.boatIsPlaced && playerTwo.boatIsPlaced) {
            msgImportant.textContent = `Vous pouvez commencer à jouer ${playerOne.name} et ${playerTwo.name}`;
            start()
        }
    })
    btnRandomBoatsTwo.addEventListener('click', () => {
        if (playerTwo.boatIsPlaced) return msgImportant.textContent = `Vous avez déjà des bateaux ${playerTwo.name}`;
        for (let boat of boats) {
            playerTwo.boats.push(new Boat(boat.name, boat.size, boat.letter, boat.position, boat.dir, boat.isPlaced, boat.isTouched))
        }
        playerTwo.placeShipsRandomly()
        playerTwo.boatIsPlaced = true;
        hideBoat(userGridTwo, playerTwo, false)
        if (playerOne.boatIsPlaced && playerTwo.boatIsPlaced) {
            msgImportant.textContent = `Vous pouvez commencer à jouer ${playerOne.name} et ${playerTwo.name}`;
            start()
        }
    });

    // ** START SHOT  ** // TODO : tour ok mais désactiver pour la suite des tests
    const start = () => {
        if (playerOne.boatIsPlaced && playerTwo.boatIsPlaced) {
            // playerOne.myTurn = true
            btnShotOne.addEventListener('click', function () {
                // if (playerOne.myTurn) {
                msgImportant.textContent = `C'est ${playerOne.name} qui tire`;
                shot(playerOne, playerTwo, userGridTwo)
                // playerOne.myTurn = false;
                // playerTwo.myTurn = true;
                // } else {
                //     msgImportant.textContent = `C'est le tour de ${playerTwo.name}`;
                // }

            })
            btnShotTwo.addEventListener('click', function () {
                // if (playerTwo.myTurn) {
                msgImportant.textContent = `C'est ${playerTwo.name} qui tire`;
                shot(playerTwo, playerOne, userGridOne)
                // playerOne.myTurn = true;
                // playerTwo.myTurn = false;
                // } else {
                //     msgImportant.textContent = `C'est le tour de ${playerOne.name}`;
                // }

            })
        }
    }

    reset.addEventListener('click', () => {
        window.location.reload()
    })
}

play();