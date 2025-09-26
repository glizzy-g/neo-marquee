/**
 * @author Glizzy G <gliccy.g@outlook.com>
 * @copyright Glizzy G 2025. Freely under GPLv3.
 * 
 */

/**
 * Replacement for deprecated <marquee>
 *
 * @class NeoMarquee
 * @typedef {NeoMarquee}
 * @extends {HTMLElement}
 */
class NeoMarquee extends HTMLElement {
    /**
     * Creates an instance of NeoMarquee.
     *
     * @constructor
     */
    constructor() {
        super();

        /**
         * @member {number} scrollRate - Rate at which the display should scroll.
         * @public
         */
        this.scrollRate = 1.0;
        /**
         * @member {number} scrollPosition - Current position of scroll.
         * @private
         */
        this.scrollPosition = 0;

        /**
         * @member {HTMLDivElement} bezel - Marquee border
         * @private
         */
        this.bezel;
        /**
         * @member {HTMLSpanElement} display - Moves along marquee
         * @private
         */
        this.display;

        /**
         * @member {Event} onoverflow - Occurs when display flows out of view
         */
        this.onoverflow = new Event("overflow");
    }

    connectedCallback() {
        // Border around moving text to hide overflow
        this.bezel = document.createElement("div");
        this.bezel.style.overflow = "hidden";

        // Creates a span for each item in the list
        this.display = document.createElement("span");
        this.display.style.position = "relative";
        this.display.style.left = this.scrollPosition.toString() + "px";

        // Transfers root innerHTML to display.
        this.display.innerHTML = this.innerHTML;
        this.innerHTML = "";

        // Attach to DOM
        this.bezel.appendChild(this.display);
        this.appendChild(this.bezel);
    }

    /**
     * Update frame
     *
     * @param {number} [factor=1] - Factor to multiply movement by. Mainly an interface to pass delta time for consistent movement speed.
     */
    update(factor = 1) {
        // Calculate scroll position internally
        this.scrollPosition -= (this.scrollRate * factor);

        // Reset scroll position after disappearing.
        // This should work fine with long freeze times (i.e. put the scroll in the expected position as if it were running smoothly)
        if (this.scrollPosition < 0 - this.display.offsetWidth) {
            this.scrollPosition = this.bezel.offsetWidth + ((this.scrollPosition + this.display.offsetWidth) % this.bezel.offsetWidth);
            this.dispatchEvent(this.onoverflow);
        }

        // Update actual scroll position
        this.display.style.left = this.scrollPosition.toString() + "px";
    }
}

export default NeoMarquee;