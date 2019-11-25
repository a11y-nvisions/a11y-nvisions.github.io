
class Tab{
		constructor(name,inst,TabList,PanelContent){
		this.TabTextList=TabList;//TextList of Tab Items
		this.name=name;
		this.themeStyle=document.querySelector('#Theme');
		if(this.name==undefined){
			console.error('Require adding name property at the first argument of four arguments.');
			return false
		}
		this.contents=PanelContent;
		this.index=0;
		this.trackingToggleState=false;
		this.Elements={// Elements Object Start
			instdir:document.querySelector(inst),
			root:document.createElement('div'),
			ThemeButtons:[],
			TabHintPosToggle:document.createElement('button'),
			Helper:{
				TabLiveHint:document.createElement('div')
			},
			Tab:{
				Box:document.createElement('div'),
				TabItems:[]
			},
			Panel:{
				Box:document.createElement('div'),
				PanelItems:[],
				PanelContents:[]
			}
		}//Object End
		if( inst == undefined ){
			this.Elements.instdir=document.querySelector('body');
		}
 		this.createElements()
 	}
	
	set setDefault(val){
		//Variable Setting for Short Typing
		let TabItems=this.Elements.Tab.TabItems;
		let TabPanels=this.Elements.Panel.PanelItems;
		let Tabs=TabItems[val].parentElement.children;
		let Panels=TabPanels[val].parentElement.children;
		//set changed State
		TabItems[val].setAttribute('tabindex','0');//set focusable at selected 
		TabItems[val].setAttribute('aria-selected','true');//set selected state
		TabPanels[val].style.display='block';
		for(let i=0; i<Tabs.length; i++ ){
			if(Tabs[i] != TabItems[val]){
				Tabs[i].setAttribute('tabindex','-1');
				Tabs[i].setAttribute('aria-selected','false');
			}
			if(Panels[i] != TabPanels[val]){
				Panels[i].style.display='none';
			}
		}
	}
	
	set setTracking(val){
		let root=this;
		let TabBox=root.Elements.Tab.Box;
		let TabLiveHint=this.Elements.Helper.TabLiveHint;
		let TabHintPosToggle=this.Elements.TabHintPosToggle;
		if(val == true){
			TabHintPosToggle.setAttribute('aria-pressed',val);
			document.body.addEventListener('mousemove',hint_FollowPointer)
		}
		
		if(val == false){
			TabHintPosToggle.setAttribute('aria-pressed',val);
			hint_holdPosition();
			document.body.removeEventListener('mousemove',hint_FollowPointer);
		}
		
		function hint_FollowPointer(e){
			if(root.trackingToggleState == true){
				TabLiveHint.style.top=(e.pageY-40)+'px';
				TabLiveHint.style.left=(e.pageX-TabLiveHint.offsetWidth/2)+'px';
			}
		}
		
		function hint_holdPosition(){
			TabLiveHint.style.left='';
			TabLiveHint.style.top=(TabBox.offsetTop+TabBox.offsetHeight)+'px';
		}
	}
	
	set setIndex(val){
		//Variable Setting for Short Typing
		let TabItems=this.Elements.Tab.TabItems;
		let TabPanels=this.Elements.Panel.PanelItems;
		let Tabs=TabItems[val].parentElement.children;
		let Panels=TabPanels[val].parentElement.children;
		//set changed State
		TabItems[val].setAttribute('tabindex','0');//set focusable at selected 
		TabItems[val].setAttribute('aria-selected','true');//set selected state
		TabItems[val].focus();
		TabPanels[val].style.display='block';
		for(let i=0; i<Tabs.length; i++ ){
			if(Tabs[i] != TabItems[val]){
				Tabs[i].setAttribute('tabindex','-1');
				Tabs[i].setAttribute('aria-selected','false');
			}
			if(Panels[i] != TabPanels[val]){
				Panels[i].style.display='none';
			}
		}
	}
	
	HintEvent(){
		const root=this;
		let TabLiveHint=root.Elements.Helper.TabLiveHint;
		let TabBox=root.Elements.Tab.Box;
		let TabItems=root.Elements.Tab.TabItems;
		let Launchfade;
		let fadeIn;
		let fadeOut;
		for(let i=0; i<TabItems.length; i++){
			TabItems[i].addEventListener('focusin',function(){
				getHintMsg();
			})
			TabItems[i].addEventListener('focusout',function(){
				clearHintAnnouncement();
			})
		}
		
		function getHintMsg(e){
			fadeIn=setTimeout(function(){
				TabLiveHint.innerHTML='[힌트]탭 컨트롤, 오른쪽 또는 왼쪽 방향키로 탭 전환';
			},50)
				TabLiveHint.show();
			fadeOut=setTimeout(function(){
				TabLiveHint.innerHTML='';
				TabLiveHint.hide();
			},6000)
		}
		function clearHintAnnouncement(){
			clearTimeout(fadeIn);
			clearTimeout(fadeOut);
			TabLiveHint.hide();
			TabLiveHint.innerHTML='';
		}
	}
	
	
	createElements(){
		const root=this;
		let dir=this.Elements.instdir;
		let TabBox=this.Elements.Tab.Box;
		let TabItems=this.Elements.Tab.TabItems;
		let PanelBox=this.Elements.Panel.Box;
		let TabPanels=this.Elements.Panel.PanelItems;
		let TabPanelContents=this.Elements.Panel.PanelContents
		let btnToggleTheme=this.Elements.ThemeButtons;
		let TabLiveHint=this.Elements.Helper.TabLiveHint;
		let TabHintPosToggle=this.Elements.TabHintPosToggle;
		let Wrap=this.Elements.root;
		for(let i=0; i<this.TabTextList.length; i++){
			//Tab Button Tag
			TabItems[i]=document.createElement('button');//Create Button
			TabItems[i].setAttribute('role','tab');//set Semantic role for tab buttons
			TabItems[i].innerHTML=this.TabTextList[i];//Button Label
			TabItems[i].id=this.name+'-tab'+(i+1);
			//Tab Panel DIV Tag
			TabPanels[i]=document.createElement('div');//Create Content Box
			TabPanels[i].setAttribute('role','tabpanel');//set Semantic role for Tab panels
			TabPanels[i].setAttribute('aria-labelledby',this.name+'-tab'+(i+1));
			// Tab Panel COntent box
			TabPanelContents[i]=document.createElement('div');
			TabPanelContents[i].className='tabpanel-content';
			TabPanelContents[i].innerHTML=this.contents[i];
			//Turning Tab Theme Mode Buttons
			btnToggleTheme[i]=document.createElement('button');
			btnToggleTheme[i].setAttribute('aria-label','Turn Dark Mode');
			btnToggleTheme[i].className='Turn-mode';
			btnToggleTheme[i].innerHTML='DarkMode';
			//Toggle Tab Hint Text Position
			TabHintPosToggle.setAttributes({
				'aria-label':'Hint Box mouse Pointer Tracking',
				'class':'Toggle-HintBox-MouseTracking'
			})
			TabHintPosToggle.innerHTML=`
				<svg version="1.0" xmlns="http://www.w3.org/2000/svg"
				 viewBox="0 -40 250.000000 325.000000"
				 preserveAspectRatio="xMidYMid meet">
					<g transform="translate(0.000000,300.000000) scale(0.100000,-0.100000)">
					<path d="M358 2755 c-15 -9 -32 -24 -38 -35 -6 -12 -10 -158 -10 -397 0 -334
					2 -381 16 -402 34 -48 61 -51 397 -51 l313 0 173 -119 c95 -66 175 -121 178
					-124 2 -3 44 -277 92 -608 l87 -603 46 64 c25 36 107 153 182 260 l137 195
					301 101 301 100 -570 263 -570 263 -51 104 -52 104 305 0 c258 0 311 2 345 16
					70 28 70 26 70 443 l0 371 -29 32 -29 33 -784 2 c-677 2 -787 0 -810 -12z
					m401 -300 c56 -29 58 -125 3 -154 -95 -51 -183 74 -101 143 35 30 58 32 98 11z
					m335 -15 c32 -31 28 -96 -7 -126 -39 -33 -81 -31 -118 5 -40 40 -39 82 1 123
					27 26 36 30 67 25 20 -4 46 -16 57 -27z m307 1 c39 -40 39 -82 0 -122 -20 -20
					-39 -29 -61 -29 -38 0 -90 47 -90 82 0 53 45 98 98 98 13 0 37 -13 53 -29z
					m308 3 c85 -71 -16 -202 -107 -138 -70 49 -32 162 55 164 12 0 35 -12 52 -26z"/>
					<path d="M1995 836 c-32 -32 -40 -69 -25 -107 16 -39 46 -59 88 -59 44 0 79
					24 92 66 14 41 0 86 -34 109 -33 24 -93 19 -121 -9z"/>
					</g>
				</svg>
			`
			//for the Tab Helper
				TabLiveHint.setAttributes({
					'aria-live':'polite',
					'class':'live-hint-Message'
				}
			);
			//set Class at Container Elements
			Wrap.className='Tab-Wrapper'
			TabBox.className='TabItems-List'
			TabBox.setAttribute('role','tablist');
			PanelBox.className='PanelItems-List'
			//Append Elements
			TabPanels[i].prepend(btnToggleTheme[i]);
			Wrap.prepend(TabHintPosToggle);
			TabPanels[i].appendChild(TabPanelContents[i]);
			TabBox.appendChild(TabItems[i])
			PanelBox.appendChild(TabPanels[i]);
			Wrap.appendChild(TabBox);
			Wrap.appendChild(PanelBox);
			Wrap.appendChild(TabLiveHint);
			dir.appendChild(Wrap);
			//set tab button state and panel display styles
			this.setDefault=this.index;
			this.HintEvent();
			this.setTracking=this.trackingToggleState;
			//Event
			TabItems[i].addEventListener('keydown',function(e){//Keyboard Event
				if( e.keyCode == 39 ){
					if(root.index==TabItems.length-1){
						root.index=0;
						root.setIndex=root.index;
					}else{
						root.index++;
						root.setIndex=root.index;
					}
				}else if( e.keyCode == 37 ){
					if(root.index==0){
						root.index=TabItems.length-1;
						root.setIndex=root.index;
					}else{
						root.index--;
						root.setIndex=root.index;
					}
				}else if(e.keyCode==35){
					root.index=TabItems.length-1;
					root.setIndex=root.index;
				}else if(e.keyCode==36){
					root.index=0;
				}
			})//Event Ends
			
			btnToggleTheme[i].addEventListener('click',function(){//Toggle Event for Dark and Light Theme Mode
				for(let t=0; t<btnToggleTheme.length; t++){
					if(btnToggleTheme[t].getAttribute('aria-label') == 'Turn Dark Mode'){
						btnToggleTheme[t].setAttribute('aria-label','Turn Light Mode');
						btnToggleTheme[t].innerHTML='LightMode';
						root.themeStyle.setAttribute('href','style/Tab_DarkTheme.css');
						
					}else if(btnToggleTheme[t].getAttribute('aria-label') == 'Turn Light Mode'){
						btnToggleTheme[t].setAttribute('aria-label','Turn Dark Mode');
						btnToggleTheme[t].innerHTML='DarkMode';
						root.themeStyle.setAttribute('href','style/Tab_DefaultTheme.css');
					}
				}
			})
		}
		TabHintPosToggle.addEventListener('click',function(){
			if(root.trackingToggleState == true){
				root.trackingToggleState=false;
				root.setTracking=root.trackingToggleState;
			}else if(root.trackingToggleState == false){
				root.trackingToggleState=true;
				root.setTracking=root.trackingToggleState;
			}
		})
		let j;//Mouse Click Event
		for(j=0; j<TabItems.length; j++){
			(function(n){
				TabItems[n].addEventListener('click',function(e){
					root.index=n;
					root.setIndex=root.index;
				})
			})(j)//Event End
		}
	}
}

Element.prototype.show=function(displayType){
	let checkDisplayType=/inline|inline-block|block|flex|grid|table-cell/;
	if( checkDisplayType.test(displayType) == true ){
		this.style.display=displayType;
	}else{
		this.style.display='block';
	}
}

Element.prototype.hide=function(){
	this.style.display='none';
}

Element.prototype.setAttributes=function(){
	let arg1=arguments[0];
	let arg2=arguments[1];
	if(arguments.length < 3){
		if( (arg1.constructor == Object) && (arguments.length == 1) ){
			for( val in arg1){
				this.setAttribute(val,arg1[val]);
			}
		}else{
			console.error(`
				[Method Syntex Error]
				'setAttribute' method's first arguments must be add a object that has the attribute name text and attribute value text.
			`);
		}
	}else if(arguments.length > 1){
		console.error(`[Method Syntex Error]
			'setAttributes' method's arguments can't be got one number of arguments over.
		`);
	}
}