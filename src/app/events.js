import { Difficulty } from "../sudoku/difficulty.js";
import { PaperSize } from "../sudoku/paper-size.js";

const CONFIGURATION_CHANGE_EVENT_NAME = 'change-configuration';

class EventManager {
    /**
     *
     **/
    static adjustConfiguration(configuration, event) {
        const newConfig = configuration.copyOf();

        // TODO: make these constants
        switch (event.detail.key) {
            case 'paperSize':
                newConfig.paperSize = new PaperSize(event.detail.value);
                break;
            case 'difficulty':
                newConfig.difficulty = new Difficulty(event.detail.value);
                break;
            case 'puzzleCount':
                newConfig.puzzleCount = event.detail.value;
                break;
            case 'requireSymmetry':
                newConfig.requireSymmetry = event.detail.value;
                break;
            case 'showSolutions':
                newConfig.showSolutions = event.detail.value;
                break;
            default:
                throw Error(`Event handling for type '${event.detail.key}'' not implemented`);
        }

        return newConfig;
    }
}


export { EventManager, CONFIGURATION_CHANGE_EVENT_NAME }