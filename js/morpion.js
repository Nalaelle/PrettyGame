document.addEventListener("DOMContentLoaded", function () {
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const status = document.getElementById('status');
    const restartBtn = document.getElementById('restart-btn');

    let currentPlayer = 'X';
    let gameActive = true;
    let gameState = ['', '', '', '', '', '', '', '', ''];
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    const checkWin = () => {
        for (let condition of winConditions) {
            const [a, b, c] = condition;
            if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
                gameActive = false;
                return gameState[a];
            }
        }

        if (!gameState.includes('')) {
            gameActive = false;
            return 'Equals';
        }

        return null;
    };

    const handleCellClick = (e) => {
        const index = e.target.dataset.index;
        if (gameState[index] === '' && gameActive) {
            gameState[index] = currentPlayer;
            e.target.textContent = currentPlayer;
            const winner = checkWin();
            if (winner) {
                status.textContent = winner === 'Equals' ? 'Dommage!' : `Joueur ${winner} à gagné!`;
            } else {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                status.textContent = `c'est à joueur ${currentPlayer}`;
            }
        }
    };

    cells.forEach(cell => cell.addEventListener('click', handleCellClick));

    restartBtn.addEventListener('click', () => {
        currentPlayer = 'X';
        gameActive = true;
        gameState = ['', '', '', '', '', '', '', '', ''];
        status.textContent = `c'est à joueur ${currentPlayer}`;
        cells.forEach(cell => {
            cell.textContent = '';
        });
    });
});
