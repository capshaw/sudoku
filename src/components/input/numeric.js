import { Input } from "./input.js";

/**
 * Represents a numeric input item in our configuration.
 */
class InputNumeric extends Input {

    static get observedAttributes() {
        return [
            'name',
            'header',
            'min',
            'max',
            'value',
        ];
    }

    getValue() {
        return Number(this.value);
    }

    getSelectorKey() {
        return 'input';
    }

    getSelectorValue(selector) {
        return selector.value;
    }

    getInputRender() {
        return /* html */`
            <label for="${this.name}">
                ${this.header}
                <input id="${this.name}" type="number" min="${this.min}" max="${this.max}" value="${this.value}"/>
            </label>
        `;
    }
}

export { InputNumeric };