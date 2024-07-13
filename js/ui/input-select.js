import { Input } from "./input.js";

/**
 * Represents a single select item in the configuration
 *
 * TODO: the options 'api' here is suboptimal. Figure out how to do this better
 */
class InputSelect extends Input {

    static get observedAttributes() {
        return [
            'name',
            'header',
            'options',
            'value',
        ];
    }

    getValue() {
        return this.value;
    }

    getSelectorKey() {
        return 'select';
    }

    getSelectorValue(selector) {
        return selector.value;
    }

    connectedCallback() {
        const options = this.options.split(',').map((option) => /* html */ `
            <option value="${option}" ${option == this.value ? 'selected' : ''}>${option}</option>
        `).join('');

        this.renderInput(/* html */`
            <label for="${this.name}">
                ${this.header}
                <select id="${this.name}">
                    ${options}
                </select>
            </label>
        `);
    }
}

export { InputSelect };