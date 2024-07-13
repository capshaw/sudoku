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

    renderInput(inputHTML) {
        this.shadow.innerHTML = this.#renderCSS() + inputHTML;
        const selector = this.shadow.querySelector(this.getSelectorKey());
        selector.addEventListener('change', e => {
            this.setAttribute('value', this.getSelectorValue(selector));
        });
    }

    #renderCSS() {
        return /* html */ `
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

                select {
                    -moz-appearance: none;
                    -webkit-appearance: none;
                    appearance: none;

                    background-color: #fff;
                    background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23000000%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E');
                    background-repeat: no-repeat;
                    background-position: right .7em top 50%;
                    background-size: .65em auto;
                }
            </style>`;
    }
}

export { Input }