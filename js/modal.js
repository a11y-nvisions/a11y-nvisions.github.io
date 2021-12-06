/*

1. 대화상자를 여는 버튼에는 aria-haspopup="dialog" 속성과 aria-controls 속성을 줍니다. aria-controls 에는 버튼과 연결된 role="dialog" 요소의 id 를 주면 됩니다.
예: <button aria-haspopup="dialog" aria-controls="dialog-container">대화상자 열기</button>
2. role="dialog" 속성은 대화상자가 있는 컨테이너에 주되 display 속성이 none, block 으로 변경되는 곳이어야 합니다. 
3. aria-haspopup="dialog" 를 클릭하여 대화상자가 열렸을 때 초점을 대화상자 내부의 특정 요소로 보내려면 보내고자 하는 요소에 autoFocus 라는 class 를 주면 됩니다. 다만 탭키로 접근이 가능한 요소이거나, 자바스크립트로 초점을 보낼 수 있도록 tabindex="-1" 속성이 들어가 있는 요소여야 합니다. 
4. 대화상자 내부에서 포커스 트랩을 구현하기 위해 class="firstTab" class="lastTab" 클래스를 각각 지정합니다. 이렇게 하면 firstTab 요소에서 쉬프트 탭을 누르면 lastTab class 로, lastTab class 에서 탭키를 누르면 firstTab class 로 이동합니다.
5. 대화상자를 닫는 버튼에는 class="modalClose" 를 추가합니다. 그러면 취소 키를 눌렀을 때 해당 요소가 클릭되면서 대화상자가 사라지고 초점은 이전 대화상자를 여는 버튼으로 돌아가게 됩니다. 대화상자가 display:none 되면 모든 aria-hidden 속성은 사라집니다.

*/
'use strict';
var $body = document.body,
    $targetAreas = $body.querySelectorAll('[aria-haspopup=dialog]'),
    modals = $body.querySelectorAll('[role=dialog], [role=alertdialog]'),
    $modal = null, $firstTab, $lastTab, $closeModal, $targetArea;
$targetAreas.forEach(function($el) {
    $el.addEventListener('click', initialize, false);
});

function initialize(event) {
  setTimeout(function() {
    $targetArea = event.target;
    modals.forEach(function($el) {
        if (
          $targetArea.getAttribute('aria-controls') && $targetArea.getAttribute('aria-controls') == $el.getAttribute('id') && 'true' == $el.getAttribute('aria-modal') && window.getComputedStyle($el).display === "block" || $el.getAttribute('aria-hidden') === 'false'
        ) {
            $modal = $el;
            if ($modal.querySelector(".autoFocus")) {
              $modal.querySelector(".autoFocus").focus();
            }
        }
    });

    if ($modal) {
        $closeModal = $modal.querySelector('.closeModal'),
        $firstTab = $modal.querySelector('.firstTab'),
        $lastTab = $modal.querySelector('.lastTab');
        setHiddenExceptForThis($modal);
        if (!$modal.getAttribute('aria-label') || $modal.getAttribute('aria-labelledby')) {
          $modal.setAttribute('aria-label', $targetArea.textContent);
        }
        $modal.addEventListener('keydown', bindKeyEvt);
        let observer = new MutationObserver((mutations) => {
          setHiddenExceptForThis($modal,'off');
          setTimeout(function() {
            if (window.getComputedStyle($modal).display === "none" || $modal.getAttribute('aria-hidden') === 'true') {
                $targetArea.focus();
                $modal.removeEventListener("keydown", bindKeyEvt, false);
                observer.disconnect();
            }
          }, 500);            
        });
        let option = {
          attributes: true,
          CharacterData: true
        };
        observer.observe($modal, option);
    }
  }, 500);
}

function bindKeyEvt (event) {
  event = event || window.event;
  var keycode = event.keycode || event.which;
  var $target = event.target;

  switch(keycode) {
    case 9:  // tab key
        if ($firstTab && $lastTab) {
            if (event.shiftKey) {
                if ($firstTab && $target == $firstTab) {
                    event.preventDefault();
                    if ($lastTab) $lastTab.focus();
                }
            } else {
                if ($lastTab && $target == $lastTab) {
                    event.preventDefault();
                    if ($firstTab) $firstTab.focus();
                }
            }
        } else {
            event.preventDefault();
        }
      break;
    case 27:  // esc key
        event.preventDefault();
        $closeModal.click();
      break;
    default:
      break;
  }
}


/*
1. element 파라미터에는 role="dialog"가 붙은 컨테이너를 document.querySelector()나 document.getElementById()등으로 가져와서 넣습니다.
2. turn은 'on'과 'off'값이 허용되며, on이면 element로 지정된 요소가 속한 부모 요소들과 element의 하위 요소, 그리고 element 자신을 제외한 모든 요소에 aria-hidden="true"를 추가해 줍니다.
3. 이 함수로 aria-hidden="true" 가 부여된 요소는 is-sr-hidden 서브클래스가 붙으며, 같은 요소에 'off'를 사용하여 이 함수를 다시 부르면 aria-hidden 속성이 제거됩니다.
*/

function setHiddenExceptForThis(element,turn='on'){

    // 다른 라이브러리로 인해 aria-hidden이 추가된 요소를 제외한 모든 요소를 가져옵니다. (버그 방지를 위해 aria-hidden이 없는 요소만을 가져옵니다)
    var allElems = document.body.querySelectorAll('*:not([aria-hidden="true"])');

    // 혹시 모를 버그를 방지하기 위해 aria-hidden을 초기화합니다.
    allElems.forEach(function(el){
      el.removeAttribute('aria-hidden');
    })

    // Array.from과 같은 간단한 방법으로 Array로 바꿀 수 있으나 호환성 이슈로 NodeList에서 Array로 바꾸는 작업에 반복문을 사용합니다.
    var _allElems = [];
    for(var i = 0; i<allElems.length; i++){
        _allElems.push(allElems[i]);
    }

    // 숨겨질, 중요하지 않은 요소들과 그렇지 않은 대화상자 요소를 걸러내어, 대화상자와 관계없는 요소들을 모두 추려냅니다.
    var notImportants = _allElems.filter(function(el){
        if ( element.contains(el) === false && el.contains(element) === false ){
            return el
        }
    })

    
    // 'on'일 때 notImportants안에 들어있는 요소들을 모두 aria-hidden="true" 처리하고, is-sr-hidden 클래스를 추가합니다.
    if( turn === 'on' ){
        notImportants.forEach(function(el){
            el.setAttribute('aria-hidden','true');
            el.classList.add('is-sr-hidden');
        })
    }
    
    // 'off'일 때 'is-sr-hidden'클래스를 가진 요소 목록을 가져와서 aria-hidden과 식별용 is-sr-hidden 클래스를 제거합니다.
    if( turn === 'off' ){
        document.querySelectorAll('.is-sr-hidden').forEach(function(el){
            el.classList.remove('is-sr-hidden');;
            el.removeAttribute('aria-hidden');
        })
    }
}