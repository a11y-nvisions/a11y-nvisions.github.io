var wrapper = document.querySelector('.middle-wrapper');
function loadContent(){
    var lang = document.documentElement.lang.slice(0,2);
    var content_en = '\
    <main>\
        <p>Markup the accessible treeview element on your page!</p>\
        <a id="GoToDocumentation" href="./en/index.html">\
            <span class="small">Go to</span>\
            Documentation\
        </a>\
    </main>\
    ';
    var content_ko = '\
    <main>\
        <p>제작중인 페이지에 접근성이 좋은 트리뷰 요소를 마크업해보세요!</p>\
        <a id="GoToDocumentation" href="./ko/index.html">사용 가이드 문서\
            <span class="small">바로가기</span>\
        </a>\
    </main>\
    ';

    switch (lang){
        case 'en':
            wrapper.innerHTML = content_en;
        break;
        case 'ko':
            wrapper.innerHTML = content_ko;
        break;
    }
}

var detectLanguageHandler = function (){
    loadContent();
}
var radioStateHandler = function (){
    var languageSelector = document.querySelectorAll('.language-settings [role="radio"]');
    if(languageSelector[0].checked){
        document.documentElement.lang = 'en'
    }
    
    if(languageSelector[1].checked){
        document.documentElement.lang = 'ko'
    }
}

var languageDetector = new MutationObserver(detectLanguageHandler);
var RadioStateDetector = new MutationObserver(radioStateHandler);

var RadioStateDetector_config = {subtree:true,attributes:true,attributeFilter:['aria-checked']}
var langDetector_config = {attributes:true,attributeFilter:['lang','aria-checked']}

languageDetector.observe(document.documentElement,langDetector_config);
RadioStateDetector.observe(document.querySelector('.language-settings'),RadioStateDetector_config);

detectLanguageHandler();