"use strict";
class CustomDialogElement extends HTMLElement {
    constructor() {
        var _a, _b;
        super();
        this.DialogOpenEvent = new CustomEvent("whenOpened", { cancelable: false, bubbles: false });
        this.DialogCloseEvent = new CustomEvent("whenClosed", { cancelable: false, bubbles: false });
        const t = document.createElement('template');
        this.shadow = this.attachShadow({ mode: "open" });
        this.open = false;
        this.hidden = true;
        (_a = this.id) !== null && _a !== void 0 ? _a : (this.id = `ariaDialog_no${(Array.from(document.body.querySelectorAll(':defined[role="dialog"]')).indexOf(this) + 1)}`);
        t.innerHTML = `
        <style>
        :host(:not([hidden])) {
            display:flex;
            position:fixed; top:0; left:0;
            width:100%; height:100%;
            background:rgba(0,0,0,0.5);
            z-index:80;
            align-items:center;
            justify-content:center;
            color:black;
        }
        
        :host .dialog-box {
            display:flex;
            flex-flow:column wrap;
            background-color:#efefef;
            min-width:60%;
            max-width:100%;
            min-height:400px;
            color:black;
        }


        :host .dialog-header {
            font-size:1.2em;
            padding:0.5em 1em;
        }
        :host .dialog-content{
            flex:1;
            padding:0.5em 1em;
        }

        :host .dialog-buttons{
            display:flex;
            align-self:center;
            justify-self:end;
            padding:1em 0;
            gap:1em;
        }
        
        ::slotted([slot="button-slot"]) {
            border:none; display:block;
            background-color:transparent;
            color:#000; padding:0.5em;
            font-size:1.3em;
            font-weight:bold;
            margin:0 1em;
        }
        @media (prefers-color-scheme:dark) {
            :host .dialog-box{
                background-color:#2a2a2a;
                color:white;
            }
            ::slotted([slot="button-slot"]) {
                color:#fff;
            }
        }
        </style>
        <div class="dialog-box" role="dialog" aria-modal="true" aria-describedby="main-content" aria-labelledby="header-title">
        <div class="dialog-header">
        <h3 id="header-title">
            <slot name="header-title">
                header-title 슬롯에 제목을 등록하세요.
            </slot>
        </h3>
        </div>
        <div id="main-content" class="dialog-content"><slot>content-slot 슬롯에 콘텐츠를 등록해주세요.</slot></div>
        <div class="dialog-buttons"><slot name="button-slot">
        </slot></div>
        </div>
        `;
        (_b = this.shadowRoot) === null || _b === void 0 ? void 0 : _b.append(t.content.cloneNode(true));
        if (!this.querySelector('[slot="button-slot"]')) {
            const ESSENTIAL_OKAY_BTN = document.createElement('button');
            ESSENTIAL_OKAY_BTN.innerText = "확인";
            ESSENTIAL_OKAY_BTN.classList.add('default', 'first-focus', 'last-focus', 'closer');
            ESSENTIAL_OKAY_BTN.slot = "button-slot";
            this.append(ESSENTIAL_OKAY_BTN);
        }
        const buttonSlot = this.shadow.querySelector('[name="button-slot"]');
        buttonSlot.addEventListener('slotchange', (evt) => {
            const t = evt.target;
            const assignedEls = t.assignedElements();
            assignedEls.forEach(_ => {
                _.classList.add('closer');
            });
        });
        [...this.querySelectorAll('[slot="button-slot"]')].forEach(_ => {
            _.addEventListener('click', (evt) => {
                this.open = false;
            });
        });
    }
    get dialogCaller() {
        return document.querySelector(`[aria-controls="${this.id}"]`);
    }
    // [Open Property]
    /** @param { boolean } B */
    set open(B) {
        this.toggleAttribute('open', B);
        if (B) {
            this.dispatchEvent(this.DialogOpenEvent);
        }
        else {
            this.dispatchEvent(this.DialogCloseEvent);
        }
    } /** @returns {boolean} */
    get open() {
        return this.hasAttribute('open');
    }
    set focusEntry(element) {
        this.focusables.forEach(_element => _element.classList.toggle('entry', _element === element));
    }
    get focusEntry() {
        return this.querySelector('.entry');
    }
    get defaultButton() {
        const _default = this.querySelector('[slot="button-slot"].default');
        return (_default ? _default : this.querySelectorAll('[slot="button-slot"]')[0]);
    }
    get focusables() {
        return [...this.querySelectorAll('button:not(:disabled),a[href],input:not([type="hidden"],:disabled), textarea:not(:disabled),details>summary,[tabindex="0"]')];
    }
    set firstFocusable(e) {
        this.focusables.forEach(el => el.classList.toggle('first-focus', e === el));
    }
    set lastFocusable(e) {
        this.focusables.forEach(el => el.classList.toggle('last-focus', e === el));
    }
    get firstFocusable() {
        const first = this.querySelector('.first-focus');
        return (first ? first : this.focusables[0]);
    }
    get lastFocusable() {
        const last = this.querySelector('.last-focus');
        return (last ? last : this.focusables[this.focusables.length - 1]);
    }
    static get observedAttributes() {
        return ["open"];
    }
    attributeChangedCallback(...args) {
        const [name, oldVal, newVal] = [...args];
        switch (name) {
            case "open":
                this.hidden = !(newVal === "");
                break;
        }
    }
    connectedCallback() {
        this.addEventListener('whenOpened', () => {
            if (this.focusEntry) {
                this.focusEntry.focus();
            }
            if (!this.focusEntry && this.firstFocusable) {
                this.firstFocusable.focus();
            }
            if (!this.focusEntry && !this.firstFocusable && this.focusables[0]) {
                this.focusables[0].focus();
            }
        });
        this.addEventListener('whenClosed', () => {
            if (this.dialogCaller) {
                this.dialogCaller.focus();
            }
        });
        this.addEventListener('keydown', (evt) => {
            if (!evt.shiftKey && evt.key === "Enter") {
                evt.preventDefault();
                this.defaultButton.click();
            }
            if (evt.key === "Escape") {
                this.open = false;
            }
        });
        this.firstFocusable.addEventListener('keydown', (evt) => {
            const target = evt.target;
            if (evt.shiftKey && evt.key === "Tab") {
                evt.preventDefault();
                this.lastFocusable ? this.lastFocusable.focus() : target.focus();
            }
        });
        this.lastFocusable.addEventListener('keydown', (evt) => {
            const target = evt.target;
            if (!evt.shiftKey && evt.key === "Tab") {
                evt.preventDefault();
                this.firstFocusable ? this.firstFocusable.focus() : target.focus();
            }
        });
    }
}
customElements.define("modal-dialog", CustomDialogElement);



