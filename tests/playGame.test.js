/**
 * Integration-style tests: these exercise playGame()/updateMessages()
 * against a real (jsdom) DOM, the same markup shape as index.html, and
 * check both the returned winner and the on-page text.
 */

function renderBoard() {
    document.body.innerHTML = `
        <button id="rockButton"></button>
        <button id="paperButton"></button>
        <button id="scissorsButton"></button>
        <p id="round">Round: 1</p>
        <p id="computerMove">Computer's move was: </p>
        <p id="winner">Winner:</p>
        <h3 id="scoreMessage">Player's Score: 0 Computer's Score: 0 </h3>
    `;
}

// Reload the module fresh for each test so playerScore/computerScore/round
// (which live in module-level closures) always start from zero, and so
// initGame() binds onclick handlers to *this* test's DOM elements.
function loadGame() {
    jest.resetModules();
    renderBoard();
    return require('../index.js');
}

describe('playGame (DOM integration)', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('a player win updates the score and winner text', () => {
        const { playGame } = loadGame();
        jest.spyOn(Math, 'random').mockReturnValue(0.99); // computer plays Scissors

        const winner = playGame('Rock'); // Rock beats Scissors

        expect(winner).toBe('player');
        expect(document.getElementById('winner').textContent).toBe('Winner: Player');
        expect(document.getElementById('scoreMessage').textContent).toBe(
            "Player's Score: 1 Computer's Score: 0"
        );
        expect(document.getElementById('computerMove').textContent).toBe(
            "Computer's move was: Scissors"
        );
    });

    test('a computer win updates the score and winner text', () => {
        const { playGame } = loadGame();
        jest.spyOn(Math, 'random').mockReturnValue(0.4); // computer plays Paper

        const winner = playGame('Rock'); // Paper beats Rock

        expect(winner).toBe('computer');
        expect(document.getElementById('winner').textContent).toBe('Winner: Computer');
        expect(document.getElementById('scoreMessage').textContent).toBe(
            "Player's Score: 0 Computer's Score: 1"
        );
    });

    test('a draw leaves the score unchanged and shows "Draw!"', () => {
        const { playGame } = loadGame();
        jest.spyOn(Math, 'random').mockReturnValue(0); // computer plays Rock

        const winner = playGame('Rock');

        expect(winner).toBe('draw');
        expect(document.getElementById('winner').textContent).toBe('Draw!');
        expect(document.getElementById('scoreMessage').textContent).toBe(
            "Player's Score: 0 Computer's Score: 0"
        );
    });

    test('round number increments after each play', () => {
        const { playGame } = loadGame();
        jest.spyOn(Math, 'random').mockReturnValue(0);

        expect(document.getElementById('round').textContent).toBe('Round: 1');
        playGame('Rock');
        expect(document.getElementById('round').textContent).toBe('Round: 2');
        playGame('Paper');
        expect(document.getElementById('round').textContent).toBe('Round: 3');
    });

    test('clicking a move button plays a round via initGame', () => {
        const { getState } = loadGame();
        jest.spyOn(Math, 'random').mockReturnValue(0.99); // computer plays Scissors

        document.getElementById('rockButton').click(); // Rock beats Scissors

        expect(getState().playerScore).toBe(1);
        expect(document.getElementById('winner').textContent).toBe('Winner: Player');
    });

    test('score accumulates correctly across multiple rounds', () => {
        const { playGame, getState } = loadGame();
        const randomValues = [0.99, 0.99, 0.4]; // Scissors, Scissors, Paper
        let call = 0;
        jest.spyOn(Math, 'random').mockImplementation(() => randomValues[call++]);

        playGame('Rock'); // player wins
        playGame('Rock'); // player wins
        playGame('Rock'); // computer wins (Paper beats Rock)

        expect(getState()).toMatchObject({ playerScore: 2, computerScore: 1, round: 4 });
    });
});
