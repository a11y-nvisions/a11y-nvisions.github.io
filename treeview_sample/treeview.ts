function isMobile(){
	const UserAgent = navigator.userAgent;
	if (UserAgent.match(/iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) != null || UserAgent.match(/LG|SAMSUNG|Samsung/) != null)
	{
		return true;
	}else{
		return false;
	}
}

const linkObjectToHTMLElement = function(element,obj){
    Object.defineProperty(element,"getCustomClass",{
        get:function(){
            return obj;
        }
    });
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
        const ref_this = this;
        function itemDetectionCallback(){
            const ListAll = ref_this.getAllTreeItems;
            const visibles:[] = Array.prototype.filter.call(ListAll,function(e){
                const condition_target = e.getCustomClass.item_container.parentElement;
                const condition = (!condition_target.classList.contains('hide'))
                if(condition){
                    return e;
                }
            });
            ref_this.visibleItems = visibles;
        }
        this.ListObserver = new MutationObserver(itemDetectionCallback)
        this.ListObserver.observe(this.element,this.MutationConfig);
        itemDetectionCallback();
        this.setBrowsePointer = 0;
        
        this.element.addEventListener('focusin',function(){
            this.element.classList.add('active-tree');
        }.bind(this));

        this.element.addEventListener('focusout',function(){
            this.element.classList.remove('active-tree');
        }.bind(this));

        this.element.addEventListener('keydown',function(e){
            const code = e.code;
            const item_visible = this.getVisibleItemList;
            const item_all = this.getAllTreeItems;
            const v_idx = getIndexFrom(item_visible,this.getBrowsedFocusPointer);
            
            const KEY_PREV_TREE_ITEM = "ArrowUp";
            const KEY_NEXT_TREE_ITEM = "ArrowDown";
            const KEY_FIRST_TREE_ITEM = "Home";
            const KEY_LAST_TREE_ITEM = "End";
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
                    this.moveBrowsePointerAndFocus = item_all.length-1;
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
        if(this.getBrowsedFocusPointer){
            this.getBrowsedFocusPointer.focus();
        }
    }

    public get getBrowsedFocusPointer(){
        return this.element.querySelector('.browsed-pointer') as HTMLElement;
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

    static collection:Tree[] = [];

    static startReconfiguration(){
        
        //reset array for preventing the bugs
        const body = document.body;
        const expected_element = body.querySelectorAll('ul[role="tree"]');
        Tree.collection = [];
        for(let i=0; i<expected_element.length; i++){
            const element = expected_element[i];
            Tree.collection[i] = new Tree(element);
        }

    }

    initializeTreeItem(){
        for(let i=0; i<this.getAllTreeItems.length; i++){
            new TreeItemElement(this.getAllTreeItems[i],this);
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
        this.item_element = element;
        this.checkMarkupValidation ? 
        this.item_container = this.item_element.parentElement as HTMLLIElement : null;
        this.addEssentialEvents();
        this.iconElement = document.createElement('span');
        this.iconElement.classList.add('icon-visible-only');
        this.iconElement.setAttribute('aria-hidden','true');
        this.item_element.prepend(this.iconElement);
    }

    private addEssentialEvents(){
        this.ItemElement.addEventListener('click',function(){
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
            this.iconElement.classList.toggle('expanded',v);
            this.iconElement.classList.toggle('collapsed',!v);
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

Tree.startReconfiguration();