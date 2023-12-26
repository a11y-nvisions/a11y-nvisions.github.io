(function () {
    'use strict';

    function patch() {
        if (!Object.hasOwn(ShadowRoot.prototype, "getSelection")) {
            ShadowRoot.prototype.getSelection = function () {
                return document.getSelection();
            };
        }
    }
    patch();
    class TextField extends HTMLElement {
        #_shadow;
        #_internals;
        static get formAssociated() {
            return true;
        }
        static get observedAttributes() {
            return ["disabled", "placeholder", "invalid", "readonly", "required"];
        }
        constructor() {
            super();
            this.#_shadow = this.attachShadow({ mode: "open", delegatesFocus: true });
            this.#_internals = this.attachInternals();
            const template = document.createElement("template");
            template.innerHTML = `
        <style>
        :host {
            display:inline-flex;
            width:fit-content; height:1.5rem;
            position:relative; gap:0.2rem;
            align-items:center; margin:0.5rem 0;
        }

        #label { font-weight:bold; }
        
        #box {
            display:inline-flex; border-radius:0.25rem;
            border:solid 0.1rem #000; overflow:hidden;
            width:10rem; min-height:100%; position:relative; padding:0.2rem;
        }
        :host([disabled]) #box {background-color:#e8e8e8; }
        :host([disabled]) #placeholder {color:#afafaf;}
        :host([disabled]) #textfield {
            appearance:textfield;
        }
        #placeholder {position:absolute; top:50%;
            left:0; z-index:0; transform:translateY(-50%);
            user-select:none; cursor:default; color:#878787;
            text-indent:0.2rem;
        }

        #textfield:focus { outline:none; }
        :host:focus-within { outline:auto; }
        #textfield {
            position:relative;
            min-width:100%; min-height:100%;
            overflow:hidden; white-space:nowrap;
        }
        #textfield *{padding:0; margin:0; display:inline;}
        #textfield div { display:inline; }
        #textfield br { display:none; }
        #textfield :is(b,i,u) {  font-weight:normal; text-decoration:none; font-style:normal; }
        
        
        </style>
        <div id="label" part="label"><slot>Unlabelled</slot></div>
        <div id="box">
            <div id="textfield"
            contenteditable
            aria-labelledby="label"></div>
            <span
            part="placeholder"
            id="placeholder" aria-hidden="true"></span>
        </div>`;
            this.#_shadow.appendChild(template.content.cloneNode(true));
        }
        get #_fieldInner() { return this.#_shadow.querySelector("#textfield"); }
        get #_placeholder() { return this.#_shadow.querySelector("#placeholder"); }
        #_togglePlaceholder() {
            if ((this.#_fieldInner.textContent ?? "").length > 0) {
                this.#_placeholder.style.display = "none";
            }
            else {
                this.#_placeholder.style.display = "";
            }
        }
        get invalid() { return this.getAttribute("invalid"); }
        set invalid(v) { this.setAttribute("invalid", v); this.#_fieldInner.ariaInvalid = v; }
        get value() { return this.getAttribute('value'); }
        set value(str) {
            this.#_fieldInner.textContent = str;
        }
        get placeholder() { return this.getAttribute('placeholder'); }
        set placeholder(str) {
            if (str.length > 0) {
                this.setAttribute('placeholder', str);
                this.#_fieldInner.ariaPlaceholder = str;
                this.#_placeholder.textContent = str;
            }
            else {
                this.removeAttribute("placeholder");
            }
        }
        get disabled() { return this.hasAttribute('disabled'); }
        set disabled(v) {
            this.toggleAttribute("disabled", v);
            this.#_fieldInner.ariaDisabled = String(v);
            this.#_fieldInner.toggleAttribute("contentEditable", !v);
        }
        get required() { return this.hasAttribute('required'); }
        set required(v) {
            this.toggleAttribute("required", v);
            this.#_fieldInner.ariaRequired = String(v);
        }
        get readOnly() { return this.hasAttribute('readonly'); }
        set readOnly(v) {
            this.toggleAttribute("readonly", v);
            this.#_fieldInner.ariaReadOnly = String(v);
            this.#_togglePlaceholder();
        }
        attributeChangedCallback(name, o, n) {
            if (name == "disabled") {
                this.disabled = this.disabled;
            }
            if (name == "required") {
                this.required = this.required;
            }
            if (name == "readonly") {
                this.readOnly = this.readOnly;
            }
            if (name == "placeholder") {
                this.#_fieldInner.ariaPlaceholder = n ?? "";
                this.#_placeholder.textContent = n ?? "";
            }
            if (name == "invalid") {
                this.#_fieldInner.ariaInvalid = n ?? "";
            }
        }
        connectedCallback() {
            this.#_fieldInner.role = "textbox";
            this.#_fieldInner.ariaMultiLine = String(false);
            this.#_fieldInner.addEventListener('paste', (evt) => {
                evt.preventDefault();
                if (!this.readOnly) {
                    let paste = evt.clipboardData?.getData("text/plain");
                    paste?.replaceAll("\n", " ");
                    const selection = this.#_shadow.getSelection();
                    if (!selection?.rangeCount)
                        return;
                    selection.deleteFromDocument();
                    selection.getRangeAt(0).insertNode(document.createTextNode(paste ?? ""));
                    selection.collapseToEnd();
                    this.#_togglePlaceholder();
                }
            });
            this.#_fieldInner.addEventListener('input', (evt) => {
                const selection = this.#_shadow.getSelection();
                this.#_togglePlaceholder();
                if (this.readOnly && selection) {
                    const offset = selection.focusOffset;
                    if (typeof offset == "number") {
                        const range = selection.getRangeAt(0);
                        range.setStart(this.#_fieldInner.childNodes[0], offset - 1);
                        range.setEnd(this.#_fieldInner.childNodes[0], offset);
                        range.deleteContents();
                    }
                }
            });
            this.#_fieldInner.addEventListener("focusin", () => {
                const selection = this.#_shadow.getSelection();
                selection?.selectAllChildren(this.#_fieldInner);
            });
            this.#_fieldInner.addEventListener('keydown', (evt) => {
                if (evt.code == "Enter") {
                    evt.preventDefault();
                }
                if (this.readOnly) {
                    if (/^(\s|Backspace)$/.test(evt.key)) {
                        evt.preventDefault();
                    }
                    if (!evt.ctrlKey && /^\S$/.test(evt.key)) {
                        evt.preventDefault();
                    }
                }
            });
            customElements.whenDefined("text-field").then(_ => {
                this.placeholder = this.placeholder ?? "";
                this.disabled = this.disabled;
                this.value = this.value;
                this.readOnly = this.readOnly;
                this.required = this.required;
                this.#_fieldInner.ariaInvalid = this.invalid ?? "false";
            });
        }
    }
    customElements.define("text-field", TextField);

})();
