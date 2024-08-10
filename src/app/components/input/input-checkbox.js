import { Input } from './input.js';

/**
 * InputCheckbox.
 *
 * A binary input item in the application configuration. This element has five required observed
 * attributes: name, header, summary, value.
 *
 * @attribute name    The programmatic identifier of the element
 * @attribute header  The label text for the InputNumeric
 * @attribute summary Additional descriptive text to explain what the input does
 * @attribute value   The default/current value of the input
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
                <input id="${this.name}" type="checkbox" ${this.getValue() ? 'checked' : ''} /> ${this.header}<br>
                <small>${this.summary}</small>
            </label>
        `;
    }
}

export { InputCheckbox };