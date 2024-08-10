import {
    VIEWPORT_BREAK_WIDTH_PX,
    STANDARD_PADDING_PX,
    SIDEBAR_WIDTH_PX,
    STANDARD_BORDER_RADIUS_PX,
} from '../../constants.js';

/**
 * PrintButton.
 *
 * A button that invokes the browser's print() functionality when clicked. It is fixed in position
 * at the bottom left of the screen for large view ports and returns to a fluid position within
 * its parent container for small view ports. This element has no required observed attributes.
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
                @import "src/app/paper-sudoku.css";

                div {
                    position: fixed;
                    left: ${STANDARD_PADDING_PX}px;
                    bottom: ${STANDARD_PADDING_PX}px;

                    width: ${SIDEBAR_WIDTH_PX}px;
                    padding: ${STANDARD_PADDING_PX}px;
                    box-sizing: border-box;

                    background: #fff;
                    border-top: 1px solid #eee;
                    border-bottom-left-radius: ${STANDARD_BORDER_RADIUS_PX}px;
                    border-bottom-right-radius: ${STANDARD_BORDER_RADIUS_PX}px;
                }

                button {
                    width: 100%;
                    height: 40px;
                    background: #000;
                    border: 1px solid #000;
                    color: #fff;
                    font-weight: bold;
                    border-radius: ${STANDARD_BORDER_RADIUS_PX}px;
                    transition: background-color 0.2s ease;
                    cursor: pointer;
                }

                button:hover {
                    background: #222222;
                }

                /**
                 * At the viewport break point the div is no longer fixed but instead uses
                 * negative margins to expand to the edge of its parent container. This is done
                 * to draw the horizontal rule across the entire parent container, not juts its
                 * content width.
                 */
                @media (max-width: ${VIEWPORT_BREAK_WIDTH_PX}px) {
                    div {
                        margin:
                            ${STANDARD_PADDING_PX}px
                            -${STANDARD_PADDING_PX}px
                            -${STANDARD_PADDING_PX}px
                            -${STANDARD_PADDING_PX}px;
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