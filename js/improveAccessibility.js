/**
	* jQuery 라이브러리 버전이 1.7.0 미만이거나 없을 경우 jQuery 최신 버전 적용
	*/
try {
	var jScript = document.createElement("script");
	jScript.type = "text/javascript";
	jScript.charset = "utf-8";
	jScript.src = "https://code.jquery.com/jquery-latest.min.js";
	var jQuery_current_version = jQuery.fn.jquery.split(".").map(Number); // 페이지에 적용된 jQuery 버전을 가져옴
	var jQuery_minimum_version = 17; // jQuery 최소 버전 1.7.0
	jQuery_current_version = jQuery_current_version[0] * 10 + jQuery_current_version[1];
	if (jQuery_minimum_version > jQuery_current_version) {
		document.getElementsByTagName("head")[0].appendChild(jScript);
	}
} catch { // jQuery가 없을 경우 예외처리 하여 최신 버전을 적용함
	document.getElementsByTagName("head")[0].appendChild(jScript);
}

/* Element 확장 메소드로 추가 */

Element.prototype.setAriaHiddenExceptForThis = function (turn = 'on') {
	// 다른 라이브러리로 인해 aria-hidden이 추가된 요소를 제외한 모든 요소를 가져옵니다. (버그 방지를 위해 aria-hidden이 없는 요소만을 가져옵니다)
	var allElems = document.body.querySelectorAll('*:not([aria-hidden="true"])');
	// 혹시 모를 버그를 방지하기 위해 aria-hidden을 초기화합니다.
	allElems.forEach(function (el) {
		el.removeAttribute('aria-hidden');
	})
	// Array.from과 같은 간단한 방법으로 Array로 바꿀 수 있으나 호환성 이슈로 NodeList에서 Array로 바꾸는 작업에 반복문을 사용합니다.
	var _allElems = [];
	for (var i = 0; i < allElems.length; i++) {
		_allElems.push(allElems[i]);
	}
	// 숨겨질, 중요하지 않은 요소들과 그렇지 않은 대화상자 요소를 걸러내어, 대화상자와 관계없는 요소들을 모두 추려냅니다.
	var notImportants = _allElems.filter(function (el) {
		if (this.contains(el) === false && el.contains(this) === false) {
			return el
		}
	})
	// 'on'일 때 notImportants안에 들어있는 요소들을 모두 aria-hidden="true" 처리하고, is-sr-hidden 클래스를 추가합니다.
	if (turn === 'on') {
		notImportants.forEach(function (el) {
			el.setAttribute('aria-hidden', 'true');
			el.setAttribute('is-sr-hidden', 'true');
		})
	}

	// 'off'일 때 'is-sr-hidden'클래스를 가진 요소 목록을 가져와서 aria-hidden과 식별용 is-sr-hidden 클래스를 제거합니다.
	if (turn === 'off') {
		document.querySelectorAll('[is-sr-hidden]').forEach(function (el) {
			el.removeAttribute('is-sr-hidden');;
			el.removeAttribute('aria-hidden');
		})
	}
};

function createMutationObserver(callback) {

}

function setAriaHiddenExceptForThis(element) {
	setHiddenExceptForThis(element);
	function setHiddenExceptForThis(element, turn = 'on') {
		var allElems = document.body.querySelectorAll('*:not([aria-hidden="true"])');
		allElems.forEach(function (el) {
			el.removeAttribute('aria-hidden');
		})

		var _allElems = [];
		for (var i = 0; i < allElems.length; i++) {
			_allElems.push(allElems[i]);
		}

		var notImportants = _allElems.filter(function (el) {
			if (element.contains(el) === false && el.contains(element) === false) {
				return el
			}
		})

		if (turn === 'on') {
			notImportants.forEach(function (el) {
				el.setAttribute('aria-hidden', 'true');
				el.setAttribute('is-sr-hidden', 'true');
			})
		}

		if (turn === 'off') {
			document.querySelectorAll('[is-sr-hidden]').forEach(function (el) {
				el.removeAttribute('is-sr-hidden');;
				el.removeAttribute('aria-hidden');
			})
		}
	};
	let observer = new MutationObserver((mutations) => {
		setHiddenExceptForThis(element, "off");
		observer.disconnect();
	});
	let option = {
		attributes: true,
		attributeFilter: ['class', 'style'],
		childList: true
	};
	observer.observe(element, option);
	observer.observe(element.parentNode, option)
};

function isMobile() {
	var UserAgent = navigator.userAgent;
	if (UserAgent.match(/iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) != null || UserAgent.match(/LG|SAMSUNG|Samsung/) != null) {
		return true;
	}
	else {
		return false;
	}
}

/**
	* 토글 버튼 이벤트
	* DOM의 모든 버튼 (<Button>, <input type="button">,<a role="button"> 등) 클릭 시 발생하는 이벤트 (누름 상태 변경)
	* aria-pressed = "true" or "false"
	*/
function ariaPressed() {
	var beforeOuterHtml;
	var ua = navigator.userAgent.toLowerCase();
	var isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");
	$(document).on("mousedown", ":button[aria-pressed], [type='button'][aria-pressed], [role='button'][aria-pressed]", function (e) {
		if ($(this).attr("aria-pressed") === undefined) { return; }
		beforeOuterHtml = this.outerHTML;
	});
	$(document).on("focus", ":button[aria-pressed], [type='button'][aria-pressed], [role='button'][aria-pressed]", function (e) {
		if ($(this).attr("aria-pressed") === undefined) { return; }
		beforeOuterHtml = this.outerHTML;
	});

	$(document).on("click", ":button[aria-pressed], [type='button'][aria-pressed], [role='button'][aria-pressed]", function (e) {
		var $this = $(this);
		var _this = this;
		var timeout = setTimeout(function () {
			if (isAndroid) {
				if (beforeOuterHtml === _this.outerHTML) {
				} else if ($this.attr("aria-pressed") === "true") {
					$this.attr("aria-pressed", "false");
					announceForAccessibility("꺼짐");
				} else {
					$this.attr("aria-pressed", "true");
					announceForAccessibility("켜짐");
				};
			} else {
				if (beforeOuterHtml === _this.outerHTML) {
				} else if ($this.attr("aria-pressed") === "true") {
					$this.attr("aria-pressed", "false");
				} else {
					$this.attr("aria-pressed", "true");
				};
			};
		}, 500);
	});
};

//wai-aria checkbox
function ariaCheckbox() {
	// role=checkbox 인 요소를 checkBoxes 배열 변수에 적재
	var checkBoxes = document.querySelectorAll('[role="checkbox"]');
	var ariaCntrlChkBoxIdx;
	checkBoxes.forEach(function (checkBox, index) {
		checkBox.tabIndex = 0;

		if (checkBox.hasAttribute("aria-controls")) {
			ariaCntrlChkBoxIdx = index;
		}

		checkBox.addEventListener("focus", function () {
			checkBoxMousedown();
		});
		checkBox.addEventListener("mousedown", function () {
			checkBoxMousedown();
		});

		// 마우스 클릭 or 스페이스바를 누를 시 이벤트 발생
		checkBox.addEventListener("click", function () {
			checkBoxEvent(checkBox);
		});

		checkBox.addEventListener("keydown", function (e) {
			if (e.keyCode === 32) {
				// space, enter
				checkBox.click();
				e.preventDefault();
			}
		});
	});

	var beforeCheckBoxOuterHTML;
	function checkBoxMousedown() {
		beforeCheckBoxOuterHTML = checkBoxes[ariaCntrlChkBoxIdx].outerHTML;
	}
	function checkBoxEvent(target) {
		// 클릭한 체크박스 요소에 aria-controls 속성이 있을 경우, 예) 체크박스 전체에 영향을 끼치는 부모 체크박스
		// aria-controls="chk_0 chk_1 chk_2 chk_4 ..."
		if (target.hasAttribute("aria-controls")) {
			// aria-controls 에 저장된 id를 split 하여 배열변수에 적재
			var restBoxes = target.getAttribute("aria-controls").split(" ");
			var checkedBoxes = 0;
			// 부모 체크박스가 true일 경우 자기자신, 자식 체크박스의 체크여부를 false로 변경 (전체 미동의)
			if (target.getAttribute("aria-checked") === 'true') {
				for (var _i = 0; _i < restBoxes.length; _i++) {
					var _singleBox = document.getElementById(restBoxes[_i]);
					_singleBox.setAttribute("aria-checked", false);
				}
				target.setAttribute("aria-checked", false);
			} else { // 부모 체크박스가 false일 경우 자기자신, 자식 체크박스의 체크여부를 true로 변경 (전체 동의)
				for (var _i2 = 0; _i2 < restBoxes.length; _i2++) {
					var _singleBox2 = document.getElementById(restBoxes[_i2]);
					_singleBox2.setAttribute("aria-checked", true);
				}
				target.setAttribute("aria-checked", true);
			}
			return false;
		} else { // 해당 요소의 체크박스의 상태만 변경
			if (target.getAttribute("aria-checked") === 'true') {
				target.setAttribute("aria-checked", false);
			} else {
				target.setAttribute("aria-checked", true);
			}
		}

		// 부모 체크박스의 요소를 이전과 비교하여 true or false 처리
		var afterCheckBox = checkBoxes[ariaCntrlChkBoxIdx];
		if (beforeCheckBoxOuterHTML !== afterCheckBox.outerHTML) {
			if (afterCheckBox.getAttribute("aria-checked") === 'true') {
				afterCheckBox.setAttribute("aria-checked", false);
			} else {
				afterCheckBox.setAttribute("aria-checked", true);
			}
		}
	}
};

// announceForAccessibility
function screenReaderLive() {
	var btns = document.querySelectorAll('[screen-reader-live]');
	btns.forEach(function (btn) {
		btn.addEventListener('click', function () {
			if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
				announceForAccessibility("");
			} else {
				if (btn.getAttribute("aria-label")) {
					if (isAndroid) {
						setTimeout(function () {
							announceForAccessibility(btn.getAttribute("aria-label"));
						}, 150);
					} else {
						announceForAccessibility("");
					};
				} else {
					setTimeout(function () {
						announceForAccessibility(btn.textContent);
					}, 80);
				};
			};
		});
	});
};

function announceForAccessibility(message) {
	var html = '' +
		'<div aria-live="polite" name="div_announceForAccessibility" style="border: 0; padding: 0; margin: 0; ' +
		'position: absolute !important;' + 'height: 1px; width: 1px; overflow: hidden; clip: rect(1px 1px 1px 1px); ' +
		'clip: rect(1px, 1px, 1px, 1px);' + 'clip-path: inset(50%); white-space: nowrap;">' +
		'<p name="p_announceForAccessibility"></p></div>';

	$("body").append(html); // body 끝에 div_announceForAccessibility 추가

	setTimeout(function () { // 0.02초 후 p 태그에 message 추가
		$("[name='p_announceForAccessibility']").text(message);
	}, 200);

	setTimeout(removeAnnounceForAccessibility, 500); // 0.5초 후 div_announceForAccessibility 삭제
}

/**
	* div 의 name 이 div_announceForAccessibility 인 태그를 하위까지 삭제
	*/
function removeAnnounceForAccessibility() {
	$("[name='div_announceForAccessibility']").remove();
}

//aria-expanded
function ariaExpanded() {
	var expandButtons = document.querySelectorAll('[aria-expanded][aria-controls]');
	expandButtons.forEach(function (expandButton) {
		expandedEvent(expandButton);
	});

	function expandedEvent(btn) {
		if (btn.expandEvent) {
			return false;
		}
		btn.expandEvent = true;
		var beforeOuterHtml
		var ua = navigator.userAgent.toLowerCase();
		var isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");
		if (isAndroid) {
			btn.addEventListener("mousedown", function () {
				var expandEl = document.querySelector("#" + btn.getAttribute("aria-controls"));
				beforeOuterHtml = expandEl.outerHTML
			})
		} else {
			btn.addEventListener("focus", function () {
				var expandEl = document.querySelector("#" + btn.getAttribute("aria-controls"));
				beforeOuterHtml = expandEl.outerHTML
			})
		}
		btn.addEventListener("click", function () {
			setTimeout(function () {
				var expandEl = document.querySelector("#" + btn.getAttribute("aria-controls"));
				if (btn.parentElement === expandEl) {
					if (btn.getAttribute("aria-expanded") === "false" && beforeOuterHtml !== expandEl.outerHTML) {
						expandedOpen(btn, expandEl)
					} else if (btn.getAttribute("aria-expanded") === "true" && beforeOuterHtml !== expandEl.outerHTML) {
						expandedClose(btn, expandEl)
					}
				} else {
					if (!expandEl) return;
					expandButtons.forEach(function (expandButton) {
						var ariaControls = expandButton.getAttribute("aria-controls")
						var expandEls = document.querySelector("#" + ariaControls);
						if (window.getComputedStyle(expandEls).display === 'none') {
							expandButton.setAttribute("aria-expanded", false);
						} else if (expandEls.getAttribute('aria-hidden') === true) {
							expandButton.setAttribute("aria-expanded", false);
						} else if (window.getComputedStyle(expandEls).display === 'block' && !expandEls.firstChild) {
							expandButton.setAttribute("aria-expanded", false);
						}
					});
					if (btn.getAttribute("aria-expanded") === 'true' && window.getComputedStyle(expandEl).display === 'none') {
						expandedClose(btn, expandEl);
					} else if (btn.getAttribute("aria-expanded") === 'false' && window.getComputedStyle(expandEl).display === 'block' && expandEl.firstChild) {
						expandedOpen(btn, expandEl);
					} else if (btn.getAttribute("aria-expanded") === 'true' && expandEl.getAttribute('aria-hidden') === 'true') {
						expandedClose(btn, expandEl);
					} else if (btn.getAttribute('aria-expanded') === 'false' && expandEl.getAttribute('aria-hidden') === 'false') {
						expandedOpen(btn, expandEl);
					} else if (btn.getAttribute("aria-expanded") === 'true' && window.getComputedStyle(expandEl).display === 'block' && !expandEl.firstChild) {
						expandedClose(btn, expandEl);
					};

					if (expandEl) {
						expandEl.addEventListener('click', function () {
							setTimeout(function () {
								if (window.getComputedStyle(expandEl).display === 'none') {
									expandedClose(btn, expandEl);
									btn.focus();
								}
							}, 200);
						})
					}
				}
			}, 500)
		});
	}
	function expandedClose(btn, expandEl) {
		btn.setAttribute("aria-expanded", false);
	}
	function expandedOpen(btn, expandEl) {
		btn.setAttribute("aria-expanded", true);
	};
}

//modal.js
function modalDialog() {
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
	$targetAreas.forEach(function ($el) {
		$el.addEventListener('click', initialize, false);
	});

	function initialize(event) {
		setTimeout(function () {
			$targetArea = event.target;
			modals.forEach(function ($el) {
				if ($targetArea.getAttribute('aria-controls') && $targetArea.getAttribute('aria-controls') == $el.getAttribute('id') && 'true' == $el.getAttribute('aria-modal') && window.getComputedStyle($el).display === "block" || $el.getAttribute('aria-hidden') === 'false') {
					$modal = $el;
					if ($modal.querySelector(".autoFocus")) {
						$modal.querySelector(".autoFocus").focus();
					}
				}
			});

			if ($modal) {
				var focusable = $($modal).find('a[href], input, select, textarea, button, [tabindex="0"], [contenteditable]').not('[tabindex=-1], [disabled], .not(:visible), :hidden')
				$closeModal = $modal.querySelector('.closeModal')
				if ($modal.querySelector(".firstTab")) {
					$firstTab = $modal.querySelector('.firstTab')
				} else {
					$firstTab = focusable[0];
				}
				if ($modal.querySelector(".lastTab")) {
					$lastTab = $modal.querySelector('.lastTab');
				} else {
					$lastTab = focusable[focusable.length - 1]
				}
				if ($firstTab === $lastTab) {
					$lastTab = null
				}
				setHiddenExceptForThis($modal);
				if (!$modal.getAttribute('aria-label') || $modal.getAttribute('aria-labelledby')) {
					$modal.setAttribute('aria-label', $targetArea.textContent);
				}
				$modal.addEventListener('keydown', bindKeyEvt);
				let observer = new MutationObserver((mutations) => {
					setHiddenExceptForThis($modal, 'off');
					$targetArea.focus();
					$modal.removeEventListener("keydown", bindKeyEvt, false);
					if ($lastTab.getAttribute("tabindex")) {
						$lastTab.removeAttribute("tabindwx")
					}
					$modal = null
					observer.disconnect();
				});
				let option = {
					attributes: true,
					attributeFilter: ['class', 'style'],
					childList: true
				};
				observer.observe($modal, option);
			}
		}, 500);
	}

	function bindKeyEvt(event) {
		event = event || window.event;
		var keycode = event.keycode || event.which;
		var $target = event.target;

		switch (keycode) {
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

	function setHiddenExceptForThis(element, turn = 'on') {

		// 다른 라이브러리로 인해 aria-hidden이 추가된 요소를 제외한 모든 요소를 가져옵니다. (버그 방지를 위해 aria-hidden이 없는 요소만을 가져옵니다)
		var allElems = document.body.querySelectorAll('*:not([aria-hidden="true"])');

		// 혹시 모를 버그를 방지하기 위해 aria-hidden을 초기화합니다.
		allElems.forEach(function (el) {
			el.removeAttribute('aria-hidden');
		})

		// Array.from과 같은 간단한 방법으로 Array로 바꿀 수 있으나 호환성 이슈로 NodeList에서 Array로 바꾸는 작업에 반복문을 사용합니다.
		var _allElems = [];
		for (var i = 0; i < allElems.length; i++) {
			_allElems.push(allElems[i]);
		}

		// 숨겨질, 중요하지 않은 요소들과 그렇지 않은 대화상자 요소를 걸러내어, 대화상자와 관계없는 요소들을 모두 추려냅니다.
		var notImportants = _allElems.filter(function (el) {
			if (element.contains(el) === false && el.contains(element) === false) {
				return el
			}
		})


		// 'on'일 때 notImportants안에 들어있는 요소들을 모두 aria-hidden="true" 처리하고, is-sr-hidden 클래스를 추가합니다.
		if (turn === 'on') {
			notImportants.forEach(function (el) {
				el.setAttribute('aria-hidden', 'true');
				el.setAttribute('is-sr-hidden', 'true');
			})
		}

		// 'off'일 때 'is-sr-hidden'클래스를 가진 요소 목록을 가져와서 aria-hidden과 식별용 is-sr-hidden 클래스를 제거합니다.
		if (turn === 'off') {
			document.querySelectorAll('[is-sr-hidden]').forEach(function (el) {
				el.removeAttribute('is-sr-hidden');;
				el.removeAttribute('aria-hidden');
			})
		}
	};
};

function setAsModal($modal) {
	var focusable = $($modal).find('a[href], input, select, textarea, button, [tabindex="0"], [contenteditable]').not('[tabindex=-1], [disabled], .not(:visible), :hidden')
	if ($modal.querySelector(".closeModal")) {
		$closeModal = $modal.querySelector('.closeModal')
	}
	if ($modal.querySelector(".firstTab")) {
		$firstTab = $modal.querySelector('.firstTab')
	} else {
		$firstTab = focusable[0];
	}
	if ($modal.querySelector(".lastTab")) {
		$lastTab = $modal.querySelector('.lastTab');
	} else {
		$lastTab = focusable[focusable.length - 1]
	}
	if ($firstTab === $lastTab) {
		$lastTab = null
	}
	$firstTab.focus()
	if (!$modal.querySelector('[role="dialog"]')) {
		$modal.setAttribute("role", "dialog")
		$modal.setAttribute("aria-modal", "true")
	}
	setHiddenExceptForThis($modal);
	$modal.addEventListener('keydown', bindKeyEvt);
	let observer = new MutationObserver((mutations) => {
		setHiddenExceptForThis($modal, 'off');
		$modal.removeEventListener("keydown", bindKeyEvt, false);
		if ($modal.getAttribute("role", "dialog")) {
			$modal.removeAttribute("role")
			$modal.removeAttribute("aria-modal")
		}
		if ($lastTab.getAttribute("tabindex")) {
			$lastTab.removeAttribute("tabindex")
		}
		$modal = null
		$firstTab = null
		$lastTab = null
		$closeModal = null
		observer.disconnect();
	});
	let option = {
		attributes: true,
		attributeFilter: ['class', 'style'],
		childList: true
	};
	observer.observe($modal, option);
	observer.observe($modal.parentNode, option)
};
function bindKeyEvt(event) {
	event = event || window.event;
	var keycode = event.keycode || event.which;
	var $target = event.target;

	switch (keycode) {
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

function setHiddenExceptForThis(element, turn = 'on') {

	// 다른 라이브러리로 인해 aria-hidden이 추가된 요소를 제외한 모든 요소를 가져옵니다. (버그 방지를 위해 aria-hidden이 없는 요소만을 가져옵니다)
	var allElems = document.body.querySelectorAll('*:not([aria-hidden="true"])');

	// 혹시 모를 버그를 방지하기 위해 aria-hidden을 초기화합니다.
	allElems.forEach(function (el) {
		el.removeAttribute('aria-hidden');
	})

	// Array.from과 같은 간단한 방법으로 Array로 바꿀 수 있으나 호환성 이슈로 NodeList에서 Array로 바꾸는 작업에 반복문을 사용합니다.
	var _allElems = [];
	for (var i = 0; i < allElems.length; i++) {
		_allElems.push(allElems[i]);
	}

	// 숨겨질, 중요하지 않은 요소들과 그렇지 않은 대화상자 요소를 걸러내어, 대화상자와 관계없는 요소들을 모두 추려냅니다.
	var notImportants = _allElems.filter(function (el) {
		if (element.contains(el) === false && el.contains(element) === false) {
			return el
		}
	})


	// 'on'일 때 notImportants안에 들어있는 요소들을 모두 aria-hidden="true" 처리하고, is-sr-hidden 클래스를 추가합니다.
	if (turn === 'on') {
		notImportants.forEach(function (el) {
			el.setAttribute('aria-hidden', 'true');
			el.setAttribute('is-sr-hidden', 'true');
		})
	}

	// 'off'일 때 'is-sr-hidden'클래스를 가진 요소 목록을 가져와서 aria-hidden과 식별용 is-sr-hidden 클래스를 제거합니다.
	if (turn === 'off') {
		document.querySelectorAll('[is-sr-hidden]').forEach(function (el) {
			el.removeAttribute('is-sr-hidden');
			el.removeAttribute('aria-hidden');
		})
	}
};


//role button
function ariaButton() {
	var btns = document.querySelectorAll('[role="button"]');
	btns.forEach(function (btn) {
		btn.addEventListener("keydown", function (e) {
			if (e.keyCode === 32 || e.keyCode === 13) {
				btn.click();
				e.preventDefault();
			}
		});
		if ($(btn) !== $("a [href]")) {
			btn.setAttribute('tabindex', '0');
		}
	});
};

//aria-hidden
function ariaHidden() {
	var hiddenButtons = document.querySelectorAll('[screen-reader-hidden]');
	hiddenButtons.forEach(function (hiddenButton) {
		checkHiddenEvent(hiddenButton);
	});

	function checkHiddenEvent(btn) {
		if (btn.checkHiddenEvent) {
			return false;
		}
		btn.checkHiddenEvent = true;
		var hiddenEl = document.querySelector("#" + btn.getAttribute("screen-reader-hidden"));
		var beforeOuterHtml;
		var ua = navigator.userAgent.toLowerCase();
		var isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");
		if ($(hiddenEl).attr("aria-hidden") === "false") {
			$(hiddenEl).find("a[href], button, input, select, [role='button'], [role='link'], [role='checkbox'], [role='tab'], [role='radiobutton'], [role='combobox']").removeAttr("tabindex");
		} else if ($(hiddenEl).attr("aria-hidden") === "true") {
			$(hiddenEl).find("a[href], button, input, select, [role='button'], [role='link'], [role='checkbox'], [role='tab'], [role='radiobutton'], [role='combobox']").attr("tabindex", "-1");
		};

		if (isAndroid) {
			btn.addEventListener('mousedown', function () {
				beforeOuterHtml = hiddenEl.outerHTML;
			});
		} else {
			btn.addEventListener('focus', function () {
				beforeOuterHtml = hiddenEl.outerHTML;
			});
		};
		btn.addEventListener('click', function () {
			setTimeout(function () {
				if (beforeOuterHtml === hiddenEl.outerHTML) {
					return;
				} else if ($(hiddenEl).attr("aria-hidden") === "false") {
					hiddenTrue(btn, hiddenEl);
				} else if ($(hiddenEl).attr("aria-hidden") === "true") {
					hiddenFalse(btn, hiddenEl);
				};
			}, 500);
			if (hiddenEl && hiddenEl.getAttribute("aria-hidden", "false")) {
				setTimeout(function () {
					let observer = new MutationObserver((mutations) => {
						hiddenEl.setAttribute('aria-hidden', true);
						$(hiddenEl).find("a, button, input, select").attr("tabindex", "-1");
						btn.focus();
						observer.disconnect();
					});
					let option = {
						attributes: true,
						attributeFilter: ['class', 'style']
					};
					observer.observe(hiddenEl, option);
				}, 1000);
			};
		});
	}

	function hiddenTrue(btn, hiddenEl) {
		hiddenEl.setAttribute("aria-hidden", true);
		$(hiddenEl).find("a[href], button, input, select, [role='button'], [role='link'], [role='checkbox'], [role='tab'], [role='radiobutton'], [role='combobox']").attr("tabindex", "-1");
	}
	function hiddenFalse(btn, hiddenEl) {
		hiddenEl.setAttribute("aria-hidden", false);
		$(hiddenEl).find("a[href], button, input, select, [role='button'], [role='link'], [role='checkbox'], [role='tab'], [role='radiobutton'], [role='combobox']").removeAttr("tabindex");
	}

};

//aria-controls, aria-describedby 추가를 위한 동적 아이디 생성
/**
* targetValue1에 해당하는 요소에 id를 부여하며, targetValue2에 해당하는 요소에 aria-controls 혹은 aria-describedby 와 연결합니다.
* ex) createElementsId("target1", "target2", "aria-controls") 로 선언 시 target1 이라는 class 및 name을 가진 요소에 id 부여 및 target2에 aria-controls id 혹은 aria-desciredby id 부여
* document를 읽는 순서대로 속성을 주기 때문에 변경할 수 없음
* targetValue2 값이 여러개일 경우 var targetValue2 = ['값1','값2','값3'~] 형태로 주입
*/
function createElementsId(element, targetValue1, idName, targetValue2, ariaProperty) {
	var elements1 = element.querySelectorAll("." + targetValue1 + ", [name=" + targetValue1 + "]");

	if (elements1 != null && targetValue2 != null) {

		Array.from(elements1).forEach(function (els, idx) {
			var id = idName + "_" + idx;
			els.setAttribute("id", id);
			if (Array.isArray(targetValue2)) { // targetValue2가 여러개일 경우
				for (var target2Index in targetValue2) {
					element.querySelectorAll("." + targetValue2[target2Index] + ", [name=" + targetValue2[target2Index] + "]")[idx].setAttribute(ariaProperty, id);
				}
			} else {
				element.querySelectorAll("." + targetValue2 + ", [name=" + targetValue2 + "]")[idx].setAttribute(ariaProperty, id);
			}
		});
	}
}


//모바일에서의 링크 초점 분리 해결
function focusTogetherForMobile() {
	if (isMobile) {
		document.querySelectorAll('a[href]').forEach((el, index) => {
			const text = el.innerText;
			el.setAttribute('aria-label', text);
			el.querySelectorAll('*:not(img, h1, h2, h3, h4, h5, h6)').forEach((el, index) => {
				el.setAttribute('role', 'none');
				el.setAttribute('aria-hidden', 'true');
			});
		});
		document.querySelectorAll('p > span').forEach((el, index) => {
			el.setAttribute("role", "text");
		});

		document.querySelectorAll('p > span > span').forEach((el, index) => {
			el.setAttribute("role", "text");
		});
	};
};

// radio
function ariaRadio() {
	var radioGroups = document.querySelectorAll('[role="radiogroup"]');
	radioGroups.forEach(function (radioGroup) {
		var radioBox = radioGroup.querySelectorAll('[role="radio"]');
		var firstRadio = radioBox[0];
		var lastRadio = radioBox[radioBox.length - 1];
		var hasChecked = false;

		var _loop = function _loop(i) {
			if (radioBox[i].getAttribute("aria-checked") == "true") {
				radioBox[i].tabIndex = 0;
				hasChecked = true;
			} else {
				radioBox[i].tabIndex = -1;
			}

			radioBox[i].addEventListener("click", function (e) {
				var target = e.currentTarget;
				radioBox.forEach(function (radio) {
					if (radio !== target) {
						radio.setAttribute("aria-checked", false);
						radio.tabIndex = -1;
					}
				});
				target.setAttribute("aria-checked", true);
				target.tabIndex = 0;
			});

			radioBox[i].addEventListener("keydown", function (e) {
				var target = e.currentTarget;
				if (e.keyCode === 37 || e.keyCode === 38) {
					// previous : left,up
					target.setAttribute("aria-checked", false);
					target.tabIndex = -1;
					if (target == firstRadio) {
						if (lastRadio.getAttribute("aria-disabled", "true")) {
							lastRadio.setAttribute("aria-checked", "false");
						} else {
							lastRadio.setAttribute("aria-checked", true);
							lastRadio.click();
						};
						lastRadio.tabIndex = 0;
						lastRadio.focus();
					} else {
						if (radioBox[i - 1].getAttribute("aria-disabled", "true")) {
							radioBox[i - 1].setAttribute("aria-checked", "false");
						} else {
							radioBox[i - 1].setAttribute("aria-checked", true);
							radioBox[i - 1].click();
						};
						radioBox[i - 1].tabIndex = 0;
						radioBox[i - 1].focus();
					}
					e.preventDefault();
				}
				if (e.keyCode === 39 || e.keyCode === 40) {
					// next : right,down
					target.setAttribute("aria-checked", false);
					target.tabIndex = -1;
					if (target == lastRadio) {
						if (firstRadio.getAttribute("aria-disabled", "true")) {
							firstRadio.setAttribute("aria-checked", "false");
						} else {
							firstRadio.setAttribute("aria-checked", true);
							firstRadio.click();
						};
						firstRadio.tabIndex = 0;
						firstRadio.focus();
					} else {
						if (radioBox[i + 1].getAttribute("aria-disabled", "true")) {
							radioBox[i + 1].setAttribute("aria-checked", "false");
						} else {
							radioBox[i + 1].setAttribute("aria-checked", true);
							radioBox[i + 1].click();
						};
						radioBox[i + 1].tabIndex = 0;
						radioBox[i + 1].focus();
					}
					e.preventDefault();
				}

				if (e.keyCode === 32) {
					// select: space
					if (target.getAttribute("aria-checked") !== 'true') {
						target.setAttribute("aria-checked", true);
						target.click();
					}
					e.preventDefault();
				}
			});
		};

		for (var i = 0; i < radioBox.length; i++) {
			_loop(i);
		}
		if (!hasChecked) radioBox[0].tabIndex = 0;
	});
};
//aria tab
function ariaTab() {
	/*
					[WARNING]
					This script should be import to last script file.
					This script will not apply to the created element dynamically by script.
					But, If you need the solution for dynamically created content, you can create and remove the tab object manually.
	*/

	function TabElementCollection() {
		var _this = this;

		this.TABLIST_CONTAINER = document.querySelectorAll('ul,ol'); // Tab controller list must be made by using UL, LI
		this.TABCONTROL_COLLECTION = []; // tabcontroller access array


		this.Initialization = function () { // create Tab Objects
			var TABLIST = _this.TABLIST_CONTAINER;
			TabListlength = TABLIST.length;
			for (var i = 0; i < TabListlength; i++) {
				var element = TABLIST[i];
				_this.TABCONTROL_COLLECTION[i] = new Tab(element);
			}
		}


		// If you'll make the tab dynamically, register the object by using this method.

		this.createTabByManual = function (tablistElement) {
			_this.TABCONTROL_COLLECTION.push(new Tab(tablistElement));
		}

		// If you'll remove the made tab dynamically, delete the object by using this method.
		this.removeTabByManual = function (index) {
			if (typeof index === 'number' &&
				!isNaN(Number(index))
			) {
				var TAB_CONTROL = _this.TABCONTROL_COLLECTION[index];
				if (TAB_CONTROL) {
					//mark
					for (var prop in TAB_CONTROL) {
						var c_prop = TAB_CONTROL[prop];
						if (c_prop instanceof Element) {
							c_prop.parentElement.removeChild(c_prop);
							if (c_prop.panel) {
								c_prop.panel.parentElement.removeChild(c_prop.panel);
							}
						}
					}
					_this.TABCONTROL_COLLECTION.splice(index, index);
				}
			}
		}

		function Tab(CONTAINER) { //TabObjects
			var _this = this;
			_this.TABLIST_CONTAINER = CONTAINER;
			/*
							Tab item must be created according to below structures
							1. li>a[role="tab"]
							2. li>button[role="tab"]
							3. li[role="tab"]
			*/
			_this.MODE = _this.TABLIST_CONTAINER.getAttribute('data-mode');
			_this.MODE ? false : _this.TABLIST_CONTAINER.setAttribute('data-mode', 'aria1.1_click')
			_this.TABLIST_ITEMS = _this.TABLIST_CONTAINER.querySelectorAll('li[role=tab],a[role="tab"],button[role="tab"]');
			_this.ITEMLENGTH = _this.TABLIST_ITEMS.length;
			_this.INDEX_OF_SELECTED_TAB = 0;
			_this.IS_VERTICAL_TAB = _this.TABLIST_CONTAINER.getAttribute('aria-orientation') === 'vertical';
			_this.DEFAULT_SELECTED_TAB = _this.TABLIST_CONTAINER.querySelector('[aria-selected=true]');
			_this.LOAD_SELECTABLE_TAB = function () {
				_this.SELECTABLE_TAB_LIST = Array.prototype.filter.call(_this.TABLIST_ITEMS, function (e) {
					var Condition1 = window.getComputedStyle(e).display !== 'none' && window.getComputedStyle(e).visibility !== 'hidden' && e.getAttribute('aria-hidden') !== 'true';

					var Condition2 = window.getComputedStyle(e.parentNode).display === 'none' && window.getComputedStyle(e.parentNode).visibility === 'hidden' || e.parentNode.getAttribute('aria-hidden') === 'true';
					return (Condition1 && !Condition2);
				})
				_this.SELECTABLE_LENGTH = _this.SELECTABLE_TAB_LIST.length;
			};
			_this.LOAD_SELECTABLE_TAB();
			new MutationObserver(function () {
				_this.LOAD_SELECTABLE_TAB();
				_this.select = _this.select;
			}).observe(_this.TABLIST_CONTAINER, {
				subtree: true,
				childList: false,
				attributes: true,
				attributeFilter: ['class', 'style']
			})

			Object.defineProperties(_this, {
				"select": {
					set(i) {//Is the Setter property for tab select interface
						if (
							(typeof i === 'number') ||
							((typeof i === 'string') && !isNaN(Number(i)))
						) {
							_this.INDEX_OF_SELECTED_TAB = Number(i);
							for (var cnt = 0; cnt < _this.SELECTABLE_LENGTH; cnt++) {
								var e = _this.SELECTABLE_TAB_LIST[cnt];
								if (e === _this.SELECTABLE_TAB_LIST[i]) {
									e.setAttribute('tabindex', '0');
									e.setAttribute('aria-selected', 'true');
								} else {
									e.setAttribute('tabindex', '-1');
									e.setAttribute('aria-selected', 'false');
								}
							}
							for (var cnt = 0; cnt < _this.ITEMLENGTH; cnt++) {
								var e = _this.TABLIST_ITEMS[cnt];
								var forA11y = e.querySelector('.for-a11y');
								e.panel = e.getAttribute('aria-controls') ? document.getElementById(e.getAttribute('aria-controls')) : null;
								if (e.panel) {
									e.panel.setAttribute('role', 'tabpanel');
									if (!isMobile()) {
										e.panel.setAttribute('tabindex', '0');
									}
									if (e.hasAttribute('aria-label')) {
										e.panel.setAttribute('aria-label', e.getAttribute('aria-label'))
									}

									if ((!e.panel.hasAttribute('aria-label') && !e.innerText.length <= 0)) {
										if (forA11y) {
											e.panel.setAttribute('aria-label', forA11y.innerText);
										}
									}

									if (!e.panel.contains(document.querySelector('.material-icons')) && e.innerText.length > 0) {
										e.panel.setAttribute('aria-label', e.innerText);
									}
								}
								if (e === _this.TABLIST_ITEMS[i]) {
									e.panel ? e.panel.classList.remove('hide')
										: false;
								} else {
									e.panel ? e.panel.classList.add('hide')
										: false;
								}
							}
						}
					},
					get() {
						//The Getter property for getting selected tab's index value
						return _this.INDEX_OF_SELECTED_TAB;
					}
				}
			})

			function setInitAndLoad() {// creation function
				/*
				if you want to set a tab element of the specific index by default, please put aria-selected="true" attribute to the tab element that you want to set in your HTML file.
 
				you've not to set the default tab necessarily, If you didn't set a default tab, the first tab will be selected by default.
 
				And if you set the aria-selected = "true" at the two tab element, default tab will be set to last aria-selected="true" element.
				*/
				_this.select = _this.DEFAULT_SELECTED_TAB ? Array.prototype.indexOf.call(_this.TABLIST_ITEMS, _this.DEFAULT_SELECTED_TAB) : 0; // select init
				for (var i = 0; i < _this.ITEMLENGTH; i++) {
					//TabItem for-Statement
					var e = _this.TABLIST_ITEMS[i];

					// response condition, case: role = "tab" element is nested in li container
					if (e.parentElement instanceof HTMLLIElement) {
						e.parentElement.setAttribute('role', 'none');
					}


					e.addEventListener('click', function () { // Event for mouse left-click to select

						var idx = Array.prototype.indexOf.call(_this.SELECTABLE_TAB_LIST, this);
						//get index of tab items

						_this.select = idx //select tab by refer the clicked tab item index
					});

					e.addEventListener('keydown', function (e) {//Event for switch Tabs by press arrow, Home End keys.

						var keySTR = e.code;//key value for switch statement
						/*
										you must not need to define an aria-orientation attribute when creating the horizontal tab controls.
										But, if you want to define it for semantic mark-up, you can use the "horizontal" value.
						*/
						var Next = _this.IS_VERTICAL_TAB ? 'ArrowDown' : 'ArrowRight'
						var Prev = _this.IS_VERTICAL_TAB ? 'ArrowUp' : 'ArrowLeft'
						var Home = 'Home';
						var End = 'End';
						var FocusingIndex = Array.prototype.indexOf.call(_this.SELECTABLE_TAB_LIST, this);
						switch (keySTR) {
							case Next:
								if (_this.TABLIST_CONTAINER.getAttribute('data-mode') === 'aria1.1') {
									if (_this.select < _this.SELECTABLE_LENGTH - 1) {
										_this.select = (_this.select + 1);//Select Next Tab Element of the Selected Current Tab
										_this.SELECTABLE_TAB_LIST[_this.select].focus();
									} else {
										_this.select = 0;
										_this.SELECTABLE_TAB_LIST[_this.select].focus();
									}
								}


								if (_this.TABLIST_CONTAINER.getAttribute('data-mode') === 'aria1.1_click') {
									if (_this.select < _this.SELECTABLE_LENGTH - 1) {
										_this.SELECTABLE_TAB_LIST[_this.select + 1].click();//Select Next Tab Element of the Selected Current Tab                                                                                
										_this.SELECTABLE_TAB_LIST[_this.select].focus();
									} else {
										_this.SELECTABLE_TAB_LIST[0].click();//Select Next Tab Element of the Selected Current Tab                                                                                
										_this.SELECTABLE_TAB_LIST[_this.select].focus();
									}
								}

								if (_this.TABLIST_CONTAINER.getAttribute('data-mode') === 'aria1.2') {
									if (FocusingIndex < _this.SELECTABLE_LENGTH - 1) {
										_this.SELECTABLE_TAB_LIST[FocusingIndex + 1].focus();
									}
									if (!_this.SELECTABLE_TAB_LIST[FocusingIndex + 1]) {
										_this.SELECTABLE_TAB_LIST[0].focus();
									}
								}

								break;

							case Prev:
								if (_this.TABLIST_CONTAINER.getAttribute('data-mode') === 'aria1.1') {
									if (_this.select > 0) {
										_this.select = (_this.select - 1);//Select Previous Tab Element of the Selected Current Tab
									} else {
										_this.select = _this.SELECTABLE_LENGTH - 1;
									}
									_this.SELECTABLE_TAB_LIST[_this.select].focus();
								}

								if (_this.TABLIST_CONTAINER.getAttribute('data-mode') === 'aria1.1_click') {
									if (_this.select > 0) {
										_this.SELECTABLE_TAB_LIST[_this.select - 1].click();//Select Previous Tab Element of the Selected Current Tab
										_this.SELECTABLE_TAB_LIST[_this.select].focus();
									} else {
										_this.SELECTABLE_TAB_LIST[_this.SELECTABLE_LENGTH - 1].click();
										_this.SELECTABLE_TAB_LIST[_this.select].focus();
									}
								}

								if (_this.TABLIST_CONTAINER.getAttribute('data-mode') === 'aria1.2') {
									if (FocusingIndex > 0) {
										_this.SELECTABLE_TAB_LIST[FocusingIndex - 1].focus();//Select Previous Tab Element of the Selected Current Tab
									}
									if (!_this.SELECTABLE_TAB_LIST[FocusingIndex - 1]) {
										this.SELECTABLE_TAB_LIST[_this.SELECTABLE_LENGTH - 1].focus();
									}
								}

								break;

							case 'Enter':
								if (_this.TABLIST_CONTAINER.getAttribute('data-mode') === 'aria1.2') {
									this.click();
								}
								break;
							case 'Space':
								if (_this.TABLIST_CONTAINER.getAttribute('data-mode') === 'aria1.2') {
									this.click();
								}
								break;

							case Home:
								if (_this.TABLIST_CONTAINER.getAttribute('data-mode') === 'aria1.1') {
									_this.select = 0;//Select First Tab Element
									_this.SELECTABLE_TAB_LIST[_this.select].focus();
								} else if (_this.TABLIST_CONTAINER.getAttribute('data-mode') === 'aria1.1_click') {
									_this.SELECTABLE_TAB_LIST[0].click();
									_this.SELECTABLE_TAB_LIST[0].focus();
								} else if (_this.TABLIST_CONTAINER.getAttribute('data-mode') === 'aria1.2') {
									_this.SELECTABLE_TAB_LIST[0].focus();
								}
								break;

							case End:
								if (_this.TABLIST_CONTAINER.getAttribute('data-mode') === 'aria1.1') {
									_this.select = _this.SELECTABLE_LENGTH - 1;//Select Last Tab Element
									_this.SELECTABLE_TAB_LIST[_this.select].focus();
								} else if (_this.TABLIST_CONTAINER.getAttribute('data-mode') === 'aria1.1_click') {
									_this.SELECTABLE_TAB_LIST[_this.SELECTABLE_LENGTH - 1].click();
									_this.SELECTABLE_TAB_LIST[_this.SELECTABLE_LENGTH - 1].focus();
								} else if (_this.TABLIST_CONTAINER.getAttribute('data-mode') === 'aria1.2') {
									_this.SELECTABLE_TAB_LIST[_this.SELECTABLE_LENGTH - 1].focus();
								}
								break;
						}
					})
				}
			}


			setInitAndLoad();// Tab Script Ended
		}
	}

	(function () {//creation tabs automatically that are written by using correct structure pattern on this page

		var TAB = new TabElementCollection();//create object

		TAB.Initialization();//tab creation start(default usage)


	})();//self calling function for Security
};

// waiAriaListBox
var waiAriaListBox = function waiAriaListBox() {
	var boxBtns = document.querySelectorAll('[aria-haspopup="listbox"]');
	boxBtns.forEach(function (boxBtn) {
		var ariaListBox = document.querySelector('#' + boxBtn.getAttribute("aria-controls"));
		var listOptions = ariaListBox.querySelectorAll('[role="option"]');

		boxBtn.addEventListener("click", function (e) {
			setTimeout(function () {
				if (boxBtn.getAttribute("aria-expanded", "true")) {
					const listSelected = ariaListBox.querySelector('[role="option"][aria-selected="true"]');
					if (listSelected) {
						listSelected.focus();
					} else {
						listOptions[0].focus();
					}
				}
			}, 500);
		});

		boxBtn.addEventListener("keydown", function (e) {
			if (e.keyCode === 38) {
				// up
				boxBtn.click();
				e.preventDefault();
			}
			if (e.keyCode === 40) {
				// down
				boxBtn.click();
				e.preventDefault();
			}
		});

		var _loop = function _loop(i) {
			listOptions[i].tabIndex = -1;
			const listSelected = ariaListBox.querySelector('[role="option"][aria-selected="true"]');
			if (listSelected) {
				listSelected.tabIndex = 0;
			} else {
				listOptions[0].tabIndex = 0;
			}

			listOptions[i].addEventListener("click", function () {
				listSelectEvent(ariaListBox, listOptions[i]);
			});

			listOptions[i].addEventListener("keydown", function (e) {
				if (e.keyCode === 13) {
					// enter
					listOptions[i].click();
					e.preventDefault();
					e.stopPropagation();
				}
				if (e.keyCode === 38) {
					// up
					if (i == 0) {
						listOptions[listOptions.length - 1].focus();
					} else {
						listOptions[i - 1].focus();
					}
					e.preventDefault();
				}
				if (e.keyCode === 40) {
					// down
					if (i == listOptions.length - 1) {
						listOptions[0].focus();
					} else {
						listOptions[i + 1].focus();
					}
					e.preventDefault();
				}
				if (e.keyCode === 9 || e.keyCode === 27) {
					// tab, esc
					boxBtn.click();
					boxBtn.focus();
					e.preventDefault();
				}
			});
		};

		for (var i = 0; i < listOptions.length; i++) {
			_loop(i);
		}
	});

	function listSelectEvent(ariaListBox, listOption) {
		const selected = ariaListBox.querySelector('[role="option"][aria-selected="true"]');
		if (!selected) {
			listOption.setAttribute("aria-selected", true);
		}
		if (selected !== listOption) {
			if (selected !== null) {
				selected.setAttribute("aria-selected", false);
				listOption.setAttribute("aria-selected", true);
			} else {
				listOption.setAttribute("aria-selected", true);
			}
		}
	}
};

// ariaCurrent
function ariaCurrent(element) {
	var ariaCurrentElements = element.querySelectorAll('[aria-current]')
	var _loop = function (i) {
		ariaCurrentElements[i].addEventListener("click", function () {
			ariaCurrentEvent(element, ariaCurrentElements[i])
		})
	}
	for (var i = 0; i < ariaCurrentElements.length; i++) {
		_loop(i)
	}
	function ariaCurrentEvent(element, ariaCurrentElement) {
		const currentTrue = element.querySelector('[aria-current="true"]')
		if (!currentTrue) {
			ariaCurrentElement.setAttribute("aria-current", "true")
		}
		if (currentTrue !== ariaCurrentElement) {
			if (currentTrue !== null) {
				currentTrue.setAttribute("aria-current", "false")
				ariaCurrentElement.setAttribute("aria-current", "true")
			} else {
				ariaCurrentElement.setAttribute("aria-current", "true")
			}
		}
	}
}

// radioAsButton
function radioAsButton(Container) {
	const Controllers = Container.querySelectorAll('label');
	const RealControllers = Container.querySelectorAll('input');
	$(RealControllers).css("display", "none")
	Controllers.forEach(_ => {
		_.setAttribute("role", "button")
		initialize()
		_.addEventListener("click", function () {
			initialize()
		})
		function initialize() {
			const real = Container.querySelector("#" + _.htmlFor)
			if (real) {
				if (real.checked) {
					$(Container).find("label").attr("aria-current", "false")
					_.setAttribute("aria-current", "true")
				}
			}
		}
	});
}