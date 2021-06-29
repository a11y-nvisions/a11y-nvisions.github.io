(this["webpackJsonpterrible-link-navigation"]=this["webpackJsonpterrible-link-navigation"]||[]).push([[0],{133:function(e,t,c){"use strict";c.r(t);var i=c(1),s=c.n(i),r=c(73),n=c.n(r),a=(c(85),c(86),c(21)),o=c(79),l=c(0),d=function(e){var t=e.children;return Object(l.jsx)("span",{className:"for-a11y",children:t})},j=function(e){var t=e.IconClassName,c=e.IconAltText;return Object(l.jsx)("span",{"aria-hidden":!c,className:t,children:c?Object(l.jsx)(d,{children:c}):""})};j.defaultProps={IconAltText:null,IconClassName:"icon-not_interested"};var u=c(80),b=c(76),h="Nvisions",m=function(e){var t,c=e.defaultPageIndex,s=e.showIndex,r=Object(i.useState)(c),n=Object(o.a)(r,2),h=n[0],m=n[1],p=[function(){return Object(l.jsxs)("div",{class:"text wide-margin",style:{textAlign:"center"},children:[Object(l.jsxs)("h2",{style:{margin:"5% 0"},children:[Object(l.jsx)("div",{role:"text",children:"Hey! iOS VoiceOver!"}),Object(l.jsx)("div",{role:"text",children:"please stop cutting the navigating focus of the inline text!"})]}),Object(l.jsx)("p",{children:"Dividing a text excessively is not good for other screen readers, too. but, I think maybe you guys know why web designers had been dividing the texts until now."}),Object(l.jsx)("p",{children:"Text styling makes web and app visual designers divide the VoiceOver focus regardless of their intention, unfortunately."}),Object(l.jsx)("p",{children:"They cannot be given up text styling."}),Object(l.jsx)("p",{children:"This is a dilemma of web styling and accessibility."}),Object(l.jsx)("p",{children:"but, now we must fix it for the acquiring information comfortable of everyone."})]})},function(){var e=[{productName:"D.I.D Smart Scissors Green",price:8.99,price_discounted:5.99,thumb:Object(l.jsx)(j,{IconClassName:"icon-scissors green"})},{productName:"D.I.D Smart Scissors Black",price:8.99,price_discounted:3.99,thumb:Object(l.jsx)(j,{IconClassName:"icon-scissors black"})},{productName:"D.I.D Smart Scissors Premium White",price:12.99,price_discounted:6.495,thumb:Object(l.jsx)(j,{IconClassName:"icon-scissors Premium white"})},{productName:"D.I.D Smart Scissors Premium Black",price:12.99,price_discounted:6.495,thumb:Object(l.jsx)(j,{IconClassName:"icon-scissors Premium black"})},{productName:"D.I.D Smart Scissors Premium Aurora Special Edition",price:18.99,price_discounted:12.99,thumb:Object(l.jsx)(j,{IconClassName:"icon-scissors Premium aurora"})}];return Object(l.jsxs)(l.Fragment,{children:[Object(l.jsx)("h2",{children:"Ugly navigating"}),Object(l.jsx)("p",{children:"Please navigate the below list items."}),Object(l.jsx)("ul",{className:"example-product_list",children:Object(l.jsx)(x,{stickyFocus:!1,List:e})})]})},function(){var e=[{productName:"D.I.D Smart Scissors Green",price:8.99,price_discounted:5.99,thumb:Object(l.jsx)(j,{IconClassName:"icon-scissors green"})},{productName:"D.I.D Smart Scissors Black",price:8.99,price_discounted:3.99,thumb:Object(l.jsx)(j,{IconClassName:"icon-scissors black"})},{productName:"D.I.D Smart Scissors Premium White",price:12.99,price_discounted:6.495,thumb:Object(l.jsx)(j,{IconClassName:"icon-scissors Premium white"})},{productName:"D.I.D Smart Scissors Premium Black",price:12.99,price_discounted:6.495,thumb:Object(l.jsx)(j,{IconClassName:"icon-scissors Premium black"})},{productName:"D.I.D Smart Scissors Premium Aurora Special Edition",price:18.99,price_discounted:12.99,thumb:Object(l.jsx)(j,{IconClassName:"icon-scissors Premium aurora"})}];return Object(l.jsxs)(l.Fragment,{children:[Object(l.jsx)("h2",{children:"Pretty navigating"}),Object(l.jsx)("p",{children:"The item links of this list can be swipe right or left once to navigate and hear the item text more quickly than a list of the previous page."}),Object(l.jsx)("ul",{className:"example-product_list",children:Object(l.jsx)(x,{stickyFocus:!0,List:e})})]})}],O=!!p[h-1],g=!!p[h+1],v=Object(i.useRef)(),f=Object(i.useRef)(),N=function(e){p[e]&&(m(e),setTimeout((function(){v.current.scrollIntoView()}),150))};function I(e){switch(e.target.id){case"page-next":N(h+1);break;case"page-prev":N(h-1)}setTimeout((function(){f.current&&f.current.focus()}),150)}return Object(i.useEffect)((function(){window.matchMedia("screen and (max-width:1024px)").addEventListener("change",(function(){setTimeout((function(){v.current.scrollIntoView()}),100)}))}),[v]),Object(l.jsxs)(l.Fragment,{children:[Object(l.jsx)(b.a,{children:Object(l.jsx)("title",{children:["VoiceOver Focus Issue - Intro","VoiceOver Focus Issue - Ugly navigating","VoiceOver Focus Issue - Pretty navigating"][h]})}),Object(l.jsx)("header",{children:Object(l.jsx)("h1",{children:"EXAMPLE-PAGE"})}),Object(l.jsx)("main",{children:Object(l.jsxs)("div",{className:"page-list-wrapper",children:[Object(l.jsxs)("div",(t={className:"controllers",role:"navigation"},Object(a.a)(t,"role","pagination"),Object(a.a)(t,"children",[Object(l.jsx)("button",{"aria-describedby":"current-page-index hint-prev",ref:g?null:f,disabled:!O,id:"page-prev",onClick:I,children:"Previous"}),Object(l.jsx)("button",{"aria-describedby":"current-page-index hint-next",ref:O?null:f,disabled:!g,id:"page-next",onClick:I,children:"Next"}),Object(l.jsxs)("div",{className:"current-page view-".concat(s),"aria-live":"polite",children:[Object(l.jsx)("span",{"aria-hidden":"true",children:"Page: ".concat(h+1,"/").concat(p.length)}),Object(l.jsx)(d,{children:Object(l.jsx)("span",{id:"current-page-index",role:"text",children:"Current Page: ".concat(h+1," of ").concat(p.length)})}),Object(l.jsx)("span",{className:"sr-hint",id:"hint-prev",children:", double-tap to flip to the previous page"}),Object(l.jsx)("span",{className:"sr-hint",id:"hint-next",children:", double-tap to flip to the next page"})]})]),t)),Object(l.jsx)("div",{className:"page-list",children:p.map((function(e,t){return Object(l.jsx)(u.a,{children:Object(l.jsx)("div",{className:"page-items"+(t===h?" active":""),ref:h===t?v:null,children:e()},t)})}))})]})})]})},x=function(e){var t=e.List,c=e.stickyFocus;return Object(l.jsx)(l.Fragment,{children:t.map((function(e,t){var i;return Object(l.jsx)("li",{children:Object(l.jsx)("a",{href:"#",className:"as-normal block-link",children:Object(l.jsxs)("div",{className:"container product-card",role:c?"text":void 0,children:[Object(l.jsx)("div",(i={role:c?"text":void 0,className:"socket product_thumb"},Object(a.a)(i,"role",c?"text":void 0),Object(a.a)(i,"children",e.thumb?e.thumb:Object(l.jsx)(j,{})),i)),Object(l.jsx)("div",{className:"socket product_info",role:c?"text":void 0,children:Object(l.jsx)("strong",{role:c?"text":void 0,className:"product_name",children:e.productName})}),Object(l.jsx)("div",{className:"socket seller_info",role:c?"text":void 0,children:Object(l.jsxs)("strong",{className:"seller_title",children:[Object(l.jsx)("div",{className:"seller_logo",children:Object(l.jsx)(d,{children:"Logo"})}),Object(l.jsx)(d,{children:"Seller:"}),h]})}),Object(l.jsxs)("div",{className:"socket price_info",role:c?"text":void 0,children:[!!e.price_discounted&&Object(l.jsxs)(l.Fragment,{children:[Object(l.jsxs)("big",{role:c?"text":void 0,className:"discounted_percent",children:[Object(l.jsx)(d,{children:"Discount"}),((e.price-e.price_discounted)/e.price*100).toFixed(1)+"%"]}),"\xa0",Object(l.jsxs)("big",{role:c?"text":void 0,className:"price_discounted",children:[Object(l.jsx)(d,{children:"Current:"}),e.price_discounted+"$"]}),"\xa0"]}),Object(l.jsxs)("del",{role:c?"text":void 0,className:"price_regular",children:[Object(l.jsx)(d,{children:"Regular:"}),e.price+"$"]})]}),Object(l.jsxs)("div",{className:"socket delivery_info",role:c?"text":void 0,children:[Object(l.jsxs)("p",{role:c?"text":void 0,children:[Object(l.jsx)(j,{IconClassName:"icon-flight_takeoff",IconAltText:"Shipping Start"})," April. 21. 2021 ",Object(l.jsxs)("span",{style:{fontSize:"0.8em"},children:[Object(l.jsx)(d,{children:"Delivery From"}),"Seoul, South Korea"]})]}),Object(l.jsxs)("p",{role:c?"text":void 0,children:[Object(l.jsx)(j,{IconClassName:"icon-gift",IconAltText:"Arriving at"})," 7:00PM. April. 29. 2021"]})]})]})})},"prNum_"+t)}))})};x.defaultProps={stickyFocus:!1},m.defaultProps={defaultPageIndex:0,showIndex:!0};var p=m;c(132);var O=function(){return Object(l.jsx)("div",{className:"global-wrapper",children:Object(l.jsx)(p,{})})},g=function(e){e&&e instanceof Function&&c.e(3).then(c.bind(null,134)).then((function(t){var c=t.getCLS,i=t.getFID,s=t.getFCP,r=t.getLCP,n=t.getTTFB;c(e),i(e),s(e),r(e),n(e)}))};n.a.render(Object(l.jsx)(s.a.StrictMode,{children:Object(l.jsx)(O,{})}),document.getElementById("root")),g()},85:function(e,t,c){},86:function(e,t,c){}},[[133,1,2]]]);
//# sourceMappingURL=main.7fbbddb9.chunk.js.map