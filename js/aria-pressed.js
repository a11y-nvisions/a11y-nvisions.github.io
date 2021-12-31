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

function removeAnnounceForAccessibility() {
  $("[name='div_announceForAccessibility']").remove();
}

// DOM 을 미리 로드시켜 라이브러리를 정상적으로 작동시키기 위함
window.addEventListener('load', function() {

  /**
   * 토글 버튼 이벤트
   * DOM의 모든 버튼 (<Button>, <input type="button">,<a role="button"> 등) 클릭 시 발생하는 이벤트 (누름 상태 변경)
   * aria-pressed = "true" or "false"
   */
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
	var timeout = setTimeout(function() {
    if (isAndroid) {
      if (beforeOuterHtml === _this.outerHTML) { 
         $this.attr("aria-disabled", "true");
      } else if ($this.attr("aria-pressed") === "true") {
        $this.removeAttr("aria-disabled");
        $this.attr("aria-pressed", "false");
        announceForAccessibility("꺼짐");
      } else {
        $this.removeAttr("aria-disabled");
        $this.attr("aria-pressed", "true");
        announceForAccessibility("켜짐");
    }; 
  } else {
		if (beforeOuterHtml === _this.outerHTML){ 
      $this.attr("aria-disabled", "true");  
    } else if ($this.attr("aria-pressed") === "true") {
      $this.removeAttr("aria-disabled");
  $this.attr("aria-pressed", "false");
		} else {
      $this.removeAttr("aria-disabled");
		  $this.attr("aria-pressed", "true");
  };
    };
	}, 500);

  });
  
});