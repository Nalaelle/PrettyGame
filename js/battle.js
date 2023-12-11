const msgImportant = document.getElementById('msgImportant');


function createGrid(player, grid) {
    const gridOfDom = document.getElementById(grid);
    const letters = [' ', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

    // Création de la table et de son thead
    const playerGrid = document.createElement('div');
    playerGrid.classList.add('playerGrid');
    const playerName = document.createElement('h2');
    playerName.textContent = player.name;
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

class Game {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
    }

    test() {
        console.log(this.player1.grid);
    }

    // startGame() {
    // turn / shot / state of the game /
    // }
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
                        } else if (currentBoat.dir === 'horizontal' && posCol === position[position.length - 1][1] + 1) {
                            addPosition(posRow, posCol);
                        } else if (currentBoat.dir === 'vertical' && posRow === position[position.length - 1][0] + 1) {
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

function shot() {
    // TODO : implementer la fonction de tir

    // tirer sur la grille adverse
    // verifier si touché ou pas
    // si touché, verifier si bateau coulé
    // si bateau coulé, verifier si tous les bateaux sont coulés
    // si tous les bateaux sont coulés, fin de partie
    // si pas tous les bateaux sont coulés, continuer à jouer


}

function play() {
    let namePlayerOne = "Amélie";
    let namePlayerTwo = "Marie";
    // const btnPlay = document.getElementById('btnPlay');
    // btnPlay.addEventListener('click', getNamePlayer(namePlayerOne, namePlayerTwo))

    createGrid({name: namePlayerOne}, 'gridPlayerOne');
    createGrid({name: namePlayerTwo}, 'gridPlayerTwo');

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
        // playerTwo.boatIsPlaced = false;
        // console.log(playerOne, playerTwo)
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


    const btnShotOne = document.getElementById('btnShot_One');
    const btnShotTwo = document.getElementById('btnShot_Two');

    if (playerOne.boatIsPlaced && playerTwo.boatIsPlaced) {
        msgImportant.textContent = `Vous pouvez commencer à jouer ${playerOne.name} et ${playerTwo.name}`;

        btnShotOne.addEventListener('click', function () {
            shot();
        });
        btnShotTwo.addEventListener('click', function () {
            shot();
        });
    }

    // implement le tour de jeu
    // let turnOfPlayerOne = true;
    // const turn = () => {
    //     if (turnOfPlayerOne) {
    //         console.log('p1')
    //         turnOfPlayerOne = false;
    //         return playerOne;
    //     } else {
    //         console.log('p2')
    //         turnOfPlayerOne = true;
    //         return playerTwo;
    //     }
    // }
    // placesBoat(userGridTwo, playerTwo)
    // const game = new Game(playerOne, playerTwo);
    // game.test();
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


// placesBoat(userGridTwo, boats[2].letter)

// btn placeboat
//  const btnPlaceBoat = document.getElementsByClassName('btnPlaceBoat');
//  btnPlaceBoat.addEventListener('click', function(event){
//      // playerOne.placeBoat();
//      console.log(event.target)
//      // placesBoat(userGridOne, playerOne.boats[0])
//  });


// playerOne.grid.A[2] = 'X';
// console.log(playerOne.grid.A[2]);
// console.log(playerOne.grid);
// playerOne.placeBoat();
// console.log(playerOne.placeBoat());
// const boats = ["Porte-avion", "Croiseur", "Contre-torpilleur", "Sous-marin", "Torpilleur"]
// const boats = {
//     "Porte-avion" : 5,
//     "Croiseur" : 4,
//     "Contre-torpilleur" : 3,
//     "Sous-marin" : 3,
//     "Torpilleur" : 2
// }
// {name:"Porte-avion", size: 5, letter: 'P', position: [], dir: "horizontal", isPlaced: false, isTouched: false},


// console.log(boat)
// console.log(event.target.textContent);
// const position = event.target.textContent;
//    console.log(position);


// event.target.classList.add('selected');
// console.log(event.target);
// console.log(event.target.classList.contains('cell'));


//**
// event.target.textContent = currentBoat.letter;
// event.target.classList.add(`boat${boat.letter}${id}`);
// console.log(position)
// position.push(event.target.textContent);
//     if(position.length === currentBoat.size){
//         currentBoat.position = position;
//         console.log('c', currentBoat)
//         position = [];
//         checkPosBoat();
//     }
//     if(position.length < boat.size){
//         position.push(event.target.textContent);
//         console.log('p',position);
//     }


// if (event.target.classList.contains('cell')){
//     if(position.length < currentBoat.size  && currentBoat.position.length < currentBoat.size){ // && currentBoat.position.length < currentBoat.size
//         if(event.target.textContent !== '') {
//             console.log(event.target.textContent, typeof event.target.textContent)
//             alert('cette case est déjà prise')
//         }else{
//             event.target.textContent = currentBoat.letter;
//             event.target.classList.add(`boat${boat.letter}${id}`);
//             position.push(event.target.textContent);
//             // console.log('p', position);
//         }
//     }
//     else if (position.length === currentBoat.size && currentBoat.position.length === 0){
//         currentBoat.position = position;
//         position = [];
//         checkPosBoat();
//         // console.log('p',position);
//     }
// }


// function placesBoat(playerGrid, boat, id){
//     const msg = playerGrid.firstElementChild
//     let position = [];
//     let currentBoat = boat[0];
//     let stateofPositon = false;
//     const checkPosBoat = ()=>{
//         for(let i of boat){
//             if(i.position.length !== i.size){
//                 msg.textContent = `Vous devez placez vos bateaux. Placez le : ${i.name} il doit contenir ${i.size} cases.`;
//                 currentBoat = i;
//                 break;
//             }
//         }
//         if(boat[3].position.length === 2) {
//             msg.textContent = `Vous avez placez tous vos bateaux`;
//             stateofPositon = true;
//         }
//     }
//     checkPosBoat();
//
//     playerGrid.addEventListener('click', function(event ){
//         console.log(currentBoat.name, currentBoat.size)
//         const cell = event.target;
//         if (cell.classList.contains('cell')){
//             if(position.length < currentBoat.size  && currentBoat.position.length < currentBoat.size){
//                 if(cell.textContent === 'P' || cell.textContent === 'C' || cell.textContent === 'S' || cell.textContent === 'T') {
//                     alert('cette case est déjà prise')
//                 }
//                 else {
//                     cell.textContent = currentBoat.letter;
//                     cell.classList.add(`boat${currentBoat.letter}${id}`);
//                     position.push(cell.textContent);
//                     // console.log('p', position);
//                 }
//             }
//             else if (position.length === currentBoat.size && currentBoat.position.length === 0){
//                 currentBoat.position = position;
//                 position = [];
//                 checkPosBoat();
//                 // console.log('p',position);
//             }
//         }
//
//     })
//
//     if(stateofPositon){
//         msg.textContent = `Vous pouvez commencer à jouer`;
//         playerGrid
//     }
// }