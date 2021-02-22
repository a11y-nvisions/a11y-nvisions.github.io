if(document.documentElement.lang === 'en'){
    Tree.setTipText = "You're in the Treeview, navigate with the Arrow keys.";
    Tree.ContentAvailableText = "Content's Available. Press Enter key to display at the panel area and then press the arrow down to leave the tree-view area and try to read the panel";
    Tree.setContentLoadedMessage = "Content loaded";
}
if(document.documentElement.lang === 'ko'){
    Tree.setInteractionTipMessage = "현재 트리뷰 항목에 있습니다. 방향키로 탐색하세요";
    Tree.setContentAvailableMessage = "읽을 수 있는 컨텐츠가 있습니다. 엔터 키를 눌러 패널에 내용을 표시하고, 탭 키로 트리뷰에서 벗어나 내용을 읽을 수 있습니다.";
    Tree.setContentLoadedMessage = "콘텐츠 로드됨";
}

Tree.startReconfiguration();