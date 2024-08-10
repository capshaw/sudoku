import {
    VIEWPORT_BREAK_WIDTH_PX,
    STANDARD_PADDING_PX,
    SIDEBAR_WIDTH_PX,
    Z_INDEX_LOADING_INDICATOR,
 } from '../../constants.js';

/**
 * LoadingIndicator.
 *
 * A simple static component that indicates that the application is loading between configuration
 * changes. The current build of this indicator only covers the output (and not the configuration
 * panel) for large view ports but covers the entire screen for small view ports. The class has
 * no required observed attributes.
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
                @import 'src/app/paper-sudoku.css';

                div {
                    background: url('src/app/components/loading-indicator/loading-indicator.gif') no-repeat center center;
                    backdrop-filter: blur(5px);
                    position: fixed;
                    left: ${SIDEBAR_WIDTH_PX + STANDARD_PADDING_PX}px;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    z-index: ${Z_INDEX_LOADING_INDICATOR};
                }

                @media (max-width: ${VIEWPORT_BREAK_WIDTH_PX}px) {
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