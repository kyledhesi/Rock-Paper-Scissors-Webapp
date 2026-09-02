/**
 * Unit tests for computerTurn(). Math.random is mocked so the outcome
 * is deterministic, plus a general test that unmocked calls always
 * produce a valid move.
 */
const { computerTurn, MOVES } = require('../index.js');

describe('computerTurn', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('returns Rock when Math.random resolves to the first move', () => {
        jest.spyOn(Math, 'random').mockReturnValue(0); // -> index 0
        expect(computerTurn()).toBe('Rock');
    });

    test('returns Paper when Math.random resolves to the second move', () => {
        jest.spyOn(Math, 'random').mockReturnValue(0.4); // -> index 1
        expect(computerTurn()).toBe('Paper');
    });

    test('returns Scissors when Math.random resolves to the third move', () => {
        jest.spyOn(Math, 'random').mockReturnValue(0.99); // -> index 2
        expect(computerTurn()).toBe('Scissors');
    });

    test('always returns one of the three valid moves', () => {
        for (let i = 0; i < 50; i++) {
            expect(MOVES).toContain(computerTurn());
        }
    });
});
