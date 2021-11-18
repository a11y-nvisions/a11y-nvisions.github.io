/**
 * Jquery 라이브러리 최신 버전 호출
 * 이미 최신 버전이 존재할 경우 호출하지 않음
 */
var headScript = document.getElementsByTagName("head")[0].getElementsByTagName("script");
for (var i = 0, check = false; i < headScript.length; i++){
  if ("https://code.jquery.com/jquery-latest.min.js" === headScript[i].src){
    check = true;
    break;
  }
}
if (!check){
  var oScript = document.createElement("script");
  oScript.type = "text/javascript";
  oScript.charset = "utf-8";
  oScript.src = "https://code.jquery.com/jquery-latest.min.js";
  document.getElementsByTagName("head")[0].appendChild(oScript);
}

  var btns = document.querySelectorAll('[screen-reader-live]');
  btns.forEach(function (btn) {
    btn.addEventListener('click', function() {
      if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
        announceForAccessibility("");
      } else {
        announceForAccessibility(btn.textContent);
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
  }, 20);

  setTimeout(removeAnnounceForAccessibility, 200); // 0.2초 후 div_announceForAccessibility 삭제
}

/**
 * div 의 name 이 div_announceForAccessibility 인 태그를 하위까지 삭제
 */
function removeAnnounceForAccessibility() {
  $("[name='div_announceForAccessibility']").remove();
}
