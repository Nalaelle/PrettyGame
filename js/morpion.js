function afficherPlateau(plateau) {
    for (let i = 0; i < 3; i++) {
        console.log(plateau[i].join('|'));
        if (i < 2) {
            console.log('-----');
        }
    }
}

function verifierVictoire(plateau, symbole) {
    // Vérification des lignes et colonnes
    for (let i = 0; i < 3; i++) {
        if ((plateau[i][0] === symbole && plateau[i][1] === symbole && plateau[i][2] === symbole) ||
            (plateau[0][i] === symbole && plateau[1][i] === symbole && plateau[2][i] === symbole)) {
            return true;
        }
    }
    // Vérification des diagonales
    if ((plateau[0][0] === symbole && plateau[1][1] === symbole && plateau[2][2] === symbole) ||
        (plateau[0][2] === symbole && plateau[1][1] === symbole && plateau[2][0] === symbole)) {
        return true;
    }
    return false;
}

function jouerMorpion() {
    const plateau = [[' ', ' ', ' '], [' ', ' ', ' '], [' ', ' ', ' ']];
    const symboles = ['X', 'O'];
    let tour = 0;
    let jeuEnCours = true;

    while (jeuEnCours) {
        afficherPlateau(plateau);
        const symbole = symboles[tour % 2];
        console.log(`C'est au tour du joueur ${symbole}`);

        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });

        readline.question('Choisissez la ligne (0, 1, ou 2) : ', (ligne) => {
            readline.question('Choisissez la colonne (0, 1, ou 2) : ', (colonne) => {
                const ligneNum = parseInt(ligne);
                const colonneNum = parseInt(colonne);

                if (plateau[ligneNum][colonneNum] === ' ') {
                    plateau[ligneNum][colonneNum] = symbole;
                    if (verifierVictoire(plateau, symbole)) {
                        afficherPlateau(plateau);
                        console.log(`Le joueur ${symbole} a gagné !`);
                        jeuEnCours = false;
                        readline.close();
                    } else if (tour === 8) {
                        afficherPlateau(plateau);
                        console.log('Match nul !');
                        jeuEnCours = false;
                        readline.close();
                    } else {
                        tour++;
                    }
                } else {
                    console.log('Cette case est déjà remplie. Choisissez une autre case.');
                }

                if (jeuEnCours) {
                    readline.close();
                    jouerMorpion();
                }
            });
        });
    }
}

jouerMorpion();
