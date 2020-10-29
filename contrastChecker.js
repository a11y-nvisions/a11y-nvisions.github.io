const ALL = document.body.querySelectorAll('*:not(script):not(img):not(figure):not(svg):not(iframe):not(frame), * :not(svg)');

Element.prototype.getParents = function(){
    var parentsList = []
    var start = this;
    while(start.parentElement){
        parentsList.push(start.parentElement);   
        start=start.parentElement;
    }
    return parentsList;
}

alert(`검사결과가 표시되었습니다.
이 기능을 끄려면 새로고침 하십시오.
결과 내용을 보려면 마우스 포인터를 보고싶은 요소에 올리고, 마우스 왼쪽 버튼 클릭을 하십시오.`);
for( let i=0; i<ALL.length; i++){
    const ElStyle = window.getComputedStyle(ALL[i])
    const TAGNAME = ALL[i].tagName.toLowerCase();
    const CLASSTEXT = ALL[i].classList.length > 0 ? getClassText(ALL[i]) : '';
    const ID = ALL[i].id ? '#'+ALL[i].id : '';
    const SELECTOR_TEXT = TAGNAME+ID+CLASSTEXT;
    ALL[i].setAttribute('data-view-path',SELECTOR_TEXT);
    ALL[i].setAttribute('data-background-color',ElStyle.backgroundColor);
    ALL[i].setAttribute('data-font-color',ElStyle.color);
    ALL[i].setAttribute('data-contrast-ratio',ContrastCheckFromElement(ALL[i]));
    ALL[i].addEventListener('click',showResult,{capture:false});
}

function showResult(e){
    e.stopPropagation();
    e.preventDefault();
    const bg_color = this.getAttribute('data-background-color');
    const fg_color = this.getAttribute('data-font-color');
    const c_ratio = this.getAttribute('data-contrast-ratio');
    const s_path = this.getAttribute('data-view-path');
    alert(`
        배경:${bg_color}
        전경:${fg_color}
        명도대비:${c_ratio}
        셀렉터 경로:${s_path}
    `);
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

function ContrastCheckFromElement(el){
    const ElStyle = window.getComputedStyle(el);

    
    const hasGradient = ElStyle.background.indexOf('linear-gradient') > -1;
    const hasImage = ElStyle.background.indexOf('url') > -1;
    
    if(hasGradient || hasImage){
        return '자동 측정 불가(그라데이션 또는 이미지)';
    }

    let bg = extractRGBNumber(ElStyle.background);
    let fg = extractRGBNumber(ElStyle.color);
    let result;

    if(bg.alpha === 0){
        const parents = bg.getParents()
        for(let i=0; i<parents.length; i++){
            const ParentBG = extractRGBNumber(window.getComputedStyle(parents[i]).background);
            if( ParentBG.alpha === 0){
                continue;
            }else{
                bg = ParentBG;
                break;
            }
        }
        result = calcContrast_RGB(bg.result,fg.result);
    }
}

function extractRGBNumber(colorStyleString){
    const s = colorStyleString;
    const FindColorCode = /^rgba*|\({1}|\){1}/gi
    const f = s.search(FindColorCode);
    const l = s.indexOf(s.match(FindColorCode).pop())+1;
    const c = s.slice(f,l)

    const result = c.replace(FindColorCode,'').split(',')
    
    for(let i=0; i<result.length; i++){
        result[i] = Number(result[i])
    }

    const withoutAlpha = c.replace(FindColorCode,'').split(',',3)


    return {result:withoutAlpha,alpha:result[3]};
}

function calcContrast_RGB(background, foreground){
    const L1 = calculateRelativeLuminance(...background);
    const L2 = calculateRelativeLuminance(...foreground);
    if(L2 >= L1){
        return ( (L2 + 0.05) / (L1 + 0.05) ).toFixed(2);
    }
    if(L1 >= L2){
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