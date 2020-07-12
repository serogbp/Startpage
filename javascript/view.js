/**
 * @class View
 *
 * Visual representation of the model.
 */
class View {
	constructor() {
		this.currentElementBeingDragged;

		// Root element
		this.app = this.getElement('#root');

		this.header = this.createElement('header');

		// Title
		this.title = this.createElement('h1');
		this.title.textContent = 'StartPage '+ this._getEmoji();

		// Form for adding webs
		this.formAddWeb = this.createElement('form');

		this.inputUrl = this.createElement('input');
		this.inputUrl.type = 'text';
		this.inputUrl.placeholder = 'Url';
		this.inputUrl.name = 'url';
		this.inputUrl.required = true;


		this.inputName = this.createElement('input');
		this.inputName.type = 'text';
		this.inputName.placeholder = 'Name';
		this.inputName.name = 'name';
		this.inputName.required = true;

		// Suggest web name with url domain e.g.: https://www.github.com -> Github
		this.inputName.addEventListener('focus', event => {
			let url = this.inputUrl.value;
			let name = this.inputName.value;
			if (url != "" && name == "") {
				let n = url.match(/^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^.:\/?\n]+)?/)[1];
				this.inputName.value = n.charAt(0).toUpperCase() + n.slice(1);
			}
		});

		this.inputCategory = this.createElement('input');
		this.inputCategory.type = 'text';
		this.inputCategory.placeholder = 'Category';
		this.inputCategory.name = 'category';
		this.inputCategory.required = true;

		this.buttonAddWeb = this.createElement('button');
		this.buttonAddWeb.textContent = 'Add';

		this.formAddWeb.append (
			this.inputUrl,
			this.inputName,
			this.inputCategory,
			this.buttonAddWeb
		)
		
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
			this.formAddWeb,
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
		// Title
		const title = this.createElement('h4');
		title.textContent = category.id;
		title.draggable = true;

		// Allow change positions of categories by dragging by their title
		title.addEventListener("dragstart", event => {
			this.currentElementBeingDragged = c;
		});

		// Web list
		const list = this.createElement('ul');
		const c = this.createElement('category', 'category', category.id);
		c.id = category.id;

		// Allow drag elements over categories
		c.addEventListener('dragover', this.dragOver);
		// Allow elements being dragged enter into categories nodes
		c.addEventListener('dragenter', this.dragEnter);

		// Drop event
		c.addEventListener("drop", (event) =>{
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

		c.append(title, list);

		return c;
	}

	createLink(web) {
		const link = this.createElement('a');
		link.id = web.url;
		link.classList.add('link');
		link.target = '_blank';
		link.href = web.url;
		link.innerText = web.name;

		const row = this.createElement('li');
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

			// Append categories
			this.webContainer.append(...categories);
		}
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
		}
	}
 	
 	appendAfter(draggedNode, referenceNode) {
 		if (draggedNode != referenceNode) {
			referenceNode.parentNode.insertBefore(draggedNode, referenceNode.nextSibling);
		}
	}

	/*
		Bind functions
	*/
	bindAddWeb(commit, findDuplicate) {
		this.formAddWeb.addEventListener('submit', event => {
			event.preventDefault();

			let web = this._getInputWeb();
			let duplicate = findDuplicate(web);

			if (!duplicate) {
				commit(this._getInputWeb())
				this._resetForm(this.formAddWeb);
			} else {
				alert('This website is already added on the ' + duplicate.category + ' category with this name: ' + duplicate.name);
			}
		});
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
