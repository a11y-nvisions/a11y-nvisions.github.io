const ALL = document.body.querySelectorAll('*:not(script):not(img):not(figure):not(svg):not(iframe):not(frame), * :not(svg)');

alert('검사결과가 표시되었습니다. \n 검사결과 텍스트를 지우려면 Alt+`(~ : 물결기호)를 누르십시오.');
for( let i=0; i<ALL.length; i++){
    const TAGNAME = ALL[i].tagName.toLowerCase();
    const CLASSTEXT = ALL[i].classList.length > 0 ? getClassText(ALL[i]) : '';
    const ID = ALL[i].id ? '#'+ALL[i].id : '';
    const isHide = (window.getComputedStyle(ALL[i]).display === 'none' ||
    window.getComputedStyle(ALL[i]).visibility === 'hidden' ||
    window.getComputedStyle(ALL[i]).contentVisibility === 'hidden') ? 'true' : 'false'

    const SELECTOR_TEXT = TAGNAME+ID+CLASSTEXT;
    ALL[i].setAttribute('data-is-hide',isHide)
    ALL[i].setAttribute('data-view-path',SELECTOR_TEXT);
    ALL[i].setAttribute('data-contrast-ratio',ContrastCheckFromElement(ALL[i]));
}

function getClassText(el){
    let Text = '';
    const classList = el.classList;
    for(let i=0; i<classList.length; i++){
        const element = classList[i];
        Text+='.'+element
    }
    return Text;
}

document.addEventListener('keydown',removeCheckedResult);
function removeCheckedResult(e){
    if(e.altKey && e.key === '`' ){
        for( let i=0; i<ALL.length; i++){                
            ALL[i].removeAttribute('data-is-hide');
            ALL[i].removeAttribute('data-view-path')
            ALL[i].removeAttribute('data-contrast-ratio');
        }
        alert('검사 결과 제거됨');
        document.removeEventListener('keydown',removeCheckedResult);
    }
}

function ContrastCheckFromElement(el){
    const ElStyle = window.getComputedStyle(el);

    const bg = extractRGBNumber(ElStyle.background)
    const fg = extractRGBNumber(ElStyle.color);

    const hasGradient = ElStyle.background.indexOf('linear-gradient') > -1;
    const hasImage = ElStyle.background.indexOf('url') > -1;

    const result = calcContrast_RGB(bg,fg);
    
    if(hasGradient || hasImage){
        return '자동 측정 불가(그라데이션 또는 이미지)';
    }
    return result ? result +':1' : '측정 불가능';
}

function extractRGBNumber(colorStyleString){
    const s = colorStyleString;
    const FindColorCode = /^rgba*|\({1}|\){1}/gi
    const f = s.search(FindColorCode);
    const l = s.indexOf(s.match(FindColorCode).pop())+1;
    const c = s.slice(f,l)

    const result = c.replace(FindColorCode,'').split(',',3)

    for(let i=0; i<result.length; i++){
        result[i] = Number(result[i])
    }
    return result;
}

function calcContrast_RGB(background, foreground){
    const L1 = calculateRelativeLuminance(...background);
    const L2 = calculateRelativeLuminance(...foreground);
    if(L2 > L1){
        return ( (L2 + 0.05) / (L1 + 0.05) ).toFixed(2);
    }
    if(L1 > L2){
        return ( (L1 + 0.05) / (L2 + 0.05) ).toFixed(2);
    }
}

function calculateRelativeLuminance(R8bit, G8bit, B8bit) {

    var RsRGB = R8bit/255;
    var GsRGB = G8bit/255;
    var BsRGB = B8bit/255;

    var R = (RsRGB <= 0.03928) ? RsRGB/12.92 : Math.pow((RsRGB+0.055)/1.055, 2.4);
    var G = (GsRGB <= 0.03928) ? GsRGB/12.92 : Math.pow((GsRGB+0.055)/1.055, 2.4);
    var B = (BsRGB <= 0.03928) ? BsRGB/12.92 : Math.pow((BsRGB+0.055)/1.055, 2.4);

    // For the sRGB colorspace, the relative luminance of a color is defined as: 
    var L = 0.2126 * R + 0.7152 * G + 0.0722 * B;

    return L;
}