import { Input } from "./input.js";

/**
 * Represents a binary input item in our configuration.
 */
class InputCheckbox extends Input {

    static get observedAttributes() {
        return [
            'name',
            'header',
            'summary',
            'value',
        ];
    }

    getValue() {
        return this.value == 'true';
    }

    getSelectorKey() {
        return 'input';
    }

    getSelectorValue(selector) {
        return selector.checked;
    }

    getInputRender() {
        return /* html */`
            <label for="${this.name}">
                <input id="${this.name}" type="checkbox" checked="${this.value}"/> ${this.header}<br>
                <small>${this.summary}</small>
            </label>
        `;
    }
}

export { InputCheckbox };