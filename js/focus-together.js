
      document.querySelectorAll('a[href]').forEach((el,index)=>{
        const text = el.innerText;
        el.setAttribute('role','link');
        el.setAttribute('aria-label',text);

        el.querySelectorAll('*:not(img)').forEach((el,index)=>{
            el.setAttribute('role','none');
            el.setAttribute('aria-hidden','true');
        });
      })
    