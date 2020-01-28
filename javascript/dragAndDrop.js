function dragStart(){
	draggable = this;
}

function dragEnd(){
}

function dragOver(e){
	e.preventDefault();
}

function dragEnter(e){
	e.preventDefault();
}

function dragLeave(){
}

function dragDrop(e){
	insertNodeAfter(draggable, this);
	e.preventDefault();
	exportHtmlToJson();
}

function dragDropOnCategory (e){
	this.append(draggable);
	e.preventDefault();
	exportHtmlToJson();
}

function insertNodeBefore(newNode, referenceNode){
	referenceNode.parentNode.insertBefore(newNode, referenceNode);
}

function insertNodeAfter(newNode, referenceNode){
	referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}