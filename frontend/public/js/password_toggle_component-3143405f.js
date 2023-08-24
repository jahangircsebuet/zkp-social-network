(() => {
    "use strict";
    let t;
    class e extends HTMLElement {
        connectedCallback() {
            this.toggle.addEventListener("change", (() => this.setInputType())), this.toggle.addEventListener("click", (() => this.trackToggleEvent())), this.setInputType()
        }
        get toggle() {
            return this.querySelector(".password-toggle__toggle")
        }
        get input() {
            return this.querySelector(".password-toggle__input")
        }
        setInputType() {
            this.input.type = this.toggle.checked ? "text" : "password"
        }
        trackToggleEvent() {
            !async function(e, n) {
                const o = function(e) {
                    if (void 0 === t) try {
                        t = JSON.parse(document.querySelector("[data-config]")?.textContent || "")
                    } catch {
                        t = {}
                    }
                    return t.analyticsEndpoint
                }();
                o && await fetch(o, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        event: "Show Password button clicked",
                        payload: n
                    })
                }).catch((() => {}))
            }(0, {
                path: window.location.pathname
            })
        }
    }
    customElements.get("lg-password-toggle") || customElements.define("lg-password-toggle", e)
})();