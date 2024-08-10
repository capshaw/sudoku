import { Input } from './input.js';

/**
 * InputNumeric.
 *
 * A numeric input item in the application configuration. This element has five required observed
 * attributes: name, header, min, max, and value.
 *
 * @attribute name   The programmatic identifier of the element
 * @attribute header The label text for the InputNumeric
 * @attribute min    The minimum allowable value for the input
 * @attribute max    The maximum allowable value for the input
 * @attribute value  The default/current value of the InputNumeric
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