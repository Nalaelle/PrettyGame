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
    shots = [];

    constructor(id, name, score, boats, shots, boatIsPlaced) {
        this.id = id;
        this.name = name;
        this.score = score;
        this.boats = boats;
        this.shots = shots;
        this.boatIsPlaced = boatIsPlaced;
    }
}

function getNamePlayer(namePlayerOne, namePlayerTwo) {
    console.log(namePlayerOne, namePlayerTwo)
    namePlayerOne = prompt("Entrez votre nom joueur 1 :");
    namePlayerTwo = prompt("Entrez votre nom joueur 2 :");
}

function placesBoat(playerGrid, player) {
    const boat = [
        {name: "Porte-avion", size: 5, letter: 'P', position: []},
        {name: "Croiseur", size: 4, letter: 'C', position: []},
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
        if (boat[3].position.length === 2) {
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
            cell.classList.add(`boat${currentBoat.letter}${id}`);
            position.push([posRow, posCol]);
        }
        const cell = event.target;
        if (cell.classList.contains('cell')) {
            if (position.length < currentBoat.size && currentBoat.position.length < currentBoat.size) {
                if (cell.textContent === 'P' || cell.textContent === 'C' || cell.textContent === 'S' || cell.textContent === 'T') {
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

let gridTest = [
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
const generateRandomPosition = (size, grid) => {
    const random = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    const dir = Math.random() < 0.5 ? 'horizontal' : 'vertical';
    let row, col = 0;
    let temp = [];
    if (dir === 'horizontal') {
        row = random(1, 10 - size);
        col = random(1, 10 - size);
    } else {
        row = random(1, 10 - size);
        col = random(1, 10 - size);
    }
    const newPos = () => {
        temp = [];
        for (let i = 0; i < size; i++) {
            if (dir === 'horizontal') {
                col = row + (size - i) // equals to row - decrement de 1
                temp.push([row, col])
            } else {
                row = col + (size - i) // equals to col - decrement de 1
                temp.push([row, col])
            }
        }
        return temp;
    }
    newPos()
    let stopLoop = 0;

// TODO : souvent des erreurs de placement + boucle infinis
    function insertTempInGrid(temp) {
        console.log('temp', temp)
        for (let i = 0; i < temp.length; i++) {
            console.log(stopLoop)
            let [row, col] = temp[i];
            if (gridTest[row - 1][col - 1] === 0) {
                gridTest[row - 1][col - 1] = 1;
            } else {
                stopLoop = stopLoop + 1;
                console.log('NO ', stopLoop)
                if (stopLoop > 100) {
                    console.log('stop')
                    return msgImportant.textContent = `Une erreur est survenue, veuillez réessayer`;
                }
                newPos()
                insertTempInGrid(temp)
            }
        }
        // console.log('grid', gridTest)
        return temp;
    }

    insertTempInGrid(temp)
    if (temp.length > 0) {
        return temp;
    } else {
        newPos()
        insertTempInGrid(temp)
    }
};

const placesBoatRandom = (grid, player) => {
    const boats = [
        {name: "Porte-avion", size: 5, letter: 'P'},
        {name: "Croiseur", size: 4, letter: 'C'},
        {name: "Sous-marin", size: 3, letter: 'S'},
        {name: "Torpilleur", size: 2, letter: 'T'}
    ];
    for (let boat of boats) {
        const position = generateRandomPosition(boat.size, grid);
        player.boats.push(new Boat(boat.name, boat.size, boat.letter, position, '', true, false));

        for (let pos of position) {
            const [row, col] = pos;
            const cell = grid.querySelector(`.numRow${row - 1} .numCell${col - 1}`);
            cell.textContent = boat.letter;
            cell.classList.add(`boat${boat.letter}${player.id}`);
        }
    }
}

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

function shot(playerShooter, playerTarget, gridOfTarget) {
    let turn = 1;
    let score = document.querySelector(`.score${playerShooter.id}`);
    let positionBoatOfTarget = playerTarget.boats.map(boat => boat.position);
    // let stateOfShot = 0;
    let shotedBoat = [];
    // state of the shot = pas tirer / raté / touché / coulé / gagné
    // 0, 1, 2, 3, 4
// TODO // score  // gestion du tour de jeu // gestion de la fin de partie
    gridOfTarget.addEventListener('click', function (event) {
        const cell = event.target;
        if (cell.classList.contains('cell') && turn === 1) {
            // position du tir
            let posRow = parseInt(cell.parentElement.classList[0].slice(-1)) + 1;
            let posCol = parseInt(cell.classList[2].slice(-1)) + 1;
            const pos = [posRow, posCol];
            cell.textContent = 'X';
            console.log(posRow, posCol)
            // iteration bateau
            for (let i in positionBoatOfTarget) { // i = index bateau
                for (let j in positionBoatOfTarget[i]) { // j = index position
                    if (pos[0] === positionBoatOfTarget[i][j][0] && pos[1] === positionBoatOfTarget[i][j][1]) {
                        positionBoatOfTarget[i][j][0] = 0;
                        positionBoatOfTarget[i][j][1] = 0;
                        shotedBoat.push(parseInt(i), parseInt(j));
                        // touché
                    }
                    // rater
                }
            }
            if (shotedBoat.length > 0) {
                // TODO : suppr console.log
                console.log(playerTarget.boats[shotedBoat[0]].name)

                playerTarget.boats[shotedBoat[0]].position[shotedBoat[1]] = 0;
                playerShooter.score = playerShooter.score + 1;
                score.textContent = `Score : ${playerShooter.score}`;
                msgImportant.textContent = `Vous avez touché un bateau`;

            } else {
                msgImportant.textContent = `Vous avez Raté`;
            }
            console.log(shotedBoat)
            endOfGame(playerShooter, score)
            return turn = 0;
        }
    })
}


// si bateau coulé, verifier si tous les bateaux sont coulés
// si tous les bateaux sont coulés, fin de partie
// si pas tous les bateaux sont coulés, continuer à jouer

function play() {
    let namePlayerOne = "Amélie";
    let namePlayerTwo = "Marie";
    // const btnPlay = document.getElementById('btnPlay');
    // btnPlay.addEventListener('click', getNamePlayer(namePlayerOne, namePlayerTwo))

    createGrid({name: namePlayerOne}, 'gridPlayerOne', 1);
    createGrid({name: namePlayerTwo}, 'gridPlayerTwo', 2);

    let playerOne = new Player(1, namePlayerOne, 0, [], [], false);
    let playerTwo = new Player(2, namePlayerTwo, 0, [], [], false);
    console.log('play')

    const userGridOne = document.getElementById('gridPlayerOne');
    const userGridTwo = document.getElementById('gridPlayerTwo');

    const btnPlaceBoatOne = document.getElementById('btnPlaceBoat_One');
    const btnPlaceBoatTwo = document.getElementById('btnPlaceBoat_Two');

    console.log(playerOne, playerTwo)
    btnPlaceBoatOne.addEventListener('click', function () {
        if (playerOne.boatIsPlaced) {
            msgImportant.textContent = `Le joueur 1 a déjà placé ses bateaux`;
            return;
        }
        placesBoat(userGridOne, playerOne)
        playerOne.boatIsPlaced = true;
    });
    btnPlaceBoatTwo.addEventListener('click', function () {
        if (!playerOne.boatIsPlaced) {
            msgImportant.textContent = `Le joueur 1 doit placer ses bateaux avant de commencer à jouer`;
            return;
        } else if (playerTwo.boatIsPlaced) {
            msgImportant.textContent = `Le joueur 2 a déjà placé ses bateaux`;
            return;
        }
        placesBoat(userGridTwo, playerTwo)
    });

    /************************
     TODO:
     probleme de position des bateau
     verification du gagnant coulé


     ***********************/
    const btnRandomBoatsOne = document.getElementById('btnRandomBoat_One');
    const btnRandomBoatsTwo = document.getElementById('btnRandomBoat_Two');
    const btnShotOne = document.getElementById('btnShot_One');
    const btnShotTwo = document.getElementById('btnShot_Two');

    btnRandomBoatsOne.addEventListener('click', (event) => {
        placesBoatRandom(userGridOne, playerOne);
        playerOne.boatIsPlaced = true;
        if (playerOne.boatIsPlaced && playerTwo.boatIsPlaced) {
            msgImportant.textContent = `Vous pouvez commencer à jouer ${playerOne.name} et ${playerTwo.name}`;
            start()
        }
    })
    btnRandomBoatsTwo.addEventListener('click', () => {
        placesBoatRandom(userGridTwo, playerTwo);
        playerTwo.boatIsPlaced = true;
        if (playerOne.boatIsPlaced && playerTwo.boatIsPlaced) {
            msgImportant.textContent = `Vous pouvez commencer à jouer ${playerOne.name} et ${playerTwo.name}`;
            start()
        }
    });

    const start = () => {
        if (playerOne.boatIsPlaced && playerTwo.boatIsPlaced) {
            msgImportant.textContent = `Vous pouvez commencer à jouer ${playerOne.name} et ${playerTwo.name}`;

            btnShotOne.addEventListener('click', function () {
                shot(playerOne, playerTwo, userGridTwo);
                if (playerOne.score !== 14) {
                    start()
                }
            });

            btnShotTwo.addEventListener('click', function () {
                shot(playerTwo, playerOne, userGridOne);
                if (playerOne.score !== 14) {
                    start()
                }
            });

        }
    }
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