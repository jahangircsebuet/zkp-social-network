(() => {
    "use strict";
    const e = new Set(["date", "datetime-local", "email", "month", "number", "password", "search", "tel", "text", "time", "url"]);
    class t extends HTMLElement {
        constructor() {
            var e, t, r;
            super(...arguments), e = this, r = {}, (t = function(e) {
                var t = function(e, t) {
                    if ("object" != typeof e || null === e) return e;
                    var r = e[Symbol.toPrimitive];
                    if (void 0 !== r) {
                        var i = r.call(e, "string");
                        if ("object" != typeof i) return i;
                        throw new TypeError("@@toPrimitive must return a primitive value.")
                    }
                    return String(e)
                }(e);
                return "symbol" == typeof t ? t : String(t)
            }(t = "errorStrings")) in e ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = r
        }
        connectedCallback() {
            this.input = this.querySelector(".validated-field__input"), this.inputWrapper = this.querySelector(".validated-field__input-wrapper"), this.errorMessage = this.ownerDocument.getElementById(this.errorId);
            try {
                Object.assign(this.errorStrings, JSON.parse(this.querySelector(".validated-field__error-strings")?.textContent || ""))
            } catch {}
            this.input?.addEventListener("input", (() => this.setErrorMessage())), this.input?.addEventListener("input", (() => this.setInputIsValid(!0))), this.input?.addEventListener("invalid", (e => this.toggleErrorMessage(e)))
        }
        get errorId() {
            return this.getAttribute("error-id")
        }
        get descriptorIdRefs() {
            return this.input?.getAttribute("aria-describedby")?.split(" ").filter(Boolean) || []
        }
        get isValid() {
            return "true" !== this.input?.getAttribute("aria-invalid")
        }
        toggleErrorMessage(e) {
            e.preventDefault();
            const t = this.getNormalizedValidationMessage(this.input),
                r = !t;
            this.setErrorMessage(t), this.focusOnError(r), this.setInputIsValid(r)
        }
        setErrorMessage(e) {
            e ? (this.getOrCreateErrorMessageElement(), this.errorMessage.textContent = e, this.errorMessage.classList.remove("display-none")) : this.errorMessage && (this.errorMessage.textContent = "", this.errorMessage.classList.add("display-none"))
        }
        setInputIsValid(e) {
            if (e === this.isValid) return;
            this.input?.classList.toggle("usa-input--error", !e), this.input?.setAttribute("aria-invalid", String(!e));
            const t = this.descriptorIdRefs.filter((e => e !== this.errorId));
            e || t.push(this.errorId), this.input?.setAttribute("aria-describedby", t.join(" "))
        }
        getNormalizedValidationMessage(e) {
            if (!e || e.validity.valid) return "";
            for (const t in e.validity)
                if ("valid" !== t && e.validity[t] && this.errorStrings[t]) return this.errorStrings[t];
            return e.validationMessage
        }
        getOrCreateErrorMessageElement() {
            return this.errorMessage || (this.errorMessage = this.ownerDocument.createElement("div"), this.errorMessage.classList.add("usa-error-message"), this.errorMessage.id = this.errorId, this.input && e.has(this.input.type) && (this.errorMessage.style.maxWidth = `${this.input.offsetWidth}px`), this.inputWrapper?.appendChild(this.errorMessage)), this.errorMessage
        }
        focusOnError(e) {
            e || document.activeElement?.classList.contains("usa-input--error") || this.input?.focus()
        }
    }
    customElements.get("lg-validated-field") || customElements.define("lg-validated-field", t)
})();