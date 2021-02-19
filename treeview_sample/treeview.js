var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
                var argArr = Array.prototype.slice.call(arguments), docFrag = document.createDocumentFragment();
                argArr.forEach(function (argItem) {
                    var isNode = argItem instanceof Node;
                    docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
                });
                this.insertBefore(docFrag, this.firstChild);
            }
        });
    });
})([Element.prototype, Document.prototype, DocumentFragment.prototype]);
function isMobile() {
    var UserAgent = navigator.userAgent;
    if (UserAgent.match(/iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) != null || UserAgent.match(/LG|SAMSUNG|Samsung/) != null) {
        return true;
    }
    else {
        return false;
    }
}
function linkObjectToHTMLElement(element, obj) {
    Object.defineProperty(element, "getCustomClass", {
        get: function () {
            return obj;
        }
    });
}
function linkPropertyToHTMLElement(element, obj, propName) {
    Object.defineProperty(element, propName, obj);
}
var getIndexFrom = function (arrObj, element) {
    return Array.prototype.indexOf.call(arrObj, element);
};
var Tree = /** @class */ (function () {
    function Tree(element) {
        this.element = element;
        linkObjectToHTMLElement(this.element, this);
        this.MutationConfig = {
            subtree: true,
            attributeFilter: ['aria-expanded', 'class'],
            attributes: true
        };
        this.initializeTreeItem();
        var this_ref = this;
        function itemDetectionCallback() {
            var ListAll = this_ref.getAllTreeItems;
            var visibles = Array.prototype.filter.call(ListAll, function (e) {
                var condition_target = e.getCustomClass.item_container.parentElement;
                var condition = (!condition_target.classList.contains('hide'));
                if (condition) {
                    return e;
                }
            });
            this_ref.visibleItems = visibles;
        }
        this.ListObserver = new MutationObserver(itemDetectionCallback);
        this.ListObserver.observe(this.element, this.MutationConfig);
        itemDetectionCallback();
        this.getBrowsedFocusPointer ? this.setBrowsePointer = getIndexFrom(this.getAllTreeItems, this.getBrowsedFocusPointer) : this.setBrowsePointer = 0;
        var activeIndex = this.getBrowsedFocusPointer ? getIndexFrom(this.getAllTreeItems, this.getBrowsedFocusPointer) : 0;
        this.getAllTreeItems[activeIndex].getCustomClass.showPanel();
        this.element.addEventListener('focusin', function (e) {
            var _a;
            this.element.classList.add('active-tree');
            Tree.announceInteraction(e.type, ((_a = e.target.getCustomClass) === null || _a === void 0 ? void 0 : _a.contentPanel) !== null);
        }.bind(this));
        this.element.addEventListener('focusout', function (e) {
            var _a;
            this.element.classList.remove('active-tree');
            Tree.announceInteraction(e.type, ((_a = e.target.getCustomClass) === null || _a === void 0 ? void 0 : _a.contentPanel) !== null);
        }.bind(this));
        this.element.addEventListener('keydown', function (e) {
            var code = e.code;
            var item_visible = this.getVisibleItemList;
            var item_all = this.getAllTreeItems;
            var v_idx = getIndexFrom(item_visible, this.getBrowsedFocusPointer);
            clearTimeout();
            var KEY_PREV_TREE_ITEM = "ArrowUp";
            var KEY_NEXT_TREE_ITEM = "ArrowDown";
            var KEY_FIRST_TREE_ITEM = "Home";
            var KEY_LAST_TREE_ITEM = "End";
            var KEY_GO_TO_TREE = "F6";
            switch (code) {
                case KEY_NEXT_TREE_ITEM:
                    if (item_visible[v_idx + 1]) {
                        this.moveBrowsePointerAndFocus = getIndexFrom(item_all, item_visible[v_idx + 1]);
                    }
                    break;
                case KEY_PREV_TREE_ITEM:
                    if (item_visible[v_idx - 1]) {
                        this.moveBrowsePointerAndFocus = getIndexFrom(item_all, item_visible[v_idx - 1]);
                    }
                    break;
                case KEY_FIRST_TREE_ITEM:
                    this.moveBrowsePointerAndFocus = 0;
                    break;
                case KEY_LAST_TREE_ITEM:
                    this.moveBrowsePointerAndFocus = item_all.length - 1;
                    break;
                case KEY_GO_TO_TREE:
                    if (e.ctrlKey && !e.shiftKey) {
                        var pointer = this.getBrowsedFocusPointer.getCustomClass;
                        if (pointer.contentPanel) {
                            pointer.contentPanel.focus();
                        }
                    }
                    break;
            }
        }.bind(this));
    }
    Object.defineProperty(Tree.prototype, "setBrowsePointer", {
        set: function (index) {
            for (var i = 0; i < this.getAllTreeItems.length; i++) {
                if (index === i) {
                    this.getAllTreeItems[i].classList.add('browsed-pointer');
                    this.getAllTreeItems[i].setAttribute('tabindex', '0');
                }
                else {
                    this.getAllTreeItems[i].classList.remove('browsed-pointer');
                    this.getAllTreeItems[i].setAttribute('tabindex', '-1');
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Tree.prototype, "moveBrowsePointerAndFocus", {
        set: function (index) {
            this.setBrowsePointer = index;
            if (this.getBrowsedFocusPointer) {
                this.getBrowsedFocusPointer.focus();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Tree.prototype, "getBrowsedFocusPointer", {
        get: function () {
            return this.element.querySelector('.browsed-pointer');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Tree.prototype, "visibleItems", {
        set: function (a) {
            this.visibleItemList = a;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Tree.prototype, "getAllTreeItems", {
        get: function () {
            return this.element.querySelectorAll('[role="treeitem"]');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Tree.prototype, "getVisibleItemList", {
        get: function () {
            return this.visibleItemList;
        },
        enumerable: false,
        configurable: true
    });
    Tree.announce = function (Text) {
        var timer;
        clearTimeout(timer);
        Tree.UrgentAnnouncerElement.innerHTML = Text;
        timer = setTimeout(function () {
            Tree.UrgentAnnouncerElement.innerHTML = "";
        }, 500);
    };
    Tree.announceInteraction = function (eventTypeString, isContentAvailable) {
        if (isContentAvailable === void 0) { isContentAvailable = false; }
        var timer;
        if (eventTypeString === 'focusin') {
            if (isContentAvailable) {
                timer = setTimeout(function () {
                    Tree.InteractionTipElement.innerHTML = Tree.ContentAvailableText;
                }, 1000);
            }
            timer = setTimeout(function () {
                Tree.InteractionTipElement.innerHTML = Tree.TipText;
            }, 1500);
        }
        if (eventTypeString === 'focusout') {
            Tree.InteractionTipElement.innerHTML = "";
            clearTimeout(timer);
        }
    };
    Tree.startReconfiguration = function () {
        //reset array for preventing the bugs
        var body = document.body;
        var expected_element = body.querySelectorAll('ul[role="tree"]');
        Tree.InteractionTipElement = document.createElement('div');
        Tree.InteractionTipElement.classList.add('liveForA11y');
        Tree.InteractionTipElement.setAttribute('aria-live', 'polite');
        Tree.InteractionTipElement.setAttribute('aria-relevant', 'text');
        Tree.UrgentAnnouncerElement = document.createElement('div');
        Tree.UrgentAnnouncerElement.classList.add('liveForA11y');
        Tree.UrgentAnnouncerElement.setAttribute('aria-live', 'polite');
        Tree.UrgentAnnouncerElement.setAttribute('aria-relevant', 'text');
        Tree.collection = [];
        for (var i = 0; i < expected_element.length; i++) {
            var element = expected_element[i];
            Tree.collection[i] = new Tree(element);
        }
        document.body.appendChild(Tree.InteractionTipElement);
        document.body.appendChild(Tree.UrgentAnnouncerElement);
    };
    Tree.prototype.initializeTreeItem = function () {
        for (var i = 0; i < this.getAllTreeItems.length; i++) {
            var el = new TreeItemElement(this.getAllTreeItems[i], this);
        }
    };
    Tree.TipText = "";
    Tree.ContentAvailableText = "";
    Tree.collection = [];
    return Tree;
}());
var TreeItemContext = /** @class */ (function () {
    function TreeItemContext(element, TreeContext) {
        var this_ref = this;
        this.TreeContext = TreeContext;
        this.item_element = element;
        this.checkMarkupValidation ?
            this.item_container = this.item_element.parentElement : null;
        this.addEssentialEvents();
        this.iconElement = document.createElement('span');
        this.iconElement.classList.add('icon-visible-only');
        this.iconElement.setAttribute('aria-hidden', 'true');
        this.item_element.prepend(this.iconElement);
        linkPropertyToHTMLElement(this.ItemElement, {
            set: function (cb) {
                this_ref.setActiveEvent = cb;
            }
        }, "setActiveEvent");
        this.panelElementInitialize();
    }
    TreeItemContext.prototype.addEssentialEvents = function () {
        this.ItemElement.addEventListener('click', function (e) {
            e.preventDefault();
            this.TreeContext.moveBrowsePointerAndFocus = getIndexFrom(this.TreeContext.getAllTreeItems, this.ItemElement);
        }.bind(this));
        if (this.hasSubTree) {
            if (!isMobile()) {
                this.ItemElement.addEventListener('dblclick', function () {
                    this.state_expand = !this.state_expand;
                }.bind(this));
            }
            if (isMobile()) {
                this.ItemElement.addEventListener('click', function () {
                    this.state_expand = !this.state_expand;
                }.bind(this));
            }
            this.ItemElement.addEventListener('keydown', function (e) {
                var code = e.code;
                var KEY_EXPAND_SUB = 'ArrowRight';
                var KEY_COLLAPSE_SUB = 'ArrowLeft';
                switch (code) {
                    case KEY_EXPAND_SUB:
                        if (!this.state_expand) {
                            this.state_expand = true;
                        }
                        else {
                            this.TreeContext.moveBrowsePointerAndFocus = getIndexFrom(this.TreeContext.getAllTreeItems, this.ItemElement) + 1;
                        }
                        break;
                    case KEY_COLLAPSE_SUB:
                        if (this.state_expand) {
                            e.stopImmediatePropagation();
                            this.state_expand = false;
                        }
                        break;
                }
            }.bind(this));
        }
        this.setActiveEvent = function () { };
    };
    Object.defineProperty(TreeItemContext.prototype, "contentPanel", {
        get: function () {
            var ContentId = this.ItemElement.getAttribute('aria-controls');
            var Element = document.getElementById(ContentId);
            return Element ? Element : null;
        },
        enumerable: false,
        configurable: true
    });
    TreeItemContext.prototype.panelElementInitialize = function () {
        if (this.contentPanel) {
            this.contentPanel.setAttribute('tabindex', '0');
            this.contentPanel.setAttribute('role', 'region');
            this.contentPanel.setAttribute('aria-roledescription', ', treeview document');
            if (this.TreeContext.element.hasAttribute('aria-label')) {
                this.contentPanel.setAttribute('aria-label', this.TreeContext.element.getAttribute('aria-label'));
            }
        }
    };
    TreeItemContext.prototype.showPanel = function () {
        var _a, _b, _c, _d;
        for (var i = 0; i < this.TreeContext.getAllTreeItems.length; i++) {
            var element = this.TreeContext.getAllTreeItems[i];
            if (getIndexFrom(this.TreeContext.getAllTreeItems, this.ItemElement) !== i) {
                (_b = (_a = element.getCustomClass) === null || _a === void 0 ? void 0 : _a.contentPanel) === null || _b === void 0 ? void 0 : _b.classList.add('hide');
                element.setAttribute('aria-current', 'false');
            }
            else {
                if (this.TreeContext.getAllTreeItems[i].getCustomClass.contentPanel) {
                    Tree.announce("Panel document Loaded");
                    element.setAttribute('aria-current', 'page');
                }
                (_d = (_c = element.getCustomClass) === null || _c === void 0 ? void 0 : _c.contentPanel) === null || _d === void 0 ? void 0 : _d.classList.remove('hide');
            }
        }
    };
    Object.defineProperty(TreeItemContext.prototype, "setActiveEvent", {
        set: function (callback) {
            this.ItemElement.addEventListener('click', function () {
                if (!this.contentPanel) {
                    callback();
                }
                this.showPanel();
            }.bind(this));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TreeItemContext.prototype, "checkMarkupValidation", {
        get: function () {
            return this.item_element.parentElement instanceof HTMLLIElement;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TreeItemContext.prototype, "getSubTreeListElement", {
        get: function () {
            if (this.hasSubTree) {
                return this.ItemElement.parentElement.querySelector(':scope ul');
            }
        },
        enumerable: false,
        configurable: true
    });
    TreeItemContext.prototype.setSubTree = function (SubTreeListElement) {
        if (this.hasSubTree) {
            this.SubTree = new SubTreeList(SubTreeListElement, this);
        }
    };
    Object.defineProperty(TreeItemContext.prototype, "hasSubTree", {
        get: function () {
            var ExpectedSubTree = this.item_container.querySelector(':scope ul');
            if (ExpectedSubTree) {
                return true;
            }
            else {
                return false;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TreeItemContext.prototype, "ItemElement", {
        get: function () {
            return this.item_element;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TreeItemContext.prototype, "state_expand", {
        get: function () {
            if (this.hasSubTree) {
                return this.item_element.getAttribute('aria-expanded') === 'true' ? true : false;
            }
        },
        set: function (v) {
            if (this.hasSubTree) {
                this.item_element.setAttribute('aria-expanded', String(v));
                this.getSubTreeListElement.classList.toggle('hide', !v);
                if (v) {
                    this.iconElement.classList.add('expanded');
                    this.iconElement.classList.remove('collapsed');
                }
                else {
                    this.iconElement.classList.add('collapsed');
                    this.iconElement.classList.remove('expanded');
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    return TreeItemContext;
}());
var TreeItemElement = /** @class */ (function (_super) {
    __extends(TreeItemElement, _super);
    function TreeItemElement(item, Tree) {
        var _this = _super.call(this, item, Tree) || this;
        _this.TreeContext = Tree;
        _this.item_element = item;
        _this.state_expand = _this.state_expand;
        linkObjectToHTMLElement(_this.item_element, _this);
        _this.item_container = _this.item_element.parentElement;
        _this.item_container.setAttribute('role', 'none');
        _this.setSubTree(_this.getSubTreeListElement);
        return _this;
    }
    return TreeItemElement;
}(TreeItemContext));
var SubTreeList = /** @class */ (function () {
    function SubTreeList(Element, Parent) {
        this.ParentObject = Parent;
        this.SubListElement = Element;
        this.SubListElement.setAttribute('role', 'group');
        this.SubListElement.addEventListener('keydown', function (e) {
            var code = e.code;
            if (code === 'ArrowLeft') {
                e.stopPropagation();
                this.GoToParent();
            }
        }.bind(this));
    }
    SubTreeList.prototype.GoToParent = function () {
        this.ParentObject.TreeContext.moveBrowsePointerAndFocus = getIndexFrom(this.ParentObject.TreeContext.getAllTreeItems, this.ParentObject.ItemElement);
    };
    return SubTreeList;
}());
Tree.startReconfiguration();
Tree.TipText = "You're in the Treeview, navigate with the Arrow keys.";
Tree.ContentAvailableText = "Content's Available. Press Enter key to display at the panel area and then press the arrow down to leave the tree-view area and try to read the panel";
