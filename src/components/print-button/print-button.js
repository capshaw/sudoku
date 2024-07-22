/**
 *
 */
class PrintButton extends HTMLElement {

    constructor() {
        super();
        this.shadow = this.attachShadow({
            mode: 'open',
        });
    }

    connectedCallback() {
        this.shadow.innerHTML = /* html */`
            <style>
                div {
                    position: fixed;
                    left: 20px;
                    bottom: 20px;
                    width: 240px;
                    background: #fff;
                    border-top: 1px solid #eee;
                    padding: 20px;
                    border-bottom-left-radius: 5px;
                    border-bottom-right-radius: 5px;
                    box-sizing: border-box;
                }

                button {
                    width: 100%;
                    height: 40px;
                    background: #000;
                    border: 1px solid #000;
                    color: #fff;
                    font-weight: bold;
                    border-radius: 5px;
                    transition: background-color 0.2s ease;
                    cursor: pointer;
                }

                button:hover {
                    background: #222222;
                }

                @media (max-width: 600px) {
                    div {
                        margin: 20px -20px -20px -20px;
                        position: unset;
                        width: auto;
                    }
                }
            </style>
            <div>
                <button onClick="print()">
                    Print
                </button>
            </div>
        `;
    }
}

export { PrintButton }