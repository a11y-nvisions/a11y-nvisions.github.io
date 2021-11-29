/**
 * jQuery 라이브러리 버전이 1.7.0 미만이거나 없을 경우 jQuery 최신 버전 적용
 */
 try {
  var jScript = document.createElement("script");
  jScript.type = "text/javascript";
  jScript.charset = "utf-8";
  jScript.src = "https://code.jquery.com/jquery-latest.min.js";
  
  var jQuery_version = jQuery.fn.jquery.split(".").map(Number); // 페이지에 적용된 jQuery 버전을 가져옴
  var jQuery_minimum_version = 17; // jQuery 최소 버전 1.7.0
  
  jQuery_version = jQuery_version[0] * 10 + jQuery_version[1];
  if (!(jQuery_version >= jQuery_minimum_version)){
	  document.getElementsByTagName("head")[0].appendChild(jScript);
  }
  
} catch { // jQuery가 없을 경우 예외처리 하여 최신 버전을 적용함
	document.getElementsByTagName("head")[0].appendChild(jScript);
}

  var btns = document.querySelectorAll('[screen-reader-live]');
  btns.forEach(function (btn) {
    btn.addEventListener('click', function() {
      if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
        announceForAccessibility("");
      } else {
        if (btn.getAttribute("aria-label")) {
          var ua = navigator.userAgent.toLowerCase();
          var isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");
          if(isAndroid) {
            setTimeout(function() {
              announceForAccessibility(btn.getAttribute("aria-label"));
            }, 150);
          } else {
            announceForAccessibility("");
          };
        } else {
			setTimeout(function() {
        announceForAccessibility(btn.textContent);
		}, 80);
        };
      };
          });
  });

/**
 * div 안 p 태그에 메시지 삽입 후 body 끝에 추가하며 2초 후 삭제하는 함수
 * div 의 name 은 div_announceForAccessibility 를 사용함 (해당 태그를 삭제하기 위함)
 */
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
