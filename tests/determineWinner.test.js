/**
 * Unit tests for the pure game-logic function determineWinner().
 * These don't touch the DOM at all, so they run fast and cover
 * every possible Rock/Paper/Scissors matchup.
 */
const { determineWinner } = require('../index.js');

describe('determineWinner', () => {
    test.each([
        ['Rock', 'Scissors', 'player'],
        ['Paper', 'Rock', 'player'],
        ['Scissors', 'Paper', 'player'],
    ])('player wins with %s vs %s', (playerMove, computerMove, expected) => {
        expect(determineWinner(playerMove, computerMove)).toBe(expected);
    });

    test.each([
        ['Rock', 'Paper', 'computer'],
        ['Paper', 'Scissors', 'computer'],
        ['Scissors', 'Rock', 'computer'],
    ])('computer wins with %s vs %s', (playerMove, computerMove, expected) => {
        expect(determineWinner(playerMove, computerMove)).toBe(expected);
    });

    test.each([
        ['Rock', 'Rock'],
        ['Paper', 'Paper'],
        ['Scissors', 'Scissors'],
    ])('%s vs %s is a draw', (playerMove, computerMove) => {
        expect(determineWinner(playerMove, computerMove)).toBe('draw');
    });
});
