/**
 *
 */
 class Input extends HTMLElement {

    constructor() {
        super();
        this.shadow = this.attachShadow({
            mode: 'open',
        });
    }

    getValue() {
        throw Error("`getValue()` not implemented in abstract class");
    }

    getSelectorKey() {
        throw Error("`getSelectorKey()` not implemented in abstract class");
    }

    getSelectorValue(selector) {
        throw Error("`getSelectorValue()` not implemented in abstract class");
    }

    getInputRender() {
        throw Error("`getInputRender()` not implemented in abstract class");
    }

    attributeChangedCallback(property, oldValue, newValue) {
        if (oldValue === newValue) {
            return;
        }

        this[property] = newValue;

        if (property == 'value') {
            this.shadow.dispatchEvent(new CustomEvent('change-configuration', {
                bubbles: true,
                composed: true,
                detail: {
                    key: this.name,
                    value: this.getValue(),
                },
            }));
        }
    }

    connectedCallback() {
        this.shadow.innerHTML = this.#renderCSS() + this.getInputRender();
        const selector = this.shadow.querySelector(this.getSelectorKey());
        selector.addEventListener('change', e => {
            this.setAttribute('value', this.getSelectorValue(selector));
        });
    }

    #renderCSS() {
        return /* html */`
            <style>
                label {
                    display: block;
                    margin-top: 20px;
                    font-weight: bold;
                }

                label small {
                    display: inline-block;
                    margin-top: 5px;
                    font-weight: normal;
                }

                input[type=number],
                select {
                    width: 100%;
                    padding: 7px;
                    margin-top: 5px;
                    box-sizing: border-box;
                    border: 1px solid #000;
                    border-radius: 5px;
                    -webkit-appearance: none;

                    &:focus {
                        border: 1px solid rgb(110, 110, 255);
                        outline: none;
                    }
                }
            </style>`;
    }
}

export { Input }