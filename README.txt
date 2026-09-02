# Rock Paper Scissors Game

A simple Rock Paper Scissors game built with HTML, CSS, and JavaScript.

## Getting Started

1. **Clone or download** the repository.
2. **Open** `index.html` in your web browser to start playing.

## Features

- Play against the computer.
- Game result displayed after each round.

## Usage

- Click on **Rock**, **Paper**, or **Scissors** to make your move.
- The computer will make a random choice.
- The winner of the round will be displayed.

## Running the tests

The game logic in `index.js` is unit tested with Jest (using jsdom to
simulate the DOM). To run the tests locally:

1. Install [Node.js](https://nodejs.org/) (includes npm).
2. From the project folder, install dependencies:
   npm install
3. Run the test suite:
   npm test

   Or, for a coverage report:
   npm run test:coverage

Tests live in the `tests/` folder:
- `determineWinner.test.js` - pure win/lose/draw logic, all 9 matchups.
- `computerTurn.test.js` - random move selection (mocked and unmocked).
- `playGame.test.js` - full round flow against a real DOM, including
  score tracking, round counting, and button clicks.

