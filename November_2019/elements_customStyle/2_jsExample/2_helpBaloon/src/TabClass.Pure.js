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
		this.HelperState=false;
		this.Elements={// Elements Object Start
			instdir:document.querySelector(inst),
			root:document.createElement('div'),
			ThemeButtons:[],
			Helper:{
				HelpBaloon:document.createElement('div')
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
	
	createElements(){
	const root=this;
	let dir=this.Elements.instdir;
	let TabBox=this.Elements.Tab.Box;
	let TabItems=this.Elements.Tab.TabItems;
	let PanelBox=this.Elements.Panel.Box;
	let TabPanels=this.Elements.Panel.PanelItems;
	let TabPanelContents=this.Elements.Panel.PanelContents
	let btnToggleTheme=this.Elements.ThemeButtons;
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
			//for the Tab Helper
			//set Class at Container Elements
			Wrap.className='Tab-Wrapper'
			TabBox.className='TabItems-List'
			TabBox.setAttribute('role','tablist');
			PanelBox.className='PanelItems-List'
			//Append Elements
			TabPanels[i].prepend(btnToggleTheme[i]);
			TabPanels[i].appendChild(TabPanelContents[i]);
			TabBox.appendChild(TabItems[i])
			PanelBox.appendChild(TabPanels[i]);
			Wrap.appendChild(TabBox);
			Wrap.appendChild(PanelBox);
			dir.appendChild(Wrap);
			//set tab button state and panel display styles
			this.setDefault=this.index;
			//set helper button state and helper tip display styles
			this.setTabhelperState=this.HelperState;
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