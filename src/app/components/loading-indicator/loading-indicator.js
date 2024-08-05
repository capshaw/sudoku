/**
 * A simple static component that indicates that the application is loading between configuration
 * changes.
 */
class LoadingIndicator extends HTMLElement {

    constructor() {
        super();
        this.shadow = this.attachShadow({
            mode: 'open',
        });
    }

    connectedCallback() {
        this.shadow.innerHTML = /* html */`
            <style>
                @import "src/app/paper-sudoku.css";

                div {
                    background: url('src/app/components/loading-indicator/loading-indicator.gif') no-repeat center center;
                    backdrop-filter: blur(5px);
                    position: fixed;
                    left: 260px;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    z-index: 10;
                }

                @media (max-width: 600px) {
                    div {
                        background: rgba(240, 240, 240, 0.8) url('src/app/components/loading-indicator/loading-indicator.gif') no-repeat center center;
                        left: 0;
                    }
                }
            </style>
            <div></div>
        `;
    }
}

export { LoadingIndicator }