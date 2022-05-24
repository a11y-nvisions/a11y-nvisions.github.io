(()=>{
  class HangulCharacterHandler {
  constructor(){

  }

  /**
   * 
   * @param {string} choseong 
   */
  getIndexOfChoseong ( choseong ) {
      if ( this.Data_Cho.indexOf(choseong[0]) > -1) {
          return this.Data_Cho.indexOf(choseong[0]);
      } else {
          console.error(choseong+" is not a Korean Syllable or Choseong : 한글 또는 초성이 아님");
      }
  }
  getIndexOfJungseong ( jungseong ) {
      if ( this.Data_Jung.indexOf(jungseong) > -1 ) {
          return this.Data_Jung.indexOf(jungseong);
      } else {
          console.error("Not a Korean Syllable or Jungseong : 한글 또는 중성이 아님");
      }
  }
  getIndexOfJongseong ( jongseong ) {
      if ( this.Data_Jong.indexOf(jongseong) > -1 ) {
          return this.Data_Jong.indexOf(jongseong);
      } else {
          console.error("Not a Korean Syllable or Jungseong : 한글 또는 초/중성이 아님");
      }
  }

  get Data_Cho (){
      return new Array(30).fill("").map((el,idx)=>{
          el = 12593+idx;
          const string = String.fromCharCode(el);
          if (/[^ㄳㄼㅀㄾㄿㄺㄽㄻㅄㄶㄵ]/.test(string)) {
              return string;
      }}).filter(el=>Boolean(el));
  }

  get Data_Jung () {
      return new Array(21).fill("").map((el,idx)=>{
          el = 12623+idx;
          return String.fromCharCode(el);
      })
  }
  
  get Data_Jong () {
      return [""].concat(new Array(30).fill("").map((el,idx)=>{
          el = 12593+idx;
          const string =  String.fromCharCode(el);
          if (/[^ㅃㅉㄸ]/.test(string)) {
              return string;
          }
      })).filter(el=>(Boolean(el) || el == ""));
  }

  /**
   * 
   * @param {string} str 
   * @returns {string}
   */
  
  hangulStarting = 0xAC00;
  isCombinedHangul = /[가-힣]/;

  /**
   * 
   * @param {number} cho 
   * @param {number} jung 
   * @param {number} jong 
   */
  combineByIndex(cho,jung,jong) {
      const choCheck = (cho > -1 && cho < this.Data_Cho.length);
      const jungCheck = (jung > -1 && jung < this.Data_Jung.length);
      const jongCheck = (jong > -1 && jong < this.Data_Jong.length);
      if ( 
          (choCheck &&
          jungCheck)
      ) {

          return String.fromCharCode(this.hangulStarting+((cho*21)+jung)*28+ (jongCheck ? jong : 0));
      }
  }

  /**
   * @param {string} str
   * @param {number} idx
  */getJongseongFrom(str , idx = 0, mode = "return_index") { 
      if (idx < str.length || idx > -1) {
          if ( this.isCombinedHangul.test(str[idx]) ) {
              const letter = str[idx].charCodeAt() - this.hangulStarting;
              
              const result = letter % 28;
              switch(mode) {
                  case "return_index":
                      return result;
                  case "return_char":
                      return this.Data_Jong[result];
              }
          } else {
              return ""
          }
      } else {
          return ""
      }
  }

  /**
   * @param {string} str
   * @param {number} idx
  */getJungseongFrom(str , idx = 0,mode = "return_index") { 
      if (idx < str.length || idx > -1) {
          if ( this.isCombinedHangul.test(str[idx]) ) {
              const letter = str[idx].charCodeAt() - this.hangulStarting
              
              const jong = this.getJongseongFrom(str,idx);

              const result = ( (letter-jong) / 28) % 21;

              switch(mode) {
                  case "return_index":
                      return result;
                  case "return_char":
                      return this.Data_Jung[result];
              }
          } else {
              return ""
          }
      } else {
          return ""
      }
  }
  /**
   * @param {string} str
   * @param {number} idx
  */getChoseongFrom(str , idx = 0, mode = "return_index") { 
      if (idx < str.length || idx > -1) {
          if ( this.isCombinedHangul.test(str[idx]) ) {
              const letter = str[idx].charCodeAt() - this.hangulStarting
              const jong = this.getJongseongFrom(str,idx);
              const jung = this.getJungseongFrom(str,idx);
              const result =  ( ( ( letter - jong ) / 28 ) - jung ) / 21;
              switch(mode) {
                  case "return_index":
                      return result;
                  case "return_char":
                      return this.Data_Cho[result];
              }
          } else {
              return "";
          }
      } else {
          return "";
      }
  }

  /**
   * @param {string} str
   */disassemble ( str ) {
      let strArr = String(str).match(/[^a-zA-Z]|[a-z-A-Z]+/g)

      return strArr.map(el=>{
          if ( this.isCombinedHangul.test(el) ) {
              const [Cho,Jung,Jong] = [
                  this.getChoseongFrom(el,0,"return_char"),
                  this.getJungseongFrom(el,0,"return_char"),
                  this.getJongseongFrom(el,0,"return_char")
              ]

              return new KoreanSyllable({Cho,Jung,Jong});
          } else {
              return el;
          }
      })
  }

  /**
   * @param {string} str
   */
  getDisassembledFlatString(str){
    /** @type {(string|KoreanSyllable)[]} */ const flatResult = this.disassemble(str)
    return flatResult.map(el=>{
      if (el instanceof KoreanSyllable) {
        return el.Cho+el.Jung+el.Jong
      } else {
        return el;
      }
    }).join("");
  }

  /**
   * 
   * @param {({Cho:string,Jung:string,Jong:string}[]|string)[]} strArr 
   */assemble2DArray (strArr,returns = "string") {
      const result = strArr.map(el=>{
          if ( el instanceof Object ) {
              const Cho = this.getIndexOfChoseong(el.Cho);
              const Jung = this.getIndexOfJungseong(el.Jung);
              const Jong = this.getIndexOfJongseong(el.Jong);
              const result = this.combineByIndex(Cho,Jung,Jong);
              if ( this.isCombinedHangul.test(result)){
                  return result;
              }
          } else {
              return el;
          }
      });

      switch (returns) {
          case "string":
              return result.join("");
          case "array":
              return result;
      }
  }

  /**
   * 
   * @param {(string} str
   */
  InvertChoAndJong ( str , returns = "Char" ) {
      let pass = "";
      const disassembled = this.disassemble(str);
      /** @type {(KoreanSyllable|string)[]} */const result = disassembled.map(
      /** @param {string|KoreanSyllable} s */
      s=>{
          if (s instanceof KoreanSyllable ) {
              let Cho = s.Cho;
              let Jong = s.Jong;
              
              if (/[ㄺㄻㄼㄽㄾㄿㅀ]/.test(Jong)){
                  Jong = "ㄹ";
              }else if(/[ㅄ]/.test(Jong)){
                  Jong = "ㅂ";
              }else if(/[ㅃ]/.test(Jong)) {
                  Jong = "ㅂ";
              }else if (/[ㄵㄶ]/.test(Jong)) {
                  Jong = "ㄴ";
              } else if(/[ㄳ]/.test(Jong)){
                  Jong = "ㄱ";
              } else if (/[ㅉ]/.test(Jong)){
                  Jong = "ㅈ";
              }

              s.Jong = Cho === "" ? "" : Cho;
              s.Cho = Jong === "" ? "ㅇ" : Jong;
              s.char = this.assemble2DArray([s]);
              return s;
          } else {
              return s;
          }
      }).reverse();
      if(returns === "Object") {
          return result;
      }
      if (returns === "Char" ) {
          return result.map(el=>el.char).join("");
      }
  }
};

class KoreanSyllable {
  /** @param {{Cho:string,Jung:string,Jong:string}|string} init */
  constructor(init) {
      this.Cho = "";
      this.Jung = "";
      this.Jong = "";
      if (init instanceof Object) {
          if ( this.Data_Jung.indexOf(init.Jung) < 0 ) {
              console.error("Jungseong value is unavailable");
              return null;
          }
          if ( this.Data_Jung.indexOf(init.Jung) < 0 ) {
              console.error("Choseong value is unavailable");
              return null;
          }
          
          [this.Cho,this.Jung,this.Jong] = [init.Cho,init.Jung,init.Jong];

          this.char = new HangulCharacterHandler().assemble2DArray([{Cho:init.Cho,Jung:init.Jung,Jong:init.Jong}]);
      } else if ( init instanceof String ) {
          if ( /[가-힣]/.test(init[0]) ) {
              [this.Cho,this.Jung,this.Jong] = [
              new HangulCharacterHandler().disassemble(init)[0].Cho, 
              new HangulCharacterHandler().disassemble(init)[0].Jung,
              new HangulCharacterHandler().disassemble(init)[0].Jong];
          }
      }
  }
  get Data_Cho(){
      return new HangulCharacterHandler().Data_Cho;
  };
  get Data_Jung(){
      return new HangulCharacterHandler().Data_Jung;
  };
  get Data_Jong(){
      return new HangulCharacterHandler().Data_Jong;
  };
}

const Hangul = new HangulCharacterHandler(); 

class AutoCompleteEditBox extends HTMLElement {
  constructor (  ) {
    super();
    this.template = document.createElement('template');

    this.template.innerHTML = `
    <style>
      
      :host {
        position:relative;
        display:flex;
        flex-flow:row;
        gap:0.3em;
      }

      :host #comboWrapper{
        position:relative;
      }

      :host([hide-label]) label{
        border: 0;clip: rect(0 0 0 0);height: 1px;margin: -1px;overflow: hidden;padding: 0;position: absolute;width: 1px;
      }

      :host(:not([use-search])) #search {
        display:none;
      }

      :host input {
        border:none;
        outline:none;
      }

      :host li.available {
        display:flex;
        width:100%;
      }
      :host li:not(.available) {
        display:none;
      }

      :host #data_list {
        display:none;
        list-style:none;
        height:fit-content;
        list-style-position:inside;
        background-color:#fff;
        padding:0; margin:0;
        display:flex; width:100%;
        flex-flow:column;
      }
      :host #result_sizer {
        display:none;
      }

      :host #result_sizer.show {
        display:flex;
        background-color:#fff;
        box-shadow:0 0 0.2em 0.1em rgba(0,0,0,0.5);
      }

      :host #not_found {
        display:none;
      }
      :host #not_found.occured {
        display:flex;
        width:100%;
      }
      :host .occured~#data_list {
        display:none;
      }

      :host button {
        background:transparent;
        font-weight:bold;
        border:none;
        border-left:solid 1px;
        cursor:pointer;
      }

      :host #found_message {
        border: 0;
        clip: rect(0 0 0 0);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        width: 1px;
        display:none;
      }

      :host #found_message.found-out {
        display:block;
      }


      :host li.available:hover,
      :host #focused {
        text-decoration:underline;
        background-color:#ccefff;
      }
      :host li[aria-selected="true"] {
        background-color:#69f;
        color:white;
      }
      
      :host li#focused:hover {
        background-color:#9bf;
      }

      :host li[aria-selected="true"]:hover,
      #focused[aria-selected="true"] {
        background-color:#58d;
      }

      :host #controls {
        position:relative;
        display:flex;
        border:solid 1px;
        border-radius:0.2em;
      }
      :host #controls :is(button,input[type="text"]){
        border-radius:0.2em;
      }
      
      :host #controls :is(button,input[type="text"]):focus-visible{
        background-color:rgba(225,250,255,0.7);
      }
      :host #controls input[type="text"]:focus-visible {
        box-shadow:inset 0 0 5px 1px rgba(0,0,0,0.2);
      }

      :host #chevron_handle {
        display:flex;
        border-left:solid 0.1em;
        padding:0.1em;
        align-items:center;
        justify-content:center;
      }

      :host #chevron_handle.expanded::after {
          content:"▲";
      }
      :host #chevron_handle:not(.expanded)::after {
          content:"▼";
      }

      :host #selected_indicator {
        display:none;
      }
      :host input:focus+#selected_indicator {
        display:none;
      }


      :host .descriptions {
        display:none;
      }
    </style>
    <label for="search_in_list">
      <strong><slot name="label" id="label">Default</slot></strong>
    </label>
    <div id="comboWrapper">
      <div id="controls" class="controls">
        <input aria-describedby="hint_combobox" aria-expanded="false" aria-haspopup="listbox" aria-controls="data_list" id="search_in_list" type="text" role="combobox" aria-autocomplete="list" autocomplete="off" name="search_in_list">
        <div id="selected_indicator"></div>
        <span id="chevron_handle"></span>
        <button id="search">Search With Google</button>
      </div>
      <div id="result_sizer">
        <div role="alert" id="not_found">
          목록 내 일치하는 항목 없음
        </div>
        <ul aria-label="자동완성" role="listbox" id="data_list" aria-describedby="hint_listbox">
          <slot id="options"></slot>
        </ul>
        <div role="alert" id="found_message">
          자동완성 결과 있음
        </div>
      </div>
    </div>
    <div class="descriptions">
      <span id="hint_combobox">, 텍스트를 입력하여 자동완성 목록을 검색합니다. 편집창에 아무것도 입력하지 않고, Alt + 아래 화살표 키를 누르면 모든 목록을 다 볼 수 있어요. 편집창에 무언가 입력돼 있다면, 유효한 자동완성 제안을 표시합니다.</span>
      <span id="hint_listbox">, 위 또는 아래 화살표키로 탐색, ESC키로 제안 닫기</span>
      <span id="hint_option">, Enter 키로 선택</span>
    </div>
    `;
    this.shadow = this.attachShadow({mode:"open"})
    this.shadow.append(this.template.content.cloneNode(true));
    
    this.DataElement = [...this.querySelectorAll('li')]
    this.optionSlot = this.shadow.querySelector('slot#options');
    this.label = this.shadow.querySelector('label');
    this.search = this.shadow.querySelector('#search');
    this.handle = this.shadow.querySelector('#chevron_handle');
    this.ErrorContainer_NotFound = this.shadow.querySelector('#not_found');
    this.NotiContainer_Found = this.shadow.querySelector('#found_message');
    this.ListContainer = this.shadow.querySelector('#data_list');
    this.ResultContainer = this.shadow.querySelector("#result_sizer");
    this.input = this.shadow.querySelector('#search_in_list');
    this.input.setAttribute('aria-activedescendant','focused');
  };

  get getAvailables() {
    return this.DataElement.filter(el=>el.classList.contains('available'));
  }

  getMatchedData ( getAllData = false ) {
    if (!getAllData) {
      if (Boolean(this.input.value) && this.input.value.trim().length > 0 ) {
        return this.DataElement.filter(el=>{
          const currentInput = Hangul.getDisassembledFlatString(this.input.value);
          const isMatched = new RegExp(`${String(currentInput).replace(/[\[\{\}\(\]\)\!\?\:\*\.\$\^\|]/g,(m) => "\\"+m)}+`,"i");
          
          if (
            isMatched.test(Hangul.getDisassembledFlatString(el.innerText))
          ) {
            if ( /[ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ가-힣a-zA-Z0-9\(\)\{\}\[\]\?\:\.\*\!\^\$]+/.test(this.input.value) ) {
              return el;
            }
          }
        });
      } else {
        return [];
      }
    } else {
      return this.DataElement;
    }
  }

  get getFocusedItem () {
    return this.shadow.querySelector('#focused');
  }

  get getFocusedItemIndex (  ) {
    return this.getAvailables.indexOf(this.getFocusedItem);
  }

  set setFocusedItemByIndex (number) {
    if ( typeof number === "number") {
      if (this.getAvailables[number]) {
        this.getAvailables.forEach(el=>{
          if ( this.getAvailables[number] === el ) {
            el.id = "focused";
          } else {
            el.removeAttribute('id');
          }
        });
      }
      if (number === -1) {
        this.getMatchedData().forEach(el=>{
          el.removeAttribute('id');
        });
      }
    }
  }

  get isOpened() {
    return this.input.getAttribute('aria-expanded') === 'true' ? true : false;
  }

  open(bool = true) {
    if (typeof bool === "boolean") {
      this.input.setAttribute('aria-expanded',String(bool));
      this.ResultContainer.classList.toggle('show',bool);
      if(bool) {
        this.handle.classList.add('expanded');
        this.setFocusedItemByIndex = -1;
      } else {
        this.handle.classList.remove('expanded');

      }
    }
  }

  /**
   * 
   * @param {KeyboardEvent} evt 
   */
  event_choose_item(evt){
    switch (evt.code) {
      case "ArrowDown":
        if ( this.isOpened ) {
          evt.preventDefault();
          if (this.getAvailables[this.getFocusedItemIndex+1]) {
            this.setFocusedItemByIndex = this.getFocusedItemIndex+1;
          }
        } else {
          evt.preventDefault();
          if (evt.altKey && !this.isOpened){
            if (this.getMatchedData().length === 0) {
              this.open(true);
              this.event_showAll();
              this.event_whenFoundAnnouncement();
            } else {
              this.open(true);
              this.event_showFoundResults();
              this.event_whenFoundAnnouncement();
            }
          }
        }
        break;
      case "Tab":
      case "Escape":
        this.open(false);
        this.DataElement.forEach(el=>{
          this.setFocusedItemByIndex = -1;
          el.classList.remove('available');
        })
        break;

      case "ArrowUp":
        if ( this.isOpened ) {
          if (this.getAvailables[this.getFocusedItemIndex-1]) {
            evt.preventDefault();
            this.setFocusedItemByIndex = this.getFocusedItemIndex-1
          }
        }
        break;
      case "Enter":
        evt.preventDefault();
        if (this.getFocusedItem) {
          this.getFocusedItem.click();
        }
        break;
    }
  }

  event_showAll() {
      this.setFocusedItemByIndex = -1;
      this.DataElement.forEach(el => {
        el.classList.add('available');
      })
  }

  event_showFoundResults(){
    this.DataElement.forEach(el=>{
      this.setFocusedItemByIndex = -1;
      if (Boolean(this.input.value)) {
        const isAvailable = this.getMatchedData().indexOf(el) > -1;
        if (isAvailable){
            el.classList.add('available');
          } else {
            el.classList.remove('available');
          }
        } else {
          el.classList.remove('available');
      }
    });
  };

  event_whenNotFoundAnnouncement(){
    const timer = setTimeout(()=>{
      if ( Boolean(this.input.value) ) {
        this.ErrorContainer_NotFound.classList.remove("occured");
        clearTimeout(timer);
        if (this.getMatchedData().length == 0) {
          this.ErrorContainer_NotFound.classList.add("occured");
        }
      }
    },150)
  }

  event_whenFoundAnnouncement(){
    const timer = setTimeout(()=>{
      if ( Boolean(this.input.value) ) {
        this.NotiContainer_Found.classList.remove("found-out");
        clearTimeout(timer);
        if (this.getMatchedData().length > 0) {
          this.NotiContainer_Found.classList.add("found-out");
        }
      }
    },150)
  }
  
  connectedCallback() {
    this.optionSlot.addEventListener('slotchange',(evt)=>{
      const /** @type {HTMLSlotElement} */ target = evt.target;
      const assigned = [...target.assignedElements()];
      assigned.forEach(el=>{
        const tagName = el.tagName.toLowerCase();
        if (tagName === 'li') {
          el.setAttribute('role','option');
          el.setAttribute('aria-selected','false');
          el.setAttribute('aria-describedby','hint_option');
          el.setAttribute('aria-label',el.innerText?.trim());
          this.ListContainer.append(el);
        }
      })
    })
    this.handle.addEventListener('click',()=>{
      this.event_showAll();
      this.open(!this.isOpened);
      this.input.focus();
    });
    this.input.addEventListener('click',(evt)=>{
      this.handle.click();
    })

    this.DataElement.forEach(el=>{
      el.addEventListener('click',(evt)=>{
        this.input.value = el.innerText;
        this.setFocusedItemByIndex = -1;
        this.DataElement.forEach(_el=>{
          if (el !== _el) {
            _el.setAttribute('aria-selected','false');
            _el.classList.remove('available');
          } else {
            _el.setAttribute('aria-selected','true');
          }
          this.open(false);
        })
      })
    });
    this.input.addEventListener('input',(evt)=>{
      this.open(Boolean(this.input.value));
      this.event_showFoundResults();
      this.event_whenNotFoundAnnouncement();
      this.event_whenFoundAnnouncement();
    });
    this.input.addEventListener('keydown',(evt)=>{
      this.event_choose_item(evt);
    });
    this.search.addEventListener('click',(evt)=>{
      /** @type {HTMLElement} */ const Selected = this.shadow.querySelector('[aria-selected ="true"]');
      if(Selected) {
        if (Selected.dataset.value){
          location.href = `https://www.google.co.kr/search?q=${Selected.dataset.value}`;
        } else {
          location.href = `https://www.google.co.kr/search?q=${Selected.innerText}`;
        }
      } else {
        alert('선택된 콤보상자 없음');
      }
    });
  }
}

customElements.define('example-autocomplete',AutoCompleteEditBox);

})();