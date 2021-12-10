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
  
if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
    $("ul").attr("role", "list");
    $([timer]).each(function() {
      $(this).attr({
        "role" : "progressbar",
        "aria-valuetext" : "$(this).innerTEXT"
      });
    });
    }
  });