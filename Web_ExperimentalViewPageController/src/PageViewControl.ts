import { toArray } from "lodash";

enum ORIENTATION {
    HORIZONTAL = "horizontal",
    VERTICAL = "vertical"
}

export type MixinConstructor<T = {}&HTMLElement> = new (...args: any[]) => T;

const MIXIN_RANGEABE = <T extends MixinConstructor>( base:T ) => class extends base {
    InteractionKeys?:PageViewKeyboardInteraction
    constructor ( ...args:any[]) {
        super(...args);
    }
    get step ()  :number {
        const step = Number(this.getAttribute('step'));
        if (isNaN(step)){
            return 0;
        }
        return step;
    }set step(v:number|null) {
        if (v){
            this.setAttribute('step',String(v));
        } else {
            this.removeAttribute('step');
        }
    }

    get max() :number {
        const max = Number(this.getAttribute('max'));
        if (isNaN(max)){ 
            return 0;
        }
        return max;
    }
    set max(v:number|null){
        if (v){
            this.setAttribute('max',String(v));
        } else {
            this.removeAttribute('max');
        }
    }

    get min() :number {
        const min = Number(this.getAttribute('min'));
        if (isNaN(min)) {
            return 0;
        }
        return min;
    }set min(v:number|null){
        if (v) {
            this.setAttribute('min',String(v));
        } else {
            this.removeAttribute('min');
        }
    }

    get valueNow():number {
        const value = Number(this.getAttribute('value'));
        if( !isNaN(value) ){ 
            return value;
        }
        return 0;
    }
    set valueNow ( v:number|null ) {
        if ( v ) {               

            this.setAttribute('value',v.toString())

            if (v > this.max) {
                this.setAttribute('value',this.max.toString())
            }
            else if (v < this.min) {
                this.setAttribute('value',this.min.toString())
            }

            if (this.closest('pageview-list')?.querySelectorAll("pageview-content")[v-1]) {
                const page = (this.parentElement?.querySelectorAll("pageview-content")[v-1] as PageViewContent);
                page.show = true;
                this.parentElement?.querySelectorAll("pageview-content").forEach(_=>{
                    if(_ !== page){
                        (_ as PageViewContent).show = false;
                    }
                })
            }

            const adjustor = this.parentElement?.querySelector('pageview-adjustor') as PageAdjustable;
                adjustor.dots.forEach((el,idx)=>{
                    el.classList.toggle('current',adjustor.dots[this.valueNow-1] === el);
                })
        }
    }

    static get observedAttribute(){
        return ['min','max','step','value'];
    }
};

class PageViewKeyboardInteraction {
    orientation:ORIENTATION
    constructor(CONTROL_ORIENTATION:ORIENTATION){
        this.orientation = CONTROL_ORIENTATION;
    }

    get KEY_TURN_PAGE (  ) {
        switch ( this.orientation ) {
            case ORIENTATION.VERTICAL:
                return {
                    DECREASE:"ArrowUp",
                    INCREASE:"ArrowDown"
                }
            case ORIENTATION.HORIZONTAL:
                return {
                    DECREASE:"ArrowLeft",
                    INCREASE:"ArrowRight",
                }
            default:
                return {
                    DECREASE:"ArrowUp",
                    INCREASE:"ArrowDown"
                }
        }
    }
}

export class PageAdjustable extends MIXIN_RANGEABE(HTMLElement) {
    orientation:ORIENTATION;
    InteractionKeys:PageViewKeyboardInteraction;
    PageDescriber:HTMLElement
    A11ySlider:HTMLInputElement;

    constructor(){
        super();
        this.orientation = ORIENTATION.HORIZONTAL;
        this.setAttribute("role","none");
        this.A11ySlider = document.createElement('input') as HTMLInputElement;
        this.A11ySlider.type = "range";
        this.A11ySlider.setAttribute('tabindex','0');
        this.A11ySlider.setAttribute('role','slider');
        this.A11ySlider.setAttribute('aria-label','페이지');
        this.A11ySlider.setAttribute('aria-roledescription','조절 가능');

        this.InteractionKeys = new PageViewKeyboardInteraction(this.orientation);
        this.PageDescriber = document.createElement('div');
        this.PageDescriber.id = "adjustor-no"+(document.querySelectorAll('pageview-adjustor').length+1);
        this.PageDescriber.style.display="none";
        this.append(this.A11ySlider,this.PageDescriber);
    }

    get PageController(){
        if (this.parentElement?.tagName.toLocaleLowerCase() === "pageview-list"){
            return this.parentElement as PageViewController
        }
    }

    get dots() {
        return toArray<HTMLElement>(this.querySelectorAll<HTMLElement>('.indicator-dot'))
    }

    setDots (len:number = this.max){
        const  DotClickHandler = (evt:MouseEvent) =>{
            const target = (evt.target as HTMLElement);
            const index = this.dots.indexOf(target) +1;
            if (index >= this.min || index <= this.max){
                this.valueNow = index;
            }
            target.classList.add('current');
            this.dots.forEach((el:HTMLElement)=>{
                if (el !== target){
                    el.classList.remove('current');
                }
            })
        }

        if(this.dots.length > 0){
            this.dots.forEach((el:HTMLElement)=>{
                el.remove()
            });
        }
        const temp = [];
        for (let i = 0; i < len; i++) {
            const dot = document.createElement('div');
            dot.classList.add('indicator-dot');
            dot.setAttribute('aria-hidden','true');
            dot.setAttribute('role','none');
            if ( this.valueNow-1 === i ){
                dot.classList.add('current');
            } else {
                dot.classList.remove('current');
            }
            temp.push(dot)
            dot.addEventListener('click',DotClickHandler);
        }
        this.append(...temp);
    }

    attributeChangedCallback(name:any,ovalue:any,nValue:any) {
        switch (name) {
            case "value":
                if (nValue){
                    this.A11ySlider.setAttribute('aria-valuenow',String(this.valueNow));
                    this.A11ySlider.setAttribute('value',String(this.valueNow));
                    this.A11ySlider.setAttribute('aria-valuetext',`${this.max} 페이지 중 ${this.valueNow} 페이지`);
                    this.PageDescriber.innerHTML= String(this.A11ySlider.getAttribute('aria-valuetext'));
                }
                break;
            case "step":
                if (nValue){
                    this.A11ySlider.setAttribute('step',String(this.step));
                    this.A11ySlider.setAttribute('aria-valuetext',`${this.max} 페이지 중 ${this.valueNow} 페이지`);
                    this.PageDescriber.innerHTML= String(this.A11ySlider.getAttribute('aria-valuetext'));
                }
                break;
            case "max":
                if (nValue){
                    this.A11ySlider.setAttribute('aria-valuemax',String(this.max));
                    this.A11ySlider.setAttribute('max',String(this.max));
                    this.A11ySlider.setAttribute('aria-valuetext',`${this.max} 페이지 중 ${this.valueNow} 페이지`);
                    this.PageDescriber.innerHTML= String(this.A11ySlider.getAttribute('aria-valuetext'));
                }
                break;
            case "min":
                if (nValue){
                    this.A11ySlider.setAttribute('aria-valuemin',String(this.min));
                    this.A11ySlider.setAttribute('min',String(this.min));
                    this.A11ySlider.setAttribute('aria-valuetext',`${this.max} 페이지 중 ${this.valueNow} 페이지`);
                    this.PageDescriber.innerHTML= String(this.A11ySlider.getAttribute('aria-valuetext'));
                }
            break;
        }
    }
    
    static get observedAttributes (  ){
        if (super.observedAttribute){
            return ["value-text"].concat(super.observedAttribute);
        }
        return ['value-text'];
    }
}

export class PageViewContent extends HTMLElement {
    index:number;
    constructor(){
        super();
        this.index=toArray<HTMLElement>(this.PageController.pages as NodeListOf<HTMLElement>).indexOf(this);
        let hintElement = document.querySelector("#page-sr-hint") as HTMLElement;
        if ( !hintElement ){
            hintElement = (document.createElement('span') as HTMLElement);
            hintElement.innerHTML = ", 가상커서를 끄고 방향키로 페이지를 넘길 수 있어요.";
            hintElement.style.display="none";
            hintElement.id = "page-sr-hint";
            document.body.appendChild(hintElement);
        }
        this.setAttribute('role',"region");
        this.setAttribute('tabindex','0');
        this.setAttribute('aria-roledescription','페이지 콘텐츠');
        this.setAttribute('aria-describedby',this.PageControlIndicator.PageDescriber?.id+" page-sr-hint");
    }

    get show () {
        return this.hasAttribute('show');
    }
    set show(b:boolean) {
        this.toggleAttribute('show',b);
    }

    get PageController(){
        return this.closest('pageview-list') as PageViewController
    }

    get PageControlIndicator () {
        return this.PageController.PageAdjustor;
    }

    get nextPage(){
        return this.PageController.querySelectorAll('pageview-content')[this.index+1] as PageViewContent;
    }
    get previousPage(){
        return this.PageController.querySelectorAll('pageview-content')[this.index-1] as PageViewContent;
    }

    connectedCallback() {
        this.addEventListener('keydown',(evt:KeyboardEvent)=>{
            const keys = this.PageControlIndicator.InteractionKeys.KEY_TURN_PAGE;
            switch (evt.key) {
                case keys.INCREASE:
                    this.PageControlIndicator.valueNow = this.PageControlIndicator.valueNow+1
                    this.nextPage?.focus();
                    break;
                case keys.DECREASE:
                    this.PageControlIndicator.valueNow = this.PageControlIndicator.valueNow-1
                    this.previousPage?.focus();
                    break;
            }
        })
    }
}

export class PageViewController extends HTMLElement {
    root:ShadowRoot;
    PageAdjustor:PageAdjustable
    template:HTMLTemplateElement;
    constructor(){
        super();
        this.orientation ??= ORIENTATION.HORIZONTAL;
        this.setAttribute("role","none");
        this.root = this.attachShadow({mode:"open"});
        this.template = document.createElement('template');
        this.template.innerHTML = `
        <div part="content-box">
            <slot name="pages"></slot>
        </div>
        <slot name="indicator"></slot>
        `;
        this.root.append(this.template.content.cloneNode(true));
        
        
        this.PageAdjustor = document.createElement('pageview-adjustor') as PageAdjustable;
        this.PageAdjustor.orientation = this.orientation;
        this.PageAdjustor.slot = "indicator";
        this.appendChild( this.PageAdjustor );
    }

    get currentPageElement():HTMLElement|null {
        return this.pages[this.PageAdjustor.valueNow] as HTMLElement
    }

    get pages(){
        return this.querySelectorAll('pageview-content');
    }

    get orientation (  ):ORIENTATION {
        return this.getAttribute('orientation') as ORIENTATION;
    }

    set orientation ( ORIENTATION:ORIENTATION ) {
        this.setAttribute('orientation',ORIENTATION);
    }

    updatePages() {
        this.pages.forEach(_=>{
            _.slot = "pages";
            this.PageAdjustor.max = this.pages.length;
            this.PageAdjustor.setDots();
        });
    }
    
    connectedCallback(){
        customElements.whenDefined("pageview-adjustor").then(_=>{
            this.updatePages();
            this.PageAdjustor.min = 1;
            this.PageAdjustor.step = 1; 
            this.PageAdjustor.valueNow = 1;
            this.PageAdjustor.A11ySlider.addEventListener('input',( evt )=>{
                const target = (evt.target as HTMLInputElement);
                this.PageAdjustor.valueNow = Number(target.value);
            })
            this.PageAdjustor.A11ySlider.addEventListener('change',( evt )=>{
                const target = (evt.target as HTMLInputElement);
                this.PageAdjustor.valueNow = Number(target.value);
            })
        })
    }
}
