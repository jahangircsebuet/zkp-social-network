(() => {
    "use strict";
    class t extends HTMLElement {
        connectedCallback() {
            this.form?.addEventListener("submit", (() => this.activate()))
        }
        get form() {
            return this.closest("form")
        }
        get button() {
            return this.querySelector("button")
        }
        activate() {
            this.button.classList.add("usa-button--active"), this.button.disabled = !0
        }
    }
    customElements.get("lg-submit-button") || customElements.define("lg-submit-button", t)
})();