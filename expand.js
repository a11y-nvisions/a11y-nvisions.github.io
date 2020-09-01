var btnMoreArticles = document.getElementById('btnMore_Articles');
var ArticleList = document.getElementById('article_list');
btnMoreArticles.addEventListener('click',function(){
    this.getAttribute('data-state-expanded') === 'true' ? (
        this.setAttribute('data-state-expanded','false'),
        this.innerHTML='더 보기',
        this.setAttribute('aria-label','8월 포럼 아티클 '+this.innerHTML),
        ArticleList.classList.replace('show','hide')
    ) :
    (
        this.setAttribute('data-state-expanded','true'),
        this.innerHTML='목록 접기',
        this.setAttribute('aria-label','8월 포럼 아티클 '+this.innerHTML),
        ArticleList.classList.replace('hide','show')
    )
})