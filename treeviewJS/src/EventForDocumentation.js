'use strict';
(function (){
    var btn_tree_open = document.querySelector('#treeOpen');
    var media = window.matchMedia('(max-width:1024px)');

    Object.defineProperty(btn_tree_open,'expand_tree',{
        get:function(){
            return this.getAttribute('aria-expanded') === 'true' ? true : false;
        },
        set:function(v){
            this.setAttribute('aria-expanded',v);
            var target = document.getElementById(this.getAttribute('aria-controls'))
            if(this.hasAttribute('aria-controls') && target){
                target.classList.toggle('hide-tree',!this.expand_tree);
            }

            if(!v){
                this.querySelector('.material-icons').innerHTML='keyboard_arrow_right';
            }else{
                this.querySelector('.material-icons').innerHTML='keyboard_arrow_left';
            }
        }
    });

    function mobileLayoutEvent (v){
        function listenerCallback(){
            this.expand_tree = !this.expand_tree;
        }
        if(v){
            btn_tree_open.expand_tree = false;
            btn_tree_open.addEventListener('click',listenerCallback);
        }else{
            btn_tree_open.expand_tree = true;
            btn_tree_open.removeEventListener('click',listenerCallback);
        }
    }

    media.addEventListener('change',function(e){
        btn_tree_open.classList.toggle('hide',!e.matches);
        btn_tree_open.expand_tree = false;
        mobileLayoutEvent(e.matches);
    })

    btn_tree_open.classList.toggle('hide',!media.matches);
    if(media.matches){
        btn_tree_open.expand_tree = false;
        mobileLayoutEvent(true);
    }
})();