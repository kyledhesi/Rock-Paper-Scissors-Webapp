// Rock Paper Scissors game logic

const MOVES = ['Rock', 'Paper', 'Scissors'];

let playerScore = 0;
let computerScore = 0;
let computerMove;
let round = 1;

// Picks a random move for the computer and stores it in computerMove.
function computerTurn() {
    computerMove = MOVES[Math.floor(Math.random() * MOVES.length)];
    console.log('Computers move is ' + computerMove);
    return computerMove;
}

// Pure function: given both moves, returns 'player', 'computer', or 'draw'.
// Kept side-effect free so it's easy to unit test in isolation.
function determineWinner(playerMove, cpuMove) {
    const beats = {
        Rock: 'Scissors',
        Paper: 'Rock',
        Scissors: 'Paper',
    };

    if (playerMove === cpuMove) {
        return 'draw';
    }

    return beats[playerMove] === cpuMove ? 'player' : 'computer';
}

// Plays one round: rolls the computer's move, works out the winner,
// updates scores/round, and refreshes the DOM. Returns the winner so
// callers (and tests) can assert on the outcome without reading the DOM.
function playGame(playerMove) {
    computerTurn();
    const winner = determineWinner(playerMove, computerMove);

    if (winner === 'computer') {
        computerScore += 1;
    } else if (winner === 'player') {
        playerScore += 1;
    }

    updateMessages(winner);
    round++;

    return winner;
}

function updateMessages(winner) {
    document.getElementById('round').textContent = `Round: ${round}`;
    document.getElementById('computerMove').textContent = `Computer's move was: ${computerMove}`;
    document.getElementById('scoreMessage').textContent = `Player's Score: ${playerScore} Computer's Score: ${computerScore}`;

    if (winner === 'computer') {
        document.getElementById('winner').textContent = `Winner: Computer`;
    } else if (winner === 'player') {
        document.getElementById('winner').textContent = `Winner: Player`;
    } else if (winner === 'draw') {
        document.getElementById('winner').textContent = `Draw!`;
    }
}

// Resets in-memory game state. Mainly useful so tests start from a clean
// slate without having to reload the whole module.
function resetGame() {
    playerScore = 0;
    computerScore = 0;
    computerMove = undefined;
    round = 1;
}

// Wires up the three move buttons. Safe to call even if some/all of the
// buttons aren't present in the DOM (e.g. in a test environment).
function initGame() {
    const rockButton = document.getElementById('rockButton');
    const paperButton = document.getElementById('paperButton');
    const scissorsButton = document.getElementById('scissorsButton');

    if (rockButton) rockButton.onclick = () => playGame('Rock');
    if (paperButton) paperButton.onclick = () => playGame('Paper');
    if (scissorsButton) scissorsButton.onclick = () => playGame('Scissors');
}

if (typeof document !== 'undefined') {
    initGame();
}

// Export for Node/Jest. Guarded so this is a no-op in the browser.
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MOVES,
        computerTurn,
        determineWinner,
        playGame,
        updateMessages,
        resetGame,
        initGame,
        getState: () => ({ playerScore, computerScore, computerMove, round }),
    };
}
