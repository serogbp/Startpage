/**
 * @class View
 *
 * Visual representation of the model.
 */
class View {
	constructor() {
		this.currentElementBeingDragged = null;
		this.handlerCommit = null;
		this.handlerReplace = null;

		// Root element
		this.app = this.getElement('#root');

		this.header = this.createElement('header');

		// Title
		this.title = this.createElement('h1');
		this.title.textContent = 'StartPage '+ this._getEmoji();

		// Form for import/export
		this.formImportExport = this.createElement('form');
		this.formImportExport.addEventListener('submit', event =>{
			event.preventDefault();
		});

		this.buttonImport = this.createElement('button');
		this.buttonImport.textContent = 'Import';

		this.buttonExport = this.createElement('button');
		this.buttonExport.textContent = 'Export';

		this.formImportExport.append (
			this.buttonImport,
			this.buttonExport
		)

		// Search box
		this.searchText = this.createElement('input');
		this.searchText.type = 'text';
		this.searchText.placeholder = 'Filter...';

		// Web container
		this.webContainer = this.createElement('div', 'webContainer');

		this.header.append (
			this.title,
			this.formImportExport,
			this.searchText
		)

		this.app.append (
			this.header,
			this.webContainer
		)
	}


	// Create an element with an optional class and id
	createElement(tag, className, idName) {
		const element = document.createElement(tag);
		if(className) element.classList.add(className);
		if(idName) element.idName = 'id';

		return element;
	}

	createCategory(category) {

		const categoryElement = this.createElement('category', 'category', category.id);
		const webList = this.createElement('ul');
		const title = document.createElement('category-title');
		title.handlerCommit = () => this._commitWebs(this.handlerReplace);
		
		categoryElement.id = category.id;

		// Allow drag elements over categories
		categoryElement.addEventListener('dragover', this.dragOver);
		// Allow elements being dragged enter into categories nodes
		categoryElement.addEventListener('dragenter', this.dragEnter);
		// Drop event
		categoryElement.addEventListener("drop", (event) =>{
			event.preventDefault();

			switch (this.currentElementBeingDragged.tagName) {
				case 'CATEGORY':
					// Append category before/after currentTarget
					this.appendNode(this.currentElementBeingDragged, event.currentTarget);
					break;
				case 'LI':
					// Append li element to the cagetory's ul (currentTarget)
					event.currentTarget.querySelector('ul').appendChild(this.currentElementBeingDragged);
				default:
					break;
			}
		});
		categoryElement.append(title, webList);
		return categoryElement;
	}

	// Returns a Category with a AddWebElement
	createEmptyCategory() {
		let emptyCategory = this.createCategory({id: 'New category'});
		new AddWebElement(emptyCategory, this.handlerCommit);
		return emptyCategory;
	}

	createLink(web) {
		const link = this.createElement('a');
		link.id = web.url;
		link.classList.add('link');
		link.target = '_blank';
		link.href = web.url;
		link.innerText = web.name;

		const row = this.createElement('li');
		row.classList.add('web');
		row.draggable = true;
		row.append(link);
		
		row.addEventListener("dragstart", event => {
			this.currentElementBeingDragged = row;
		});
		row.addEventListener("drop", (event) =>{
			event.preventDefault();
			if(this.currentElementBeingDragged.tagName === 'LI'){
				this.appendNode(this.currentElementBeingDragged, event.currentTarget);
			}
		});

		return row;
	}

	_getEmoji() {
		let emojis = ["🤡", "💩", "👻", "💀", "☠️", "👽", "👾", "🤖", "🎃", "🧠", "👀", "👁", "👨‍💻", "👩‍💻", "🧟‍♂️", "🧟‍♀️", "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🙈", "🙉", "🙊", "🐒", "🐔", "🐧", "🐦", "🐤", "🐣", "🐥", "🦆", "🦅", "🦉", "🦇", "🐺", "🐗", "🐴", "🦄", "🐌", "🐢", "🐍", "🦎", "🦖", "🦕", "🐡", "🐠", "🐟", "🐬", "🐳", "🐋", "🦈", "🐊", "🐅", "🐆", "🦓", "🦍", "🐘", "🦛", "🦏", "🐪", "🐫", "🦒", "🦘", "🐃", "🐂", "🐄", "🐎", "🐖", "🐏", "🐑", "🦙", "🐐", "🦌", "🐕", "🐩", "🐈", "🐓", "🦃", "🦚", "🦜", "🦢", "🕊", "🐇", "🦝", "🦡", "🐁", "🐀", "🐿", "🦔", "🐉", "🐲", "🌵", "🎄", "🌲", "🌳", "🌴", "🌱", "🌿", "☘️", "🍀", "🎍", "🎋", "🍃", "🍂", "🍁", "🍄", "🐚", "🌾", "💐", "🌷", "🌹", "🥀", "🌺", "🌸", "🌼", "🌻", "🌞", "🌝", "🌛", "🌜", "🌚", "🌕", "🌖", "🌗", "🌘", "🌑", "🌒", "🌓", "🌔", "🌙", "🌎", "🌍", "🌏", "🪐", "💫", "⭐️", "🌟", "✨", "⚡️", "☄️", "💥", "🔥", "🌪", "🌈", ];
		return emojis[Math.floor(Math.random() * emojis.length)];
	}

	getElement(selector) {
		return document.querySelector(selector);
	}

	// Add web input getter
	_getInputWeb() {
		return {url: this.inputUrl.value, name: this.inputName.value, category: this.inputCategory.value};
	}

	_inputAutoCompleteName(inputUrl, inputName) {
		let url = inputUrl.value;
		let name = inputName.value;
		if (url != "" && name == "") {
			let n = url.match(/^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^.:\/?\n]+)?/)[1];
			inputName.value = n.charAt(0).toUpperCase() + n.slice(1);
		}
	}

	// Reset all inputs
	_resetInput() {
		this.inputUrl.value = '';
		this.inputName.value = '';
		this.inputCategory.value = '';
		this.fileExplorer.value = '';
		this.jsonTextbox.value = '';
	}

	// Reset a form inputs
	_resetForm(form) {

		let inputs = form.elements;

		for (var i = 0; i <= inputs.length - 1; i++) {
			if(inputs[i].tagName === 'INPUT' && inputs[i].type === 'text'){
				inputs[i].value = '';
			}
		}
	}

	displayWebs(webs) {
		// Delete all nodes
		while(this.webContainer.firstChild) {
			this.webContainer.removeChild(this.webContainer.firstChild);
		}

		// Show default message if there are 0 webs
		if(webs.length === 0) {
			const p = this.createElement('p');
			p.textContent = 'Empty! Add a website?';
			this.webContainer.append(p);
		} else {
			let categories = [];

			// Create web nodes
			webs.forEach( web => {
				let category = categories.find(c => c.id === web.category);

				// If the category doesn't exists, create it
				if(!category){
					category = this.createCategory({id: web.category});
					categories.push(category);
					this.webContainer.append(category);
				}

				// Append web to category
				category.querySelector('ul').append(this.createLink(web));
			});

			//Append AddWebElement to each category
			categories.forEach( category => {
				new AddWebElement(category, this.handlerCommit);
			});

			// Append categories
			this.webContainer.append(...categories);

			// Empty category
			this.webContainer.append(this.createEmptyCategory());
		}
	}

	// Get all webs from html and commits it to localStorage
	_commitWebs(handlerReplace) {
		let webs = [];

		// Iterate each category
		this.app.querySelectorAll('category').forEach( category => {
			// Iterate each web
			category.querySelectorAll('.link').forEach( web => {
				webs.push({
					url: web.id,
					name: web.innerText,
					category: category.id
				});
			});
		});

		handlerReplace(webs);
	}

	/*
		Drag functions
	*/

	// Gets current element dragged
	dragStart() {
		this.currentElementBeingDragged = this;
	}

	// Allow drag elements over nodes
	dragOver(e) {
		e.preventDefault();
	}

	// Allow elements being dragged enter into nodes
	dragEnter(e) {
		e.preventDefault();
	}
	
	// Append node after/before another
	appendNode(draggedNode, referenceNode) {
		if (draggedNode != referenceNode) {
			
			let position = draggedNode.compareDocumentPosition(referenceNode);

			if (position == Node.DOCUMENT_POSITION_FOLLOWING) {
				// Append After
				referenceNode.parentNode.insertBefore(draggedNode, referenceNode.nextSibling);		
			} else {
				// Append Before
				referenceNode.parentNode.insertBefore(draggedNode, referenceNode);
			}

			this._commitWebs(this.handlerReplace);
		}
	}
 	
 	appendAfter(draggedNode, referenceNode) {
 		if (draggedNode != referenceNode) {
			referenceNode.parentNode.insertBefore(draggedNode, referenceNode.nextSibling);
		}

		this._commitWebs(this.handlerReplace);
	}

	/*
		Bind functions
	*/
	bindAddWeb(handlerCommit) {

		this.handlerCommit = handlerCommit;
	}

	bindReplaceWebs(handlerReplace) {
		this.handlerReplace = handlerReplace;
	}

	bindDeleteWeb(handler) {
		this.webContainer.addEventListener('click', event => {
			if (event.target.className === 'delete') {
				// TODO get URL
				const url = '';
				handler(url);
			}
		});
	}

	bindExportJson(handler) {
		this.buttonExport.addEventListener('click', event => {
			try {
				let webs = handler();

				if (webs.length == 0) {
					alert('Add some websites first!');
					return;
				}

				webs = JSON.stringify(webs);

				let date = new Date();
				date = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

				let data = "data:text/json;charset=utf-8," + encodeURIComponent(handler());
				let fileName = date + "_startPage.json";
				
				let link = this.createElement('a');
				link.setAttribute("href", data);
				link.setAttribute("download", fileName);
				link.click();
			} catch(e) {
				alert(e.message);
			}
		});
	}

	bindImportJson(handler) {
		this.buttonImport.addEventListener('click', event => {
			try {
				let fileExplorer = this.createElement('input');
				fileExplorer.type = 'file';
				fileExplorer.name = 'file_explorer';
				fileExplorer.accept = '.json';
				
				fileExplorer.addEventListener('change', event => {
					let reader = new FileReader();
					reader.onload = event => {
						handler(JSON.parse(event.target.result));
						fileExplorer.value = '';
					}
					reader.readAsText(event.target.files[0]);
				});
				
				fileExplorer.click();

			} catch(e) {
				alert(e.message);
			}
		});
	}

	bindFilter(handler) {
		this.searchText.addEventListener('input', event => {
			handler(event.target.value);
		});
	}
}



// Create + element at the bottom of the category for adding new websites
class AddWebElement {
	constructor(category, handler) {
		this.handler = handler;
		this.category = category;
		this.row = this.createAddWeb()
	}

	createAddWeb() {
		var row = document.createElement('li');
		row.draggable = false;
		row.textContent = '+';
		row.style.flexDirection = 'column';
		row.style.textAlign = 'center';
		row.style.fontSize = 'x-large';
		row.style.userSelect = 'none';

		this.category.querySelector('ul').append(row);

		row.addEventListener('click', () => {
			row.remove();
			row = this.createAddWebInputs();
			this.category.querySelector('ul').append(row);
			row.querySelector('input').focus();
		});

		return row;
	}

	createAddWebInputs() {
		// Root element
		var row = document.createElement('li');
		row.style.flexDirection = 'column';
		
		// Form
		const formAddWeb = document.createElement('form');
		formAddWeb.style.display = 'flex';
		formAddWeb.style.flexDirection = 'column';
		formAddWeb.addEventListener('submit', event => {
			event.preventDefault();
		});

		// Inputs
		const inputUrl = document.createElement('input');
		inputUrl.type = 'text';
		inputUrl.placeholder = 'Url';
		inputUrl.name = 'url';
		inputUrl.required = true;

		const inputName = document.createElement('input');
		inputName.type = 'text';
		inputName.placeholder = 'Name';
		inputName.name = 'name';
		inputName.required = true;
		inputName.addEventListener('focus', () => {
			this._inputAutoCompleteName(inputUrl, inputName)
		});

		// Buttons
		const buttonAdd = document.createElement('button');
		buttonAdd.textContent = 'ADD';

		const buttonCancel = document.createElement('button');
		buttonCancel.textContent = 'CANCEL';

		// Listeners
		buttonCancel.addEventListener('click', () => {
			row.remove();
			row = this.createAddWeb();
			this.category.querySelector('ul').append(row);
		});

		formAddWeb.addEventListener('submit', event => {
			event.preventDefault();

			this.handler({
				url: inputUrl.value,
				name: inputName.value,
				category: this.category.id
			});
		});

		// Append
		formAddWeb.append(inputUrl, inputName, buttonAdd, buttonCancel);
		row.append(formAddWeb);
		return row;
	}

	// Suggest web name with url domain e.g.: https://www.github.com -> Github
	_inputAutoCompleteName(inputUrl, inputName) {
		let url = inputUrl.value;
		let name = inputName.value;
		if (url != "" && name == "") {
			// Get domain
			let n = url.match(/^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^.:\/?\n]+)?/)[1];
			// First char to upper
			inputName.value = n.charAt(0).toUpperCase() + n.slice(1);
		}
	}
}

/* 
* Custom element title for the category element.
* On click it transforms into an input allowing editing the category name.
* On blur or keypress == Enter transforms back to title.
*
* After instantiation with document.createElement(...), 
* it needs to set the handlerCommit with the setter.
* e.g: 
* 		const title = document.createElement('category-title');
		title.handlerCommit = () => this._commitWebs(this.handlerReplace);
*/
customElements.define('category-title',
	class extends HTMLElement {
		constructor() {
			super();
			this.attachShadow({mode: 'open'});

			// Received with setter after instantiation
			this.handlerCommit = null;
		}

		connectedCallback() {
			this.parent = this.parentElement;
			
			this.categoryTitle = this.shadowRoot.appendChild(this.createTitle());
			this.categoryInput = this.shadowRoot.appendChild(this.createInput());
		}
		
		createTitle() {	
			const title = document.createElement('h4');
			title.textContent = this.parent.id;
			title.draggable = true;
		
			title.addEventListener('click', () => {
				this.showInput();
			});

			return title;
		}

		createInput(){
			const input = document.createElement('input');
			input.type = 'text';
			input.value = this.parent.id;
			input.style.display = 'none';

			input.addEventListener('keydown', event => {
				if (event.key === 'Enter') {
					this.showTitle();
					this.saveTitle(input.value);
				}
			});
			input.addEventListener('blur', () => {
				this.showTitle();
				this.saveTitle(input.value);
			});	
			return input;
		}

		showTitle() {
			this.categoryTitle.style.display = 'block';
			this.categoryInput.style.display = 'none';
		}

		showInput() {
			this.categoryTitle.style.display = 'none';
			this.categoryInput.style.display = 'block';
			this.categoryInput.focus();
		}

		// Save category name changes from the input
		saveTitle(newTitle) {
			try {
				if (this.parent.id != newTitle) {
					this.parent.id = newTitle;
					this.handlerCommit();
				}
			} catch (error) {
				alert('Error saving title changes');
				console.log(`Error saving title changes: ${error.message}`);
			}
		}

		// Setter. Gets function for saving webs
		handlerCommit(handler) {
			this.handlerCommit = handler;
		}
	}
 );