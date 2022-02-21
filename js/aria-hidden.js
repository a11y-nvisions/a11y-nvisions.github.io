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
    if (jQuery_minimum_version > jQuery_current_version){
      document.getElementsByTagName("head")[0].appendChild(jScript);
    }
  
  } catch { // jQuery가 없을 경우 예외처리 하여 최신 버전을 적용함
    document.getElementsByTagName("head")[0].appendChild(jScript);
  }
  
  // DOM 을 미리 로드시켜 라이브러리를 정상적으로 작동시키기 위함
  window.addEventListener('load', function() {
  
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
        btn.addEventListener('mousedown', function() {
            beforeOuterHtml = hiddenEl.outerHTML;
        });
    } else {
   btn.addEventListener('focus', function() {
       beforeOuterHtml = hiddenEl.outerHTML;
    });
    };
   btn.addEventListener('click', function() {
        setTimeout(function() {
            if (beforeOuterHtml === hiddenEl.outerHTML) {
                return;
            } else if ($(hiddenEl).attr("aria-hidden") === "false") {
                hiddenTrue(btn, hiddenEl);
            } else if ($(hiddenEl).attr("aria-hidden") === "true") {
                hiddenFalse(btn, hiddenEl);
            };
        }, 500);
        if (hiddenEl) {
            setTimeout(function() {

            let observer = new MutationObserver((mutations) => {
                    hiddenEl.removeAttribute('aria-hidden',);
                    hiddenEl.setAttribute('aria-hidden', true);
                    $(hiddenEl).find("a, button, input, select").attr("tabindex", "-1");
                btn.focus();
                observer.disconnect();
            });
            let option = {
                attributes: true,
                CharacterData: true
              };
              observer.observe(hiddenEl, option);
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

 });