/**
* targetValue1에 해당하는 요소에 id를 부여하며, targetValue2에 해당하는 요소에 aria-controls 혹은 aria-describedby 와 연결합니다.
* ex) createElementsId("target1", "target2", "aria-controls") 로 선언 시 target1 이라는 class 및 name을 가진 요소에 id 부여 및 target2에 aria-controls id 혹은 aria-desciredby id 부여
* document를 읽는 순서대로 속성을 주기 때문에 변경할 수 없음
*/
function createElementsId(targetValue1, targetValue2, ariaProperty) {  
  var elements1 = document.querySelectorAll("." + targetValue1 + ", [name=" + targetValue1 + "]");
  var elements2 = document.querySelectorAll("." + targetValue2 + ", [name=" + targetValue2 + "]");

  if (elements1 != null && elements2 != null) {

    Array.from(elements1).forEach(function(els, idx) {
      var id = targetValue1 + "_" + idx;
      els.setAttribute("id", id);
      document.querySelectorAll("." + targetValue2 + ", [name=" + targetValue2 + "]")[idx].setAttribute(ariaProperty, id);
    });
  }

}
