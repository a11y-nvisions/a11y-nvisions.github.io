(function (arr) {
    arr.forEach(function (item) {
      if (item.hasOwnProperty('prepend')) {
        return;
      }
      Object.defineProperty(item, 'prepend', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: function prepend() {
          var argArr = Array.prototype.slice.call(arguments),
            docFrag = document.createDocumentFragment();
  
          argArr.forEach(function (argItem) {
            var isNode = argItem instanceof Node;
            docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
          });
  
          this.insertBefore(docFrag, this.firstChild);
        }
      });
    });
})([Element.prototype, Document.prototype, DocumentFragment.prototype]);

function isMobile(){
	const UserAgent = navigator.userAgent;
	if (UserAgent.match(/iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) != null || UserAgent.match(/LG|SAMSUNG|Samsung/) != null)
	{
		return true;
	}else{
		return false;
	}
}

interface Element{
    setActivateEvent?:Function,
    getCustomClass?:any
}

function linkObjectToHTMLElement(element,obj){
    Object.defineProperty(element,"getCustomClass",{
        get:function(){
            return obj;
        }
    });
}

function linkPropertyToHTMLElement(element,obj,propName){
    Object.defineProperty(element,propName,obj);
}

const getIndexFrom=(arrObj,element)=>{
    return Array.prototype.indexOf.call(arrObj,element);
}

class Tree {
    public element:Element;
    public visibleItemList:[];
    public ListObserver:MutationObserver;
    private MutationConfig:MutationObserverInit;
    constructor(element:HTMLUListElement|Element){
        this.element = element;
        linkObjectToHTMLElement(this.element,this);
        this.MutationConfig = {
            subtree:true,
            attributeFilter:['aria-expanded','class'],
            attributes:true
        };
        this.initializeTreeItem();
        const this_ref = this;
        function itemDetectionCallback(){
            const ListAll = this_ref.getAllTreeItems;
            const visibles:[] = Array.prototype.filter.call(ListAll,function(e){
                const condition_target = e.getCustomClass.item_container.parentElement;
                const condition = (!condition_target.classList.contains('hide'));
                if(condition){
                    return e;
                }
            });
            return this_ref.visibleItems = visibles;
        }
        this.ListObserver = new MutationObserver(itemDetectionCallback)
        this.ListObserver.observe(this.element,this.MutationConfig);
        itemDetectionCallback();
        this.getBrowsedPonterElement ? this.setBrowsePointer = this.getBrowsedPonterIndex : this.setBrowsePointer = 0;
        const activeIndex = this.getBrowsedPonterIndex;
        
        if(!this.getDefaultActivatedElement){
            this.getAllTreeItems[activeIndex].getCustomClass.showPanel();
        }else{
            this.getDefaultActivatedElement.getCustomClass.showPanel();
        }

        this.element.addEventListener('focusin',function(e){
            this.element.classList.add('active-tree');
            if(!isMobile()){
                Tree.announceInteraction(e.type,e.target.getCustomClass?.contentPanel !== null);
            }
        }.bind(this));

        this.element.addEventListener('focusout',function(e){
            this.element.classList.remove('active-tree');
            if(!isMobile()){
                Tree.announceInteraction(e.type,e.target.getCustomClass?.contentPanel !== null);
            }
        }.bind(this));

        this.element.addEventListener('keydown',function(e){
            const code = e.code;
            const item_visible = this.getVisibleItemList;
            const item_all = this.getAllTreeItems;
            const v_idx = getIndexFrom(item_visible,this.getBrowsedPonterElement);
            const KEY_PREV_TREE_ITEM = "ArrowUp";
            const KEY_NEXT_TREE_ITEM = "ArrowDown";
            const KEY_FIRST_TREE_ITEM = "Home";
            const KEY_LAST_TREE_ITEM = "End";
            const KEY_GO_TO_TREE = "F6";

            switch(code){
                case KEY_NEXT_TREE_ITEM:
                    if(item_visible[v_idx+1]){
                        this.moveBrowsePointerAndFocus = getIndexFrom(item_all,item_visible[v_idx+1]);
                    }
                break;
                case KEY_PREV_TREE_ITEM:
                    if(item_visible[v_idx-1]){
                        this.moveBrowsePointerAndFocus = getIndexFrom(item_all,item_visible[v_idx-1]);
                    }
                break;
                case KEY_FIRST_TREE_ITEM:
                    this.moveBrowsePointerAndFocus = 0;
                break;
                case KEY_LAST_TREE_ITEM:
                    this.moveBrowsePointerAndFocus = getIndexFrom(item_all,item_visible[item_visible.length-1]);
                break;
                case KEY_GO_TO_TREE:
                    if(e.ctrlKey && !e.shiftKey){
                        const pointer = this.getBrowsedPonterElement.getCustomClass;
                        if(pointer.contentPanel){
                            pointer.contentPanel.focus();
                        }
                    }
                break;
            }
        }.bind(this))
    }

    public set setBrowsePointer(index:number){
        for(let i=0; i<this.getAllTreeItems.length; i++){
            if(index === i){
                this.getAllTreeItems[i].classList.add('browsed-pointer');
                this.getAllTreeItems[i].setAttribute('tabindex','0');
            }else{
                this.getAllTreeItems[i].classList.remove('browsed-pointer');
                this.getAllTreeItems[i].setAttribute('tabindex','-1');
            }
        }
    }

    public set moveBrowsePointerAndFocus(index:number){
        this.setBrowsePointer = index;
        if(this.getBrowsedPonterElement){
            this.getBrowsedPonterElement.focus();
        }
    }

    public get getBrowsedPonterElement(){
        return this.element.querySelector('.browsed-pointer') as HTMLElement;
    }

    public get getBrowsedPonterIndex(){
        return getIndexFrom(this.getAllTreeItems,this.element.querySelector('.browsed-pointer'));
    }

    public set visibleItems(a:[]){
        this.visibleItemList = a;
    }

    public get getAllTreeItems(){
        return this.element.querySelectorAll('[role="treeitem"]');
    }

    public get getVisibleItemList(){
        return this.visibleItemList;
    }


    public static announce(Text:string){
        let timer;
        clearTimeout(timer);
        Tree.UrgentAnnouncerElement.innerHTML=Text;
        timer = setTimeout(()=>{
            Tree.UrgentAnnouncerElement.innerHTML="";
        },500)
    }

    public static announceInteraction(eventTypeString:string,isContentAvailable=false){
        let timer;
        if(eventTypeString === 'focusin' ){
            if(isContentAvailable){
                timer = setTimeout(()=>{
                    Tree.AnnouncerElement.innerHTML=Tree.setContentAvailableMessage;
                },1000)
            }
            timer = setTimeout(() => {
                Tree.AnnouncerElement.innerHTML=Tree.setInteractionTipMessage;
            },1500);
        }
        if(eventTypeString === 'focusout'){
            Tree.AnnouncerElement.innerHTML="";
            clearTimeout(timer);
        }
    }

    get getDefaultActivatedElement(){
        return this.element.querySelector('[aria-current="page"],[aria-current="true"],[aria-current="location"]');
    }

    public static setContentAvailableMessage:string = "";
    public static setContentLoadedMessage:string = "";
    public static setInteractionTipMessage:string = "";
    public static AnnouncerElement:HTMLElement;
    public static UrgentAnnouncerElement:HTMLElement;

    public static collection:Tree[] = [];

    public addTreeview(Element:HTMLUListElement){
        if(Element.getAttribute('role') === 'tree'){
            Tree.collection.push(new Tree(Element));
        }
    }
    public removeTreeview(TreeObject:Tree){
        const idx = getIndexFrom(Tree.collection,TreeObject);
        if(idx > -1){
            TreeObject.element.parentElement.removeChild(TreeObject.element);
            Tree.collection.splice(idx,idx);
        }
    }

    public static startReconfiguration(){
        //reset array for preventing the bugs
        const body = document.body;
        const expected_element = body.querySelectorAll('ul[role="tree"]');
        Tree.AnnouncerElement = document.createElement('div');
        Tree.AnnouncerElement.classList.add('liveForA11y','delayed');
        Tree.AnnouncerElement.setAttribute('aria-live','polite');
        Tree.AnnouncerElement.setAttribute('aria-relevant','text');
        Tree.UrgentAnnouncerElement = document.createElement('div');
        Tree.UrgentAnnouncerElement.classList.add('liveForA11y','urgent');
        Tree.UrgentAnnouncerElement.setAttribute('aria-live','polite');
        Tree.UrgentAnnouncerElement.setAttribute('aria-relevant','text');
        Tree.collection = [];
        for(let i=0; i<expected_element.length; i++){
            const element = expected_element[i];
            Tree.collection[i] = new Tree(element);
        }
        document.body.appendChild(Tree.AnnouncerElement);
        document.body.appendChild(Tree.UrgentAnnouncerElement);
    }

    initializeTreeItem(){
        for(let i=0; i<this.getAllTreeItems.length; i++){
            const el = new TreeItemElement(this.getAllTreeItems[i],this);
        }
    }
}

abstract class TreeItemContext {
    public item_container:HTMLLIElement;
    public item_element:Element|HTMLElement;
    public SubTree:SubTreeList;
    public iconElement:Element;
    public TreeContext:Tree;
    constructor(element:Element|HTMLElement,TreeContext:Tree){
        const this_ref = this;
        this.TreeContext = TreeContext;
        this.item_element = element;
        this.checkMarkupValidation ? 
        this.item_container = this.item_element.parentElement as HTMLLIElement : null;
        this.addEssentialEvents();
        this.iconElement = document.createElement('span');
        this.iconElement.classList.add('icon-visible-only');
        this.iconElement.setAttribute('aria-hidden','true');
        this.item_element.prepend(this.iconElement);
        linkPropertyToHTMLElement(this.ItemElement,{
                set (cb:Function){
                    this_ref.setActivateEvent = cb
                }
        },"setActivateEvent");
        this.panelElementInitialize();
    }

    private addEssentialEvents(){
        this.ItemElement.addEventListener('click',function(e){
            e.preventDefault();
            this.TreeContext.moveBrowsePointerAndFocus = getIndexFrom(this.TreeContext.getAllTreeItems,this.ItemElement);
        }.bind(this))
        
        if(this.hasSubTree){

            if(!isMobile()){
                this.ItemElement.addEventListener('dblclick',function(){
                    this.state_expand = !this.state_expand;
                }.bind(this));
            }
            if(isMobile()){
                this.ItemElement.addEventListener('click',function(){
                    this.state_expand = !this.state_expand;
                }.bind(this));
            }

            this.ItemElement.addEventListener('keydown',function(e){
                const code = e.code;
                const KEY_EXPAND_SUB = 'ArrowRight';
                const KEY_COLLAPSE_SUB = 'ArrowLeft';
                switch(code){
                    case KEY_EXPAND_SUB:
                        if(!this.state_expand){
                            this.state_expand = true;
                        }else{
                            this.TreeContext.moveBrowsePointerAndFocus = getIndexFrom(this.TreeContext.getAllTreeItems,this.ItemElement)+1;
                        }
                        break;
                    case KEY_COLLAPSE_SUB:
                        if(this.state_expand){
                            e.stopImmediatePropagation();
                            this.state_expand = false;
                        }
                        break;
                }
            }.bind(this));
        }

        this.setActivateEvent = function(){}
    }

    public get contentPanel(){
        const ContentId = this.ItemElement.getAttribute('aria-controls');
        const Element = document.getElementById(ContentId);
        return Element ? Element : null;
    }

    panelElementInitialize(){
        if(this.contentPanel){
            if(!isMobile()){
                this.contentPanel.setAttribute('tabindex','0');
            }
            this.contentPanel.setAttribute('role','region');
            this.contentPanel.setAttribute('aria-roledescription',', treeview document');
            if(this.TreeContext.element.hasAttribute('aria-label')){
                this.contentPanel.setAttribute('aria-label',this.TreeContext.element.getAttribute('aria-label'));
            }
            
        }
    }

    showPanel(){
        for(let i=0; i<this.TreeContext.getAllTreeItems.length; i++){
            const element = this.TreeContext.getAllTreeItems[i];
            if(getIndexFrom(this.TreeContext.getAllTreeItems,this.ItemElement) !== i){
                element.getCustomClass?.contentPanel?.classList.add('hide');
                element.setAttribute('aria-current','false');
            }else{
                if(this.TreeContext.getAllTreeItems[i].getCustomClass?.contentPanel){
                    if(!isMobile()){
                        Tree.announce(Tree.setContentLoadedMessage);
                    }
                    element.setAttribute('aria-current','page');
                }

                element.getCustomClass?.contentPanel?.classList.remove('hide');
            }
        }
    }

    public set setActivateEvent(callback){
        this.ItemElement.addEventListener('click',function(){
                if(!this.contentPanel){
                    callback();
                }
                this.showPanel();
            }.bind(this));
        }

    public get checkMarkupValidation(){
        return this.item_element.parentElement instanceof HTMLLIElement;
    }

    public get getSubTreeListElement(){
        if(this.hasSubTree){
            return this.ItemElement.parentElement.querySelector(':scope ul');
        }
    }

    public setSubTree (SubTreeListElement:HTMLUListElement){
        if(this.hasSubTree){
            this.SubTree = new SubTreeList(SubTreeListElement,this);
        }
    }

    public get hasSubTree(){
        const ExpectedSubTree = this.item_container.querySelector(':scope ul');
        if(ExpectedSubTree){
            return true;
        }else{
            return false;
        }
    }

    get ItemElement(){
        return this.item_element as HTMLElement;
    }

    public get state_expand(){
        if(this.hasSubTree){
            return this.item_element.getAttribute('aria-expanded') === 'true' ? true : false;
        }
    }

    public set state_expand(v:boolean){
        if(this.hasSubTree){
            this.item_element.setAttribute('aria-expanded',String(v))
            this.getSubTreeListElement.classList.toggle('hide',!v);
            if(v){
                this.iconElement.classList.add('expanded');
                this.iconElement.classList.remove('collapsed');
            }else{
                this.iconElement.classList.add('collapsed');
                this.iconElement.classList.remove('expanded');
            }
        }
    }
}

class TreeItemElement extends TreeItemContext {
    constructor(item:Element,Tree:Tree){
        super(item,Tree);
        this.TreeContext = Tree;
        this.item_element = item;
        this.state_expand = this.state_expand;
        linkObjectToHTMLElement(this.item_element,this);
        this.item_container = this.item_element.parentElement as HTMLLIElement;
        this.item_container.setAttribute('role','none');
        this.setSubTree(this.getSubTreeListElement as HTMLUListElement);
    }
}

class SubTreeList {
    public ParentObject: TreeItemElement; 
    public SubListElement:HTMLUListElement;
    constructor(Element:HTMLUListElement,Parent:TreeItemElement){
        this.ParentObject = Parent;
        this.SubListElement = Element;
        this.SubListElement.setAttribute('role','group');
        this.SubListElement.addEventListener('keydown',function(e){
            const code = e.code;
            if(code === 'ArrowLeft'){
                e.stopPropagation();
                this.GoToParent();
            }
        }.bind(this))
    }
    
    GoToParent(){
        this.ParentObject.TreeContext.moveBrowsePointerAndFocus = getIndexFrom(this.ParentObject.TreeContext.getAllTreeItems,this.ParentObject.ItemElement);
    }
}