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
var ToArray = function (arr) {
    var EmptyArray = [];
    for (var i = 0; i < arr.length; i++) {
        EmptyArray[i] = arr[i];
    }
    return EmptyArray;
};
//Code usage Example is at bottom of this code document
//common constructor
var CustomFormElement = /** @class */ (function () {
    function CustomFormElement(element) {
        var __this__ = this; // Temp
        this.ELEMENT = element; // main Element
        this.disabled = this.disabled; // initial disabled
        this.role = this.role ? this.role : ''; // initial disabled
        this.linkLabelToControlElement = this.getLinkedLabelElement; //code for linking the label to main Element
        this.ELEMENT.addEventListener('click', function (e) {
            e.preventDefault();
        });
        Object.defineProperty(this.ELEMENT, 'CustomConstructor', {
            get: function () {
                return __this__;
            }
        });
        //for Linking disabled state change method, get method at main element
        //You can get and set the disabled state by using Element.disabled.
        Object.defineProperty(this.ELEMENT, 'disabled', {
            get: function () {
                return this.CustomConstructor.disabled;
            },
            set: function (v) {
                this.CustomConstructor.disabled = v;
            }
        });
    }
    Object.defineProperty(CustomFormElement.prototype, "hasLabelingAttribute", {
        get: function () {
            //get Checked result Is this object has attribute aria-labelledby
            var hasLabel = this.ELEMENT.hasAttribute('aria-labelledby');
            return hasLabel ? true : false;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CustomFormElement.prototype, "role", {
        get: function () {
            //get role
            return this.ELEMENT.getAttribute('role');
        },
        set: function (role_name) {
            //set role
            if (role_name !== '') {
                this.ELEMENT.setAttribute('role', role_name);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CustomFormElement.prototype, "getLinkedLabelElement", {
        get: function () {
            //check an element that matched the id value string of an "aria-labelledby" attribute is exists in your HTML Document.
            if (this.hasLabelingAttribute) {
                var LABEL_ELEMENT = document.getElementById(this.ELEMENT.getAttribute('aria-labelledby'));
                return LABEL_ELEMENT ? LABEL_ELEMENT : null;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CustomFormElement.prototype, "linkLabelToControlElement", {
        set: function (lb) {
            /*
            [What is this method for?]
            This method makes you can focus or click a custom form element by click a custom label. like just the native input element.
    
            [how-to-use?]
            get element value to use a getLinkedLabelElement method to get label element if an element is connected in the document and then assign to this setter property.
            
            */
            if (lb) {
                this.LABEL_ELEMENT = lb;
                this.LABEL_ELEMENT.setAttribute('data-role', 'label');
                this.LABEL_ELEMENT.addEventListener('click', function () {
                    if (!this.disabled) {
                        this.ELEMENT.click();
                    }
                }.bind(this));
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CustomFormElement.prototype, "disabled", {
        get: function () {
            //get disabled boolean state
            var state = this.ELEMENT.getAttribute('aria-disabled');
            return state === "true" ? true : false;
        },
        set: function (v) {
            //set state to disabled by boolean
            this.ELEMENT.setAttribute('aria-disabled', String(v));
            this.focusable = !v;
            if (this.getLinkedLabelElement) {
                this.getLinkedLabelElement.classList.toggle('disabled-label', v);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CustomFormElement.prototype, "focusable", {
        get: function () {
            //get foucsable info for the focus managing
            var state = this.ELEMENT.getAttribute('tabindex');
            return state === '0' ? true : false;
        },
        set: function (v) {
            //set foucsable info for the focus managing
            //It's a Material for disabled state
            var tabindex_value = v ? 0 : -1;
            this.ELEMENT.setAttribute('tabindex', tabindex_value.toString());
        },
        enumerable: false,
        configurable: true
    });
    return CustomFormElement;
}());
var CheckableElement = /** @class */ (function (_super) {
    __extends(CheckableElement, _super);
    /***
     
    Do not use a CheckableElement Class to Constructor();

    It is only for the status management.

     ***/
    function CheckableElement(element) {
        var _this_1 = _super.call(this, element) || this;
        Object.defineProperty(_this_1.ELEMENT, 'checked', {
            get: function () {
                return this.CustomConstructor.checked;
            },
            set: function (v) {
                this.CustomConstructor.checked = v;
            }
        });
        _this_1.ELEMENT.addEventListener('keydown', function (e) {
            var code = e.code;
            if (code === "Enter" &&
                (e.target instanceof HTMLAnchorElement ||
                    e.target instanceof HTMLButtonElement)) {
                e.preventDefault();
            }
        }.bind(_this_1));
        return _this_1;
    }
    Object.defineProperty(CheckableElement.prototype, "isCheckable", {
        get: function () {
            return ((this.role === 'checkbox') ||
                (this.role === 'radio') ||
                (this.role === 'menuitemcheckbox') ||
                (this.role === 'menuitemradio')) ? true : false;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CheckableElement.prototype, "checked", {
        get: function () {
            if (this.isCheckable) {
                return this.ELEMENT.getAttribute('aria-checked') === 'true' ? true : false;
            }
        },
        set: function (v) {
            if (this.isCheckable) {
                this.ELEMENT.setAttribute('aria-checked', v.valueOf().toString());
            }
        },
        enumerable: false,
        configurable: true
    });
    return CheckableElement;
}(CustomFormElement));
//common constructor end
//Checkbox instance Class
var CheckboxElement = /** @class */ (function (_super) {
    __extends(CheckboxElement, _super);
    function CheckboxElement(element) {
        var _this_1 = _super.call(this, element) || this;
        //this element is for displaying icons only.
        _this_1.CHECKBOX_MARK_ELEMENT = document.createElement('span');
        // child checkbox list
        _this_1.childCheckboxes = [];
        //initial checked state, default is false
        //You can initialize the checkbox default value to true by aria-checked="true" on pattern markup
        _this_1.checked = _this_1.checked;
        _this_1.CHECKBOX_MARK_ELEMENT.classList.add('material-icons', 'checkbox-checked');
        _this_1.CHECKBOX_MARK_ELEMENT.setAttribute('aria-hidden', 'true');
        _this_1.ELEMENT.append(_this_1.CHECKBOX_MARK_ELEMENT);
        _this_1.CHECKBOX_GROUP_ELEMENT_TOBE_MANAGED = document.getElementById(_this_1.ELEMENT.getAttribute('aria-controls'));
        _this_1.setManagerCheckbox = _this_1.isManagerCheckbox;
        //Events
        //Click to Toggle State
        _this_1.ELEMENT.addEventListener('click', function () {
            if (!this.disabled) {
                this.toggle();
                this.ELEMENT.focus();
            }
        }.bind(_this_1));
        //keyboard Event: Press Spcae ket to Toggle State
        _this_1.ELEMENT.addEventListener('keydown', function (e) {
            var c = e.code;
            switch (c) {
                case "Space":
                    this.toggle();
                    break;
            }
        }.bind(_this_1));
        return _this_1;
    }
    /*
    It's a static property, you can't access it as InstanceName.
    You must access this property as below line.
    >>CheckboxElement.CustomCheckboxCollection
    */
    CheckboxElement.startReconfiguration = function () {
        //It's a static method, you must access and use likes "CheckboxElement.startReconfiguration()".
        var Elements = document.querySelectorAll('[role=checkbox]');
        CheckboxElement.CustomCheckboxCollection = [];
        for (var i = 0; i < Elements.length; i++) {
            var element = Elements[i];
            CheckboxElement.CustomCheckboxCollection[i] = new CheckboxElement(element);
        }
    };
    CheckboxElement.prototype.checkAll = function (v) {
        //This method's purpose is just the same as the method name. If this checkbox is manager, make child checkboxes to checked or not checked state when you clicked to toggle the check state of this element..
        var childCheckboxes = this.childCheckboxes;
        var childsLength = childCheckboxes.length;
        for (var i = 0; i < childsLength; i++) {
            var element = childCheckboxes[i];
            element.checked = v;
        }
    };
    CheckboxElement.prototype.CheckboxManageListener = function (v) {
        /*
            This code will be run If this checkbox is a manager checkbox.

            if the child checkbox is not all checked or all not checked, this code will make a checked state of the manager checkbox to a "mixed" state.
        */
        if (v) {
            var _this_2 = this;
            if (this.CHECKBOX_GROUP_ELEMENT_TOBE_MANAGED) {
                var childList_1 = this.CHECKBOX_GROUP_ELEMENT_TOBE_MANAGED.querySelectorAll('[role="checkbox"],input[type="checkbox"]');
                this.childCheckboxes = ToArray(childList_1);
                var detector = new MutationObserver(function (m) {
                    var currentChecked = Array.prototype.filter.call(childList_1, function (e) {
                        return e.getAttribute('aria-checked') === true || e.checked;
                    });
                    if (currentChecked.length !== 0 || currentChecked.length !== childList_1.length) {
                        _this_2.ELEMENT.setAttribute('aria-checked', 'mixed');
                    }
                    if (currentChecked.length === 0) {
                        _this_2.checked = false;
                    }
                    if (currentChecked.length === childList_1.length) {
                        _this_2.checked = true;
                    }
                });
                detector.observe(_this_2.CHECKBOX_GROUP_ELEMENT_TOBE_MANAGED, {
                    attributes: true,
                    attributeFilter: ['aria-checked'],
                    subtree: true
                });
            }
        }
    };
    Object.defineProperty(CheckboxElement.prototype, "setManagerCheckbox", {
        set: function (v) {
            this.ELEMENT.setAttribute('data-manager-checkbox', v.valueOf().toString());
            this.CheckboxManageListener(v);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CheckboxElement.prototype, "isManagerCheckbox", {
        get: function () {
            return this.ELEMENT.getAttribute('data-manager-checkbox') === 'true' ?
                true : false;
        },
        enumerable: false,
        configurable: true
    });
    CheckboxElement.prototype.toggle = function () {
        if (this.isCheckable && !this.disabled) {
            this.ELEMENT.setAttribute('aria-checked', (!this.checked).valueOf().toString());
            this.checkAll(this.checked);
        }
    };
    ;
    CheckboxElement.CustomCheckboxCollection = [];
    return CheckboxElement;
}(CheckableElement));
;
CheckboxElement.startReconfiguration();
//checkbox end
//radio button class
var RadioElement = /** @class */ (function (_super) {
    __extends(RadioElement, _super);
    function RadioElement(element) {
        var _this_1 = _super.call(this, element) || this;
        _this_1.RadioGroup = ToArray(document.querySelectorAll('[role="radio"]'));
        //this element is for displaying icons only.
        _this_1.RADIO_MARK_ELEMENT = document.createElement('span');
        _this_1.RadioGroup = _this_1.getCurrentGroupRadioObjects;
        _this_1.index = _this_1.getIndexFromGroup;
        _this_1.RADIO_MARK_ELEMENT.classList.add('material-icons', 'radio-selected');
        _this_1.RADIO_MARK_ELEMENT.setAttribute('aria-hidden', 'true');
        _this_1.ELEMENT.appendChild(_this_1.RADIO_MARK_ELEMENT);
        if (document.querySelector("[data-radio-name=\"" + _this_1.getGroupName + "\"][aria-checked=\"true\"]")) {
            document.querySelector("[data-radio-name=\"" + _this_1.getGroupName + "\"][aria-checked=\"true\"]").CustomConstructor.select(true);
        }
        else {
            _this_1.select(false);
            _this_1.RadioGroup[0].CustomConstructor.focusable = true;
        }
        _this_1.ELEMENT.addEventListener('click', function () {
            this.select(true);
        }.bind(_this_1));
        _this_1.ELEMENT.addEventListener('keydown', function (e) {
            var code = e.code;
            var NEXT1 = "ArrowDown";
            var NEXT2 = "ArrowRight";
            var PREV1 = "ArrowUp";
            var PREV2 = "ArrowLeft";
            if (code === NEXT1 || code === NEXT2) {
                if (this.NextRadioButton) {
                    this.NextRadioButton.CustomConstructor.select(true);
                    this.NextRadioButton.focus();
                }
                else {
                    this.getSelectableRadioButtons[0].CustomConstructor.select(true);
                    this.getSelectableRadioButtons[0].focus();
                }
            }
            if (code === PREV1 || code === PREV2) {
                if (this.PreviousRadioButton) {
                    this.PreviousRadioButton.CustomConstructor.select(true);
                    this.PreviousRadioButton.focus();
                }
                else {
                    this.getSelectableRadioButtons[this.getSelectableRadioButtons.length - 1].CustomConstructor.select(true);
                    this.getSelectableRadioButtons[this.getSelectableRadioButtons.length - 1].focus();
                }
            }
            if (code === 'Space') {
                this.ELEMENT.click();
            }
        }.bind(_this_1));
        return _this_1;
    }
    Object.defineProperty(RadioElement.prototype, "getSelectableRadioButtons", {
        get: function () {
            return Array.prototype.filter.call(this.RadioGroup, function (e) {
                return e.getAttribute('aria-disabled') !== 'true';
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RadioElement.prototype, "NextRadioButton", {
        get: function () {
            var NextRadioElement = this.getSelectableRadioButtons[this.index + 1];
            return NextRadioElement ? NextRadioElement : null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RadioElement.prototype, "PreviousRadioButton", {
        get: function () {
            var PreviousRadioElement = this.getSelectableRadioButtons[this.index - 1];
            return PreviousRadioElement ? PreviousRadioElement : null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RadioElement.prototype, "getIndexFromGroup", {
        get: function () {
            return Array.prototype.indexOf.call(this.RadioGroup, this.ELEMENT);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RadioElement.prototype, "getGroupName", {
        get: function () {
            var hasGroupNameAttribute = this.ELEMENT.hasAttribute('data-radio-name');
            var getGroupNameAttributeValue = this.ELEMENT.getAttribute('data-radio-name');
            if (hasGroupNameAttribute) {
                return getGroupNameAttributeValue;
            }
            else {
                throw Error("Radio Components must have data-radio-name!");
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RadioElement.prototype, "checked", {
        get: function () {
            if (this.isCheckable) {
                return this.ELEMENT.getAttribute('aria-checked') === 'true' ? true : false;
            }
        },
        set: function (v) {
            if (this.isCheckable) {
                this.ELEMENT.setAttribute('aria-checked', v.valueOf().toString());
                this.focusable = v;
            }
        },
        enumerable: false,
        configurable: true
    });
    RadioElement.prototype.select = function (v) {
        if (!this.disabled) {
            this.checked = v;
            var ToBeUnselected = this.getColleagueRadioButton;
            var ToBeUnselected_length = ToBeUnselected.length;
            for (var i = 0; i < ToBeUnselected_length; i++) {
                ToBeUnselected[i].checked = false;
            }
        }
    };
    Object.defineProperty(RadioElement.prototype, "getColleagueRadioButton", {
        get: function () {
            var _this = this;
            var result = Array.prototype.filter.call(this.getCurrentGroupRadioObjects, function (e) {
                return e !== _this.ELEMENT;
            });
            return result;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RadioElement.prototype, "getCurrentGroupRadioObjects", {
        get: function () {
            var _this = this;
            if (this.getGroupName) {
                var result = Array.prototype.filter.call(this.RadioGroup, function (e) {
                    return e.getAttribute('data-radio-name') === _this.getGroupName;
                });
                return result;
            }
        },
        enumerable: false,
        configurable: true
    });
    RadioElement.startReconfiguration = function () {
        //It's a static method, you must access and use likes "RadioElement.startReconfiguration()".
        var Elements = document.querySelectorAll('[role="radio"]');
        RadioElement.CustomRadioCollection = [];
        for (var i = 0; i < Elements.length; i++) {
            var element = Elements[i];
            RadioElement.CustomRadioCollection[i] = new RadioElement(element);
        }
    };
    RadioElement.CustomRadioCollection = []; //custom radio button collection(static)
    return RadioElement;
}(CheckableElement));
RadioElement.startReconfiguration(); //start reconfigure the elements that written by a valid pattern.
/*Checkbox Markup
<span id="label">Example</span>
<div role="checkbox" aria-labelledby="label"></div>
*/
/*Manager Checkbox Markup
<span id="manager-label">Check-All</span>
<div role="checkbox" aria-labelledby="manager-label" aria-controls="for-check-all"></div>
<div id="for-check-all">
    <span id="managed-1">Check Option 1</span>
    <div role="checkbox" aria-labelledby="managed-1"></div>
    <span id="managed-2">Check Option 2</span>
    <div role="checkbox" aria-labelledby="managed-2"></div>
    <span id="managed-3">Check Option 3</span>
    <div role="checkbox" aria-labelledby="managed-3"></div>
</div>
*/
/*
Radio Markup

    <div role="radio" data-radio-name="good" aria-labelledby="FavorColor1"></div>
    <span id="FavorColor1">Black</span>
    
    <div aria-checked="true" aria-labelledby="FavorColor2" role="radio" data-radio-name="good"></div>
    <span id="FavorColor2">Red</span>

    <div aria-disabled="true" aria-labelledby="FavorColor3" role="radio" data-radio-name="good"></div>
    <span id="FavorColor3">Blue</span>

    <div aria-disabled="true" aria-labelledby="FavorColor4" role="radio" data-radio-name="good"></div>
    <span id="FavorColor4">White</span>
*/ 
