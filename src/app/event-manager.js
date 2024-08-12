import { Difficulty } from '../sudoku/difficulty.js';
import { PaperSize } from '../sudoku/paper-size.js';

const CONFIGURATION_CHANGE_EVENT_NAME = 'change-configuration';

const CONFIGURATION_KEY_PAPER_SIZE = 'paperSize';
const CONFIGURATION_KEY_DIFFICULTY = 'difficulty';
const CONFIGURATION_KEY_PUZZLE_COUNT = 'puzzleCount';
const CONFIGURATION_KEY_REQUIRE_SYMMETRY = 'requireSymmetry';
const CONFIGURATION_KEY_SHOW_SOLUTIONS = 'showSolutions';

/**
 * EventManager.
 *
 * The central hub for all event-driven functionality in the application.
 */
class EventManager {

    static publishStateChangeEvent(identifier, key, value, shadow) {
        const details = {
            key: key,
            value: value,
        };
        console.log(`[${identifier}] Dispatching '${CONFIGURATION_CHANGE_EVENT_NAME}' event with details`, details);
        shadow.dispatchEvent(new CustomEvent(CONFIGURATION_CHANGE_EVENT_NAME, {
            bubbles: true,
            composed: true,
            detail: details,
        }));
    }

    static addEventListener(handler) {
        document.addEventListener(CONFIGURATION_CHANGE_EVENT_NAME, event => {
            return handler(event);
        });
    }

    static adjustConfiguration(configuration, event) {
        const newConfig = configuration.copyOf();

        switch (event.detail.key) {
            case CONFIGURATION_KEY_PAPER_SIZE:
                newConfig.paperSize = new PaperSize(event.detail.value);
                break;
            case CONFIGURATION_KEY_DIFFICULTY:
                newConfig.difficulty = new Difficulty(event.detail.value);
                break;
            case CONFIGURATION_KEY_PUZZLE_COUNT:
                newConfig.puzzleCount = event.detail.value;
                break;
            case CONFIGURATION_KEY_REQUIRE_SYMMETRY:
                newConfig.requireSymmetry = event.detail.value;
                break;
            case CONFIGURATION_KEY_SHOW_SOLUTIONS:
                newConfig.showSolutions = event.detail.value;
                break;
            default:
                throw Error(`Event handling for type '${event.detail.key}' not implemented`);
        }

        return newConfig;
    }
}


export {
    EventManager,
    CONFIGURATION_KEY_PAPER_SIZE,
    CONFIGURATION_KEY_DIFFICULTY,
    CONFIGURATION_KEY_PUZZLE_COUNT,
    CONFIGURATION_KEY_REQUIRE_SYMMETRY,
    CONFIGURATION_KEY_SHOW_SOLUTIONS,
}