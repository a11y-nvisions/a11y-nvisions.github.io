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
	var isAndroid = /(android)/i.test(navigator.userAgent);
	var ua = navigator.userAgent.toLowerCase();
	var btns = document.querySelectorAll('[screen-reader-live]');
	btns.forEach(function (btn) {
		btn.addEventListener('click', function () {
			if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
				announceForAccessibility("");
			} else {
				if (btn.getAttribute("aria-label")) {
					if (isAndroid) {
						if (btn.getAttribute("aria-label")) {
							setTimeout(function () {
								announceForAccessibility(btn.getAttribute("aria-label"))
							}, 150)
						}
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
		var isAndroid = /(android)/i.test(navigator.userAgent);
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
				var focusable = $($modal).find('a[href], input, select, textarea, button, [tabindex="0"], [contenteditable]').not('[disabled], [tabindex="-1"], :hidden')
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
	var focusable = $($modal).find('a[href], input, select, textarea, button, [tabindex="0"], [contenteditable]').not('[disabled], [tabindex="-1"], :hidden')
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
	setHiddenExceptForThis($modal);
	$modal.addEventListener('keydown', bindKeyEvt);
	let observer = new MutationObserver((mutations) => {
		setHiddenExceptForThis($modal, 'off');
		$modal.removeEventListener("keydown", bindKeyEvt, false);
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
		var isAndroid = /(android)/i.test(navigator.userAgent);
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
	var tablists = document.querySelectorAll('[role="tablist"]');
	tablists.forEach(function (tablist) {
		var tabBox = tablist.querySelectorAll('[role="tab"]');
		var firstTab = tabBox[0];
		var lastTab = tabBox[tabBox.length - 1];
		var hasSelected = false;

		var _loop = function _loop(i) {
			if (tabBox[i].getAttribute("aria-selected") == "true") {
				tabBox[i].tabIndex = 0;
				hasSelected = true;
			} else {
				tabBox[i].tabIndex = -1;
			}

			tabBox[i].addEventListener("click", function (e) {
				var target = e.currentTarget;
				tabBox.forEach(function (tab) {
					if (tab !== target) {
						tab.setAttribute("aria-selected", false);
						tab.tabIndex = -1;
					}
				});
				target.setAttribute("aria-selected", true);
				target.tabIndex = 0;
			});

			tabBox[i].addEventListener("keydown", function (e) {
				var target = e.currentTarget;
				if (!tablist.getAttribute("aria-orientation", "vertical")) {
					if (e.keyCode === 37) {
						// previous : left
						if (tablist.getAttribute('data-mode', 'aria1.2')) {
							if (target == firstTab) {
								lastTab.focus();
							} else {
								tabBox[i - 1].focus();
							}
						} else {
							target.setAttribute("aria-selected", false);
							target.tabIndex = -1;
							if (target == firstTab) {
								lastTab.setAttribute("aria-selected", true);
								lastTab.click();
								lastTab.tabIndex = 0;
								lastTab.focus();
							} else {
								tabBox[i - 1].setAttribute("aria-selected", true);
								tabBox[i - 1].click();
								tabBox[i - 1].tabIndex = 0;
								tabBox[i - 1].focus();
							}
						}
					} else if (e.keyCode === 39) {
						if (tablist.getAttribute('data-mode', 'aria1.2')) {
							// next : right,down
							if (target == lastTab) {
								firstTab.focus();
							} else {
								tabBox[i + 1].focus();
							}
						} else {
							// next : right,down
							target.setAttribute("aria-selected", false);
							target.tabIndex = -1;
							if (target == lastTab) {
								firstTab.setAttribute("aria-selected", true);
								firstTab.click();
								firstTab.tabIndex = 0;
								firstTab.focus();
							} else {
								tabBox[i + 1].setAttribute("aria-selected", true);
								tabBox[i + 1].click();
								tabBox[i + 1].tabIndex = 0;
								tabBox[i + 1].focus();
							}
						}
					} else if (e.keyCode === 32) {
						// select: space
						if (target.getAttribute("aria-selected") !== 'true') {
							target.setAttribute("aria-selected", true);
							target.click();
						}
					}
				}
				e.preventDefault
			});
		};

		for (var i = 0; i < tabBox.length; i++) {
			_loop(i);
		}
		if (!hasSelected) tabBox[0].tabIndex = 0;
	});
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
				if (boxBtn.getAttribute("aria-expanded", "true")) {
					boxBtn.setAttribute("aria-expanded", "false")
				}
				boxBtn.focus()
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
					listOptions[i - 1].focus();
					e.preventDefault();
				}
				if (e.keyCode === 40) {
					// down
					listOptions[i + 1].focus();
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
		$(Container).find('input:radio').click(function () {
			if ($(this).is(':checked')) {
				$(Container).find("label").attr("aria-current", "false")
				$('label[for=' + this.id + ']').attr("aria-current", "true")
			}
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

//dropdownmenu
var waiAriaHasPopupMenu = function waiAriaHasPopupMenu() {
	var haspops = document.querySelectorAll('[aria-haspopup="true"], [aria-haspopup="menu"]');
	haspops.forEach(function (haspop) {
		menuEvent(haspop)
	})
	function menuEvent(btn) {
		var popup = document.querySelector('#' + btn.getAttribute("aria-controls"));
		var isSub = !getClosestParent(btn, '[role="menu"]') ? false : true;
		if (!popup) return;

		var menuItems = popup.querySelectorAll('[role="menuitem"]')
		if (menuItems.length < 1) return;

		var menus = [];
		for (var i = 0; i < menuItems.length; i++) {
			menus.push(menuItems[i]);
		}

		var subPops = popup.querySelectorAll('[aria-haspopup="true"][role="menuitem"], [aria-haspopup="menu"][role="menuitem"]');
		var hasSubs = [];
		for (var i = 0; i < subPops.length; i++) {
			hasSubs.push(subPops[i]);
		}

		var subPops = [];
		for (var i = 0; i < hasSubs.length; i++) {
			subPops.push(popup.querySelector('#' + hasSubs[i].getAttribute("aria-controls")));
		}

		var _loop = function _loop(_i) {
			menus = menus.filter(function (menu) {
				return !subPops[_i].contains(menu);
			});
		};

		for (var _i = 0; _i < subPops.length; _i++) {
			_loop(_i);
		}

		var _loop2 = function _loop2(_i2) {
			menus[_i2].isSub = true;
			menus[_i2].addEventListener("keydown", function (e) {
				if (e.keyCode === 38) {
					// up
					if (menus[_i2] == menus[0]) {
						menus[menus.length - 1].focus();
					} else {
						menus[_i2 - 1].focus();
					}
					e.stopPropagation();
					e.preventDefault();
				}
				if (e.keyCode === 40) {
					// down
					if (menus[_i2] == menus[menus.length - 1]) {
						menus[0].focus();
					} else {
						menus[_i2 + 1].focus();
					}
					e.stopPropagation();
					e.preventDefault();
				}
				if (e.keyCode === 37) {
					// left
					if (btn.isSub && btn.getAttribute("role", "menuitem")) {
						btn.click();
						btn.focus();
						e.preventDefault();
					}
				}
			});
		};

		for (var _i2 = 0; _i2 < menus.length; _i2++) {
			_loop2(_i2);
		}

		btn.addEventListener("click", function (e) {
			setTimeout(function () {
				menus[0].focus();
				e.preventDefault();
			}, 500)
		});
		if (event.target !== null && menus) {
			menus[0].focus()
		}
		btn.addEventListener("keydown", function (e) {
			if (btn.isSub) {
				if (e.keyCode === 39) {
					// right
					btn.click();
					e.preventDefault();
				}
				if (e.keyCode === 38) {
					// up
					btn.click();
					setTimeout(function () {
						menus[menus.length - 1].focus();
					}, 600)
					e.preventDefault();
				}
				if (e.keyCode === 40) {
					// down
					btn.click();
					e.preventDefault();
				}
			}
		});

		btn.addEventListener("keypress", function (e) {
			if (e.keyCode === 32) {
				// space
				btn.click();
				event.preventDefault();
			}
		});
	};
};

function getClosestParent(el, query) {
	while (el.querySelector(query)) {
		el = el.parentNode
		if (!el) {
			return null
		}
	}
	return el
}

// create ids for children of target without id
function createIdForChildrenOf(
	/** @param {HTMLElement} targetElement This function is for giving a Id to each children of a target Element. If you didn't set the target when you call this function, default target will be set to a body tag in your product documents. It's the same with createIdForAllTag Method. */
	targetElement = document.body
) {
	(function ( /** @type {HTMLElement}*/ target = targetElement) {
		if (Boolean(target)) {
			function setInitializeAutoIdentifier(
						/**@type {HTMLElement[]|NodeList}*/ elements
			) {
				elements.forEach(/** @param {Element} $e*/($e) => {
					/** @type {string} */
					var $tagName = $e.tagName.toLowerCase();

					/** @type {RegEXP} */
					var ignoredTags = /^(html|head|link|script|style|body|meta|title)$/;

					/** @type {boolean} */
					var isIgnoredTag = ignoredTags.test($tagName);

					/** @type {HTMLElement[]} */
					var AllElems = Array.prototype.slice.call(document.body.querySelectorAll($tagName));

					/** @type {number} */
					var $docIndex = AllElems.indexOf($e) + 1;
					if (!isIgnoredTag) {
						$e.id = $e.id ? $e.id : "AIID_" + $e.tagName.toLowerCase() + "_" + $docIndex;
					}
				});
			}

			/**
				* 
				* @param {MutationRecord} Record 
				*/
			var MTO_Callback = (Record) => {
				setInitializeAutoIdentifier(Record.addedNodes ? Record.addedNodes : []);
			}
		/** @type {MutationObserverInit} */ var MTO_ObserveInitOptions = {
				subtree: true,
				childList: true,
			}
			var mtObserver = new MutationObserver(MTO_Callback);

			mtObserver.observe(target, MTO_ObserveInitOptions);
			setInitializeAutoIdentifier(document.querySelectorAll("*"));
		} else {
			throw new Error("Target element not found. Please check that you entered the correct selector and try again.");
		}

	})();
}

// create ids for all tag without id
function createIdForAllTag() {
	createIdForChildrenOf( /* default : document.body */);
}

// set as heading with level between 1 to 6

/**
	* @param {number} level :insert 1 to 6
	*/
Element.prototype.setAsHeading = function setToHeadingElement(level) {
	const target = this;
	if (typeof level == "number") {
		const Level = (level <= 6 && level >= 1) ? level : 1;
		const tagName = target.tagName.toLowerCase();
		const appliedTags = /^(div|b|u|i|s|p|strong|span|em)$/
		if (appliedTags.test(tagName)) {
			target.setAttribute('role', "heading");
			target.setAttribute('aria-level', Level);
		} else {
			throw new Error(`You're trying to set a ${tagName} tag as heading. it may be a mistake.`);
		}
	} else {
		throw new Error(`You typed a value that's not a number. Or, You didn't type anything at 'level' parameter. level parameter is required and it must be a number.`)
	}
};

/**
	* @param {HTMLElement} target
	* @param {number} level :insert 1 to 6
	*/
function setAsHeading(target, level) {
	if (typeof level == "number") {
		const Level = (level <= 6 && level >= 1) ? level : 1;
		const tagName = target.tagName.toLowerCase();
		const appliedTags = /^(div|b|u|i|s|p|strong|span|em)$/
		if (appliedTags.test(tagName)) {
			target.setAttribute('role', "heading");
			target.setAttribute('aria-level', Level);
		} else {
			throw new Error(`You're trying to set a ${tagName} tag as heading. it may be a mistake.`);
		}
	} else {
		const NumError = `You typed a value that's not a number. Or, You didn't type anything at 'level' parameter. level parameter is required and it must be a number.`;
		const ElementError = "\nYou insert a wrong element, Element not found. Please you make sure insert the correct HTML Element";
		const ErrorMsg = `${typeof level != "number" ? NumError : ""}${!target instanceof Element ? ElementError : ""}`;

		throw new Error(ErrorMsg);
	}
};