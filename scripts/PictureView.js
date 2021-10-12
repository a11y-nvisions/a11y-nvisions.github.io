    function setImagePicker(name){
      var StepGroup = document.querySelectorAll('[name="'+name+'"]');
      for (var i=0; i<StepGroup.length; i++){
        var El=StepGroup[i];
        El.labels[0].style.backgroundImage = "url("+document.getElementById(El.getAttribute('aria-controls')).src+")";
  
        El.addEventListener('input',function(e){
          var target = e.target;
          var controls = document.querySelector("#"+target.getAttribute('aria-controls'));
            StepGroup.forEach(function(el){
              var controls = document.querySelector("#"+el.getAttribute('aria-controls') );
              controls.classList.toggle('hide',el !== target);
              controls.classList.toggle('show',el === target);
            });
        })
      }
    }

    setImagePicker('steps');
    setImagePicker('themes');