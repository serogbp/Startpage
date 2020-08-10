/* Constants */
var ID_ROOT = '#root';
var CLASS_WEB = '.web';

var CLASS_NAME_WEB_CONTAINER = 'webContainer';
var CLASS_NAME_CATEGORY = 'category';
var CLASS_NAME_WEB = 'web';

var ELEMENT_CATEGORY_CONTROLLER = 'category-controller';
var ELEMENT_CATEGORY_TITLE = 'category-title';
var ELEMENT_CATEGORY_LIST = 'category-list';
var ELEMENT_CATEGORY_WEB = 'category-web';
var ELEMENT_CATEGORY_NEW_WEB = 'category-new-web-button';

var DATA_TRANSFER_DRAG_ID = 'dragId';

var IMPORT = 'Import';
var EXPORT = 'Export';
var ADD = 'ADD';
var CANCEL = 'CANCEL';
var SEARCH_BOX_PLACEHOLDER = 'Filter ...';
var EMPTY_STATE = 'Empty! Add a website?'
var ADD_WEBS = 'Add some websites first!';
var NEW_CATEGORY = 'New category';

var ERROR_EXPORT = 'Error exporting webs';
var ERROR_SAVE = 'Error saving title changes'

/**
 * @class View
 *
 * Visual representation of the model.
 */
class View {
	constructor() {
		this.currentElementBeingDragged = null;
		this.handlerAddWeb = null;
		this.handlerReplace = null;

		// Root element
		this.app = this.getElement(ID_ROOT);

		this.header = this.createElement('header');

		// Title
		this.title = this.createElement('h1');
		this.title.textContent = `${this._getEmoji()} StartPage ${this._getEmoji()}`;

		// Form for import/export
		this.formButtons = this.createElement('form');
		this.formButtons.addEventListener('submit', event => {
			event.preventDefault();
		});

		this.buttonImport = this.createElement('button');
		this.buttonImport.textContent = IMPORT;

		this.buttonExport = this.createElement('button');
		this.buttonExport.textContent = EXPORT;

		this.formButtons.append(
			this.buttonImport,
			this.buttonExport
		)

		// Search box
		this.searchText = this.createElement('input');
		this.searchText.type = 'text';
		this.searchText.placeholder = SEARCH_BOX_PLACEHOLDER;

		// Web container
		this.webContainer = this.createElement('article', CLASS_NAME_WEB_CONTAINER);

		this.header.append(
			this.formButtons,
			this.title,
			this.searchText
		)

		this.app.append(
			this.header,
			this.webContainer
		)
	}


	// Create an element with an optional class and id
	createElement(tag, className, idName) {
		const element = document.createElement(tag);
		if (className) element.classList.add(className);
		if (idName) element.idName = 'id';

		return element;
	}

	// Returns a Category with a AddWebElement
	createEmptyCategory(id) {

		let wrapper = this.createElement('div');
		let title = this.createElement('h4');
		title.textContent = 'Add web for new category';

		let emptyCategory = this.createElement(ELEMENT_CATEGORY_NEW_WEB);
		emptyCategory.handlerAddWeb = (web) => this.handlerAddWeb(web);
		emptyCategory.build();

		wrapper.append(title, emptyCategory);

		return wrapper;
	}

	_getEmoji() {
		let emojis = ["🤡", "💩", "👻", "💀", "☠️", "👽", "👾", "🤖", "🎃", "🧠", "👀", "👁", "👨‍💻", "👩‍💻", "🧟‍♂️", "🧟‍♀️", "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🙈", "🙉", "🙊", "🐒", "🐔", "🐧", "🐦", "🐤", "🐣", "🐥", "🦆", "🦅", "🦉", "🦇", "🐺", "🐗", "🐴", "🦄", "🐌", "🐢", "🐍", "🦎", "🦖", "🦕", "🐡", "🐠", "🐟", "🐬", "🐳", "🐋", "🦈", "🐊", "🐅", "🐆", "🦓", "🦍", "🐘", "🦛", "🦏", "🐪", "🐫", "🦒", "🦘", "🐃", "🐂", "🐄", "🐎", "🐖", "🐏", "🐑", "🦙", "🐐", "🦌", "🐕", "🐩", "🐈", "🐓", "🦃", "🦚", "🦜", "🦢", "🕊", "🐇", "🦝", "🦡", "🐁", "🐀", "🐿", "🦔", "🐉", "🐲", "🌵", "🎄", "🌲", "🌳", "🌴", "🌱", "🌿", "☘️", "🍀", "🎍", "🎋", "🍃", "🍂", "🍁", "🍄", "🐚", "🌾", "💐", "🌷", "🌹", "🥀", "🌺", "🌸", "🌼", "🌻", "🌞", "🌝", "🌛", "🌜", "🌚", "🌕", "🌖", "🌗", "🌘", "🌑", "🌒", "🌓", "🌔", "🌙", "🌎", "🌍", "🌏", "🪐", "💫", "⭐️", "🌟", "✨", "⚡️", "☄️", "💥", "🔥", "🌪", "🌈",];
		return emojis[Math.floor(Math.random() * emojis.length)];
	}

	getElement(selector) {
		return document.querySelector(selector);
	}

	// Add web input getter
	_getInputWeb() {
		return { url: this.inputUrl.value, name: this.inputName.value, category: this.inputCategory.value };
	}

	_inputAutoCompleteName(inputUrl, inputName) {
		let url = inputUrl.value;
		let name = inputName.value;
		if (url != "" && name == "") {
			let n = url.match(/^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^.:\/?\n]+)?/)[1];
			inputName.value = n.charAt(0).toUpperCase() + n.slice(1);
		}
	}

	displayWebs(webs) {
		// Delete all nodes
		while (this.webContainer.firstChild) {
			this.webContainer.removeChild(this.webContainer.firstChild);
		}

		// Show default message if there are 0 webs
		if (webs.length === 0) {
			// Empty category
			this.webContainer.append(this.createEmptyCategory());

		} else {
			let categories = [];

			// Create web nodes
			webs.forEach(web => {
				let category = categories.find(c => c.getTitle() === web.category);

				// If the category doesn't exists, create it
				if (!category) {

					category = document.createElement('category-controller');
					category.title = web.category;
					category.handlerAddWeb = (web) => this.handlerAddWeb(web);
					category.handlerCommit = () => this.commitWebs();
					category.handlerDrop = (draggedElement, target) => this.appendNode(draggedElement, target);
					category.build();

					this.webContainer.append(category);
					categories.push(category);
				}

				// Append web to category
				category.addWeb(web);
			});

			// Empty category
			this.webContainer.append(this.createEmptyCategory());
		}
	}

	// Get all webs from html and commits them to localStorage in Json format
	commitWebs() {
		if (this.handlerReplace) {
			let webs = [];

			// Iterate each category
			this.app.querySelectorAll('category-controller').forEach(category => {
				// Iterate each web
				category.querySelectorAll('a').forEach(web => {
					webs.push({
						url: web.id,
						name: web.innerText,
						category: category.id
					});
				});
			});

			this.handlerReplace(webs);
		}
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
			this.commitWebs();
		}
	}

	/*
		Bind functions
	*/
	bindAddWeb(handler) {

		this.handlerAddWeb = handler;
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
					alert(ADD_WEBS);
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
			} catch (e) {
				alert(ERROR_EXPORT);
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

			} catch (e) {
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
* Custom element that wraps all Category custom elements
* 
* Example of instantiation:
*	const category = document.createElement('category-controller');
*	category.title = web.category;
*	category.handlerAddWeb = (web) => this.handlerAddWeb(web);
*	category.handlerCommit = () => this.commitWebs();
*	category.handlerDrop = (draggedElement, target) => this.appendNode(draggedElement, target);
*	category.build();
*/
class CategoryController extends HTMLElement {
	constructor() {
		super();

		this.title = null;
		this.header = null;
		this.content = null;
		this.footer = null;

		this.handlerAddWeb = null;
		this.handlerCommit = null;
		this.handlerDrop = null;
	}

	connectedCallback() {
	}

	build() {

		if (this.title == null) throw new Error('Title is missing');

		this.id = this.title;
		this.classList.add(CLASS_NAME_CATEGORY);

		this.header = document.createElement(ELEMENT_CATEGORY_TITLE);
		this.header.title = this.title;
		this.header.handlerDrop = this.handlerDrop;
		this.header.handlerCommit = this.handlerCommit;
		this.header.build();

		this.content = document.createElement('ul', {is: ELEMENT_CATEGORY_LIST});
		this.content.handlerDrop = this.handlerDrop;
		this.content.handlerCommit = this.handlerCommit;

		this.footer = document.createElement(ELEMENT_CATEGORY_NEW_WEB);
		this.footer.handlerAddWeb = this.handlerAddWeb;
		this.footer.build();


		this.append(this.header, this.content, this.footer);
	}

	title(title) {
		this.title = title;
	}

	getTitle() {
		return this.title;
	}

	addWeb(web) {
		this.content.addWeb(web);
	}

	// Save web
	handlerAddWeb(handler) {
		this.handlerAddWeb = handler;
	}

	// Save html to json
	handlerCommit(handler) {
		this.handlerCommit = handler;
	}

	// Function for dropping nodes
	handlerDrop(handler) {
		this.handlerDrop = handler;
	}
}

/* 
* Custom element title for the category element.
* On click it transforms into an input allowing editing the category name.
* On blur or keypress == Enter transforms back to title.
*
* Example of instantiation:
*	const categoryTitle = document.createElement('category-title');
*	categoryTitle.title = title;
*	categoryTitle.handlerDrop = handlerDrop;
*	categoryTitle.handlerCommit = handlerCommit;
*	categoryTitle.build();
*/
class CategoryTitle extends HTMLElement {
	constructor() {
		super();

		// Received with setter after instantiation
		this.handlerCommit = null;
	}

	connectedCallback() {
		this.parent = this.parentElement;
	}

	build() {
		this.categoryTitle = this.appendChild(this.createTitle());
		this.categoryInput = this.appendChild(this.createInput());

		this.draggable = true;

		this.setEvents();
	}

	setEvents() {
		// Allow drag elements over this node
		this.addEventListener('dragover', event => {
			event.preventDefault();
		});

		// Allow drag elements enter this node
		this.addEventListener('dragenter', event => {
			event.preventDefault();
		});

		// Set this category id in a property of the event data
		this.addEventListener('dragstart', (event) => {
			event.dataTransfer.setData(DATA_TRANSFER_DRAG_ID, this.parentElement.id);
		});

		this.addEventListener('drop', (event) => {
			let id = event.dataTransfer.getData(DATA_TRANSFER_DRAG_ID);
			let draggedElement = document.getElementById(id);

			if (draggedElement.tagName === ELEMENT_CATEGORY_CONTROLLER.toUpperCase()) 
					//Append category before/after current Target
					this.handlerDrop(draggedElement, event.currentTarget.parentElement)
			}
		);
	}

	createTitle() {
		const title = document.createElement('span');
		if (this.title) title.textContent = this.title;

		title.addEventListener('click', () => {
			this.showInput(title.textContent);
		});

		return title;
	}

	title(title) {
		this.title = title;
	}

	createInput() {
		const input = document.createElement('input');
		input.type = 'text';
		input.style.display = 'none';

		input.addEventListener('keydown', event => {
			if (event.key === 'Enter') {
				this.saveTitle(input.value);
			}
		});
		input.addEventListener('blur', () => {
			this.saveTitle(input.value);
		});
		return input;
	}

	showTitle() {
		this.categoryTitle.style.display = 'block';
		this.categoryInput.style.display = 'none';
		this.draggable = true;
	}

	showInput(text) {
		this.draggable = false;
		this.categoryTitle.style.display = 'none';
		this.categoryInput.value = text;
		this.categoryInput.style.display = 'block';
		this.categoryInput.focus();
	}

	// Save category name changes from the input
	saveTitle(newTitle) {
		// If is not empty and not equal to the old name, save
		if (newTitle != "" && this.parent.id != newTitle) {
			let oldTitle = this.parent.id;
			try {
				this.parent.id = newTitle;
				this.handlerCommit();
			} catch (error) {
				this.parent.id = oldTitle;
				alert(ERROR_SAVE);
				console.log(`Error saving title changes: ${error.message}`);
			} finally {
				this.categoryTitle.textContent = this.parent.id;
			}
		}

		this.showTitle();
	}

	// Setter. Gets function for saving webs
	handlerCommit(handler) {
		this.handlerCommit = handler;
	}

	handlerDrop(handler) {
		this.handlerDrop = handler;
	}
}

/*
* Custom element that contains a list of websites of the same category
* Can changes it's position with other CategoryList by drag and drop
*
* Example of instantiation:
*	const categoryList = document.createElement('category-list');
*	categoryList.handlerDrop = handlerDrop;
*	categoryList.handlerCommit = handlerCommit;
*/
class CategoryList extends HTMLUListElement {
	constructor() {
		super();
	}

	connectedCallback() {

	}

	addWeb(web) {
		var categoryWeb = document.createElement('a', { is: ELEMENT_CATEGORY_WEB });
		categoryWeb.handlerDrop = this.handlerDrop;
		categoryWeb.build(web);
		this.append(categoryWeb);
	}

	handlerDrop(handler) {
		this.handlerDrop = handler;
	}

	handlerCommit(handler) {
		this.handlerCommit = handler;
	}
}

/*
* Custom element that contains a website
* Can changes it's position with other CategoryWeb by drag and drop
* 
* Example of instantiation:
*	var categoryWeb = document.createElement('a', { is: 'category-web' });
*	categoryWeb.handlerDrop = handlerDrop;
*	categoryWeb.build(web);
*	categoryList.webList.append(categoryWeb);
*/
class CategoryWeb extends HTMLAnchorElement {
	constructor() {
		super();
	}

	connectedCallback() {

	}

	build(web) {
		this.classList.add(CLASS_NAME_WEB);
		this.createLink(web);

		// Allow drag elements over this node
		this.addEventListener('dragover', event => {
			event.preventDefault();
		});

		// Allow drag elements enter this node
		this.addEventListener('dragenter', event => {
			event.preventDefault();
		});

		// Set this category id in a property of the event data
		this.addEventListener('dragstart', (event) => {
			event.dataTransfer.setData(DATA_TRANSFER_DRAG_ID, this.id);
			event.stopPropagation();
		});

		this.addEventListener('drop', (event) => {
			// Prevent loading link	
			event.preventDefault();
			
			let id = event.dataTransfer.getData(DATA_TRANSFER_DRAG_ID);
			let draggedElement = document.getElementById(id);
			
			if (draggedElement.tagName === 'A') {
				this.handlerDrop(draggedElement, event.currentTarget);
			}
		});
	}

	createLink(web) {
		this.draggable = true;

		this.id = web.url;
		this.innerHTML = web.name;

		this.id = web.url;
		this.target = '_blank';
		this.href = web.url;
		this.innerText = web.name;
	}

	handlerDrop(handler) {
		this.handlerDrop = handler;
	}
}

/* 
* Custom element for adding new webs.
* Placed at the bottom of each category with the '+' symbol. 
* 
* On click transforms into an form to type url and name of the new website.
* Has an Add button that saves the new website and a Cancel button that
* reverts the element to the original state.
* 
* Example of instantiation:
*	categoryNewWeb = document.createElement('category-new-web-button');
*	categoryNewWeb.handlerAddWeb = handlerAddWeb;
*	categoryNewWeb.build();
* */
class CategoryNewWeb extends HTMLElement {
	constructor() {
		super();

		// Received with setter after instantiation
		this.handlerAddWeb = null;
	}

	connectedCallback() {
	}

	build() {
		this.createButton();
	}

	createButton() {

		const text = document.createElement('p');
		text.textContent = '+';
		
		text.addEventListener('click', () => {
			this.showForm();
		});

		this.append(text);
		this._button = text;
	}

	createForm() {

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

		const inputName = document.createElement('input');
		inputName.type = 'text';
		inputName.placeholder = 'Name';
		inputName.name = 'name';
		inputName.required = true;
		inputName.addEventListener('focus', () => {
			this._inputAutoCompleteName(inputUrl, inputName)
		});

		// Button Add
		const buttonAdd = document.createElement('button');
		buttonAdd.textContent = ADD;

		buttonAdd.addEventListener('click', () => {
			if (_form.checkValidity()) {
				this.handlerAddWeb({
					url: inputUrl.value,
					name: inputName.value,
					category: this.parentElement.id ? this.parentElement.id : 'New category'
				});
			}
		});

		// Button Cancel
		const buttonCancel = document.createElement('button');
		buttonCancel.textContent = CANCEL;
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
		this._form = _form;
		return _form;
	}

	showButton() {
		this._form.remove();
		this._button.style.display = 'block';
	}

	showForm() {
		this._button.style.display = 'none';

		this._form = this.appendChild(this.createForm());
		this._form.querySelector('input').focus();
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
	handlerAddWeb(handler) {
		this.handlerAddWeb = handler;
	}
}

customElements.define(ELEMENT_CATEGORY_CONTROLLER, CategoryController);
customElements.define(ELEMENT_CATEGORY_TITLE, CategoryTitle);
customElements.define(ELEMENT_CATEGORY_LIST, CategoryList, { extends: 'ul'});
customElements.define(ELEMENT_CATEGORY_WEB, CategoryWeb, { extends: 'a' });
customElements.define(ELEMENT_CATEGORY_NEW_WEB, CategoryNewWeb);