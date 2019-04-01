const ID_INPUT_CONTAINER = "inputContainer";
const CLASS_INPUT_CONTAINER_INVISIBLE = "invisible";
const CLASS_INPUT_CONTAINER_VISIBLE = "visible";
const ID_WEB_CONTAINER = "webContainer";
const CLASS_WEB = "web";
const CLASS_CATEGORY = "category";
const CLASS_CATEGORY_LIST = "categoryList";
const ID_INPUT_NAME = "inputName";
const ID_INPUT_URL = "inputUrl";
const ID_INPUT_CATEGORY = "inputCategory";
const ID_JSON_TEXTBOX = "jsonTextBox";

var draggable;

window.onload = function()
{
	init();
}

function init()
{
	update();
}

function update()
{
	paintWebs();
}

class Web
{
	constructor(name, url, category)
	{
		this.name = name;
		this.url = url;
		this.category = category;
	}
}

class WebLink
{
	constructor(name, url, category)
	{
		this.web = new Web(name, url, category)
		this.element = this.createElement()
	}
	
	createElement()
	{
		// List item
		//var li = document.createElement("li");
		//li.setAttribute("draggable", true);

		// Link
		var a = document.createElement("a");
		a.setAttribute("id", this.web.url);
		a.setAttribute("class", CLASS_WEB);
		a.setAttribute("draggable", true)
		a.href = this.web.url;
		a.innerText = this.web.name;

		// Events
		a.addEventListener("dragstart", dragStart);
		a.addEventListener("drop", dragDrop);

		return a;
	}
}

class Category
{
	constructor(category)
	{
		this.category = category;
		this.element = this.createElement()
	}

	createElement()
	{
		// Container
		var section = document.createElement("section");
		section.setAttribute("id", this.category);
		section.setAttribute("class", CLASS_CATEGORY);

		// Title
		var title = document.createElement("p");
		title.innerText = this.category;

		// List
		//var list = document.createElement("ul");
		//list.setAttribute("id", CLASS_CATEGORY_LIST + this.category);
		//list.setAttribute("class", CLASS_CATEGORY_LIST);

		// Add button
		// TODO add button for adding new webs

		section.appendChild(title);
		//section.appendChild(list);

		// Events
		section.addEventListener('dragover', dragOver);
		section.addEventListener('dragenter', dragEnter);
		section.addEventListener('dragleave', dragLeave);
		//section.addEventListener('drop', dragDropOnCategory);
		title.addEventListener('drop', dragDrop);


		return section;
	}
}

class WebJson
{
	constructor()
	{
		this.array = [];
	}

	// Get webs stored in Local Storage 
	// Return JSON array
	// If there's no data, return array with template
	getWebs()
	{
		var array = localStorage.json;
		return array = array == null ? this.template() : JSON.parse(array);
	}

	setWebs()
	{
		localStorage.json = JSON.stringify(this.array);
	}

	// Returns array with one Web object as example
	template()
	{
		var array = [];
		array.push(new Web("Youtube", "https://www.youtube.com", "Entertainment"));
		return array;
	}
}
