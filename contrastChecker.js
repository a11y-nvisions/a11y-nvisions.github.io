const ALL = document.body.querySelector('*:not(script)');
for( let i=0; i<ALL.length; i++){
    ALL[i].setAttribute( 'data-contrast-ratio',ContrastCheckFromElement(ALL[i]))
}

function ContrastCheckFromElement(el){
    const ElStyle = window.getComputedStyle(el);
    const bg = extractRGBNumber(ElStyle.background)
    const fg = extractRGBNumber(ElStyle.color);
    const result = calcContrast_RGB(bg,fg)
    return result ? result +':1' : 'this element got an unavailable color value';
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