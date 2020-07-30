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
		this.title.textContent = this._getEmoji() + ' StartPage '+ this._getEmoji();

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
			this.formImportExport,
			this.title,
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
		const categoryTitle = document.createElement('category-title');
		categoryTitle.handlerCommit = () => this._commitWebs(this.handlerReplace);

		categoryElement.id = category.id;

		// Allow drag elements over categories
		categoryElement.addEventListener('dragover', this.dragOver);
		// Allow elements being dragged enter into categories nodes
		categoryElement.addEventListener('dragenter', this.dragEnter);
		
		categoryElement.addEventListener('dragstart', (event) => {
			event.dataTransfer.setData('dragElementId', event.target.parentElement.id);
		});

		categoryElement.addEventListener('drop', (event) =>{
			event.preventDefault();
			
			let dragElementId = event.dataTransfer.getData('dragElementId');

			let draggedElement = document.querySelector(`#${dragElementId}`);

			switch (draggedElement.tagName) {
				case 'CATEGORY':
					// Append category before/after currentTarget
					this.appendNode(draggedElement, event.currentTarget);
					break;
					case 'LI':
						// Append li element to the category's ul (currentTarget)
						event.currentTarget.querySelector('ul').appendChild(draggedElement);
						default:
							break;
			}
		});
		
		categoryElement.append(categoryTitle, webList);
		
		return categoryElement;
	}

	// Returns a Category with a AddWebElement
	createEmptyCategory() {
		let emptyCategory = this.createCategory({id: 'New category'});
		let newWebButton = emptyCategory.appendChild(document.createElement('category-new-web-button'));
		newWebButton.handler = this.handlerCommit;
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

	setCurrentElementBeingDragged(element) {
		this.currentElementBeingDragged = element;
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
			// Empty category
			this.webContainer.append(this.createEmptyCategory());

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

			// Add button por adding new webs
			categories.forEach( category => {
				let newWebButton = category.appendChild(document.createElement('category-new-web-button'));
				newWebButton.handler = this.handlerCommit;
			});

			// Empty category
			this.webContainer.append(this.createEmptyCategory());
		}
	}

	// Get all webs from html and commits them to localStorage
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

	// Export the webs to json file
	bindExportJson(handler) {
		this.buttonExport.addEventListener('click', event => {
			try {
				// Get webs from the model
				let webs = handler();

				if (webs && webs.length == 0) {
					alert('Add some websites first!');
					return;
				}

				let date = new Date();
				// File name format yyyy-mm-dd_startPage.json
				let fileName = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "_startPage.json";
				let data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(webs));
				
				// Create <a> tag for downloading the json
				let link = this.createElement('a');
				link.setAttribute("href", data);
				link.setAttribute("download", fileName);
				link.click();
			} catch(e) {
				alert('Error exporting webs');
				console.log(e.message);
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

/* 
* Custom element title for the category element.
* On click it transforms into an input allowing editing the category name.
* On blur or keypress == Enter transforms back to title.
*
* After instantiation with document.createElement(...), 
* it needs to set the handlerCommit with the setter.
* e.g: 
* 		const title = document.createElement('category-title');
*		title.handlerCommit = () => this._commitWebs(this.handlerReplace);
*/
customElements.define('category-title',
	class extends HTMLElement {
		constructor() {
			super();

			// Received with setter after instantiation
			this.handlerCommit = null;
		}

		connectedCallback() {
			this.parent = this.parentElement;
			
			this.categoryTitle = this.appendChild(this.createTitle());
			this.categoryInput = this.appendChild(this.createInput());
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

/* 
* Custom element for adding new webs.
* Placed at the bottom of each category with the '+' symbol. 
* 
* On click transforms into an form to type url and name of the new website.
* Has an Add button that saves the new website and a Cancel button that
* reverts the element to the original state.
* 
* After instantiation with document.createElement(...), 
* it needs to set the handlerCommit with the setter.
* e.g: 
*		let newWeb = category.appendChild(document.createElement('category-new-web-button'));
*		newWeb.handler = this.handlerCommit;
* */
customElements.define('category-new-web-button',
	class extends HTMLElement {
		constructor() {
			super();

			// Received with setter after instantiation
			this.handlerCommit = null;			
		}

		connectedCallback() {
			this._button = this.appendChild(this.createButton());
			this._form = this.appendChild(this.createForm());
		}

		createBase() {
			const row = document.createElement('li');
			row.draggable = false;
			row.style.flexDirection = 'column';
			row.style.userSelect = 'none';
			return row;
		}

		createButton() {
			const row = this.createBase();
			row.addEventListener('click', () => {
				this.showForm();
			});

			const text = document.createElement('p');
			text.textContent = '+';
			text.style.textAlign = 'center';
			text.style.fontSize = 'x-large';
			text.style.margin = 0;

			row.append(text);
			return row;
		}

		createForm() {
			// Base
			const row = this.createBase();

			// Form
			const _form = document.createElement('form');
			_form.style.display = 'flex';
			_form.style.flexDirection = 'column';
			_form.addEventListener('submit', event => {
				event.preventDefault();
			});

			// Inputs
			const inputUrl = document.createElement('input');
			inputUrl.type = 'text';
			inputUrl.placeholder = 'Url';
			inputUrl.name = 'url';
			inputUrl.required = true;
			_form.inputUrl = inputUrl;

			const inputName = document.createElement('input');
			inputName.type = 'text';
			inputName.placeholder = 'Name';
			inputName.name = 'name';
			inputName.required = true;
			inputName.addEventListener('focus', () => {
				this._inputAutoCompleteName(inputUrl, inputName)
			});
			_form.inputName = inputName;

			// Button Add
			const buttonAdd = document.createElement('button');
			buttonAdd.textContent = 'ADD';

			buttonAdd.addEventListener('click', () => {
				if(_form.checkValidity()){
					this.handler({
						url: inputUrl.value,
						name: inputName.value,
						category: this.parentElement.id
					});
				}
			});

			// Button Cancel
			const buttonCancel = document.createElement('button');
			buttonCancel.textContent = 'CANCEL';
			buttonCancel.classList.add('red');

			// Listener click
			buttonCancel.addEventListener('click', event => {
				this.showButton();
			});

			_form.addEventListener('submit', event => {
				event.preventDefault();
			});

			// Append
			_form.append(inputUrl, inputName, buttonAdd, buttonCancel);
			row.append(_form);
			row.style.display = 'none';

			return row;
		}
		
		showButton() {
			this.querySelectorAll('input').forEach(input => {
				input.disabled = true;
			});

			this._form.style.display = 'none';
			this._button.style.display = 'flex';
		}

		showForm(){
			this._button.style.display = 'none';
			this.resetForm(this._form);
			this._form.style.display = 'flex';
		}

		resetForm() {
			this.querySelectorAll('input').forEach(input => {
				input.disabled = false;
				input.value = '';
				input.focus();
			});
		}

		// Suggest web name with url domain e.g.: https://www.github.com -> Github
		_inputAutoCompleteName(inputUrl, inputName) {
			let url = inputUrl.value;
			let name = inputName.value;
			if (url != "" && name == "") {
				// Get domain name without .com.../.net.../etc
				let n = url.match(/^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^.:\/?\n]+)?/)[1];
				// First char to upper
				inputName.value = n.charAt(0).toUpperCase() + n.slice(1);
			}
		}

		// Setter. Gets function for saving webs
		handlerCommit(handler) {
			this.handlerCommit = handler;
		}
	}
);