var target = document.querySelector('#lib_ref_ReferringProps');
var tree = document.createElement('ul');
var panel = document.createElement('div');
var lang = document.documentElement.lang;

tree.innerHTML='\
<li><button role="treeitem" aria-controls="GetCustomClassPage">getCustomClass</button></li>\
<li><button role="treeitem" aria-controls="CollectionPage">Tree.collection</button></li>\
<li><button role="treeitem" aria-controls="GetAllTreeItemsPage">TreeInstance.getAllTreeItems</button></li>\
<li><button role="treeitem" aria-controls="TreeContextPage">treeItem.TreeContext</button></li>\
';
if(lang === 'ko'){
    panel.innerHTML='\
    <section id="GetCustomClassPage">\
    <p>트리 항목이나 트리뷰의 커스텀 객체를 element로부터 가져옵니다.</p>\
    <pre class="language-ts">document.querySelector(\'ul[role="tree"]\').getCustomClass  // return Tree instance\</code></pre>\
    <pre class="language-ts">document.querySelector(\'ul[role="tree"] li[role="none"]>[role="treeitem"]\').getCustomClass // return TreeItemElement instance\</code></pre>\
    </section>\
    \
    <section id="CollectionPage">\
    <p>트리뷰 요소를 모아둔 배열을 가져옵니다.</p>\
    <pre class="language-ts"> Tree.collection // return [Tree{...},Tree{...}]\</code></pre>\
    </section>\
    \
    <section id="GetAllTreeItemsPage">\
    <p>특정 트리뷰의 모든 트리 항목을 가저옵니다.</p>\
    <pre class="language-ts"> Tree.collection[0].getAllTreeItems // return [button[role="treeitem"],button[role="treeitem"],button[role="treeitem"]...]\</code></pre>\
    </section>\
    \
    <section id="TreeContextPage">\
    <p>트리 항목이 속한 트리 객체를 가져옵니다.</p>\
    <pre class="language-ts"> document.querySelector(\'[role="treeitem"]\').getCustomClass.TreeContext // return Tree{element:button.browsed-pointer,...}</code></pre>\
    </section>\
    ';
}
if(lang === 'en'){
    panel.innerHTML='\
    <section id="GetCustomClassPage">\
    <p>get the object related to the Treeitem or Treeview element like the below line.</p>\
    <pre class="language-ts">document.querySelector(\'ul[role="tree"]\').getCustomClass  // return Tree instance\</code></pre>\
    <pre class="language-ts">document.querySelector(\'ul[role="tree"] li[role="none"]>[role="treeitem"]\').getCustomClass // return TreeItemElement instance\</code></pre>\
    </section>\
    \
    <section id="CollectionPage">\
    <p>Get Treeview element Collection.</p>\
    <pre class="language-ts"> Tree.collection // return [Tree{...},Tree{...}]\</code></pre>\
    </section>\
    \
    <section id="GetAllTreeItemsPage">\
    <p>Get all tree-item elements of this Tree Object.</p>\
    <pre class="language-ts"> Tree.collection[0].getAllTreeItems // return [button[role="treeitem"],button[role="treeitem"],button[role="treeitem"]...]\</code></pre>\
    </section>\
    \
    <section id="TreeContextPage">\
    <p>Get the Object of Treeview this tree item belongs.</p>\
    <pre class="language-ts"> document.querySelector(\'[role="treeitem"]\').getCustomClass.TreeContext // return Tree{element:button.browsed-pointer,...}</code></pre>\
    </section>\
    ';
}

tree.setAttribute('role','tree');
target.appendChild(tree);
target.appendChild(panel);

Tree.collection[0].addTreeview(tree);