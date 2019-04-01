
function dragStart()
{
	draggable = this;
}

function dragEnd()
{
}

function dragOver(e)
{
	e.preventDefault();
}

function dragEnter(e)
{
	e.preventDefault();
}

function dragLeave()
{
}

function dragDrop(e)
{
	insertNodeAfter(draggable, this);
	e.preventDefault();
	exportHtmlToJson();
}

function dragDropOnCategory (e)
{
	this.append(draggable);
	e.preventDefault();
	exportHtmlToJson();
}

function insertNodeBefore(newNode, referenceNode)
{
	referenceNode.parentNode.insertBefore(newNode, referenceNode);
}

function insertNodeAfter(newNode, referenceNode)
{
	referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
// Paint webs in the container div
function paintWebs()
{
	try 
	{
		var webJson = new WebJson();
		webJson.array = webJson.getWebs();

		var container = document.getElementById(ID_WEB_CONTAINER);
		
		deleteChildNodes(container);

		// Create categories with their webs
		for(let item of webJson["array"])
		{
			var category = document.getElementById(item.category);

			// Create category if not exists
			if(category == null)
			{
				container.appendChild(new Category(item.category).element);
				category = document.getElementById(item.category);
			}

			// Append web to the <ul> of the category
			category.appendChild(new WebLink(item.name, item.url, item.category).element);
		}

		exportJsonToText(webJson);

	} catch(e) 
	{
		alert(e.message);
	}
}

function deleteChildNodes(element)
{
	while (element.firstChild)
	{
		element.removeChild(element.firstChild)
	}
}

// Export all webs from HTML to JSON
function exportHtmlToJson() 
{
	var webJson = new WebJson();
	var categories = document.querySelectorAll(".category")

	for(let category of categories)
	{
		var webs = category.querySelectorAll(".web")

		for(let web of webs)
		{
			webJson.array.push(new Web(web.text, web.id, category.id))
		}
	}

	try 
	{
		webJson.setWebs();
	} 
	catch(e) 
	{
		alert(e.message);
	}
}
// Add web from inputs to the Local Storage
function addWeb_onClick()
{
	try 
	{
		var name = document.getElementById(ID_INPUT_NAME).value;
		var url = document.getElementById(ID_INPUT_URL).value;
		var category = document.getElementById(ID_INPUT_CATEGORY).value;

		// Check all inputs are filled
		if (name != "" && url != "" && category != "") 
		{
			// Check browser's LocalStorage compatibility
			if (typeof(Storage) !== "undefined")
			{
				var webJson = new WebJson();
				webJson.array = webJson.getWebs();

				// Create Web object with data from inputs
				var newWeb = new Web(
					name,
					url,
					category
					);

				// Add new web
				webJson.array.push(newWeb);

				// Save JSON file
				localStorage.json = JSON.stringify(webJson.array);

				paintWebs();
			} 
			else
			{
				alert("Sorry! No Web Storage support..");
			}
		}	
	} 
	catch(e) 
	{
		alert(e.message);
	}
}


function exportJsonToText(webJson)
{
	var textBox = document.getElementById(ID_JSON_TEXTBOX);
	textBox.value = JSON.stringify(webJson.array);
}

function importJSON_onClick()
{
	var webJson = new WebJson();
	var textBox = document.getElementById(ID_JSON_TEXTBOX);
	try 
	{
		webJson.array = JSON.parse(textBox.value);
		webJson.setWebs();
	} 
	catch(e) 
	{
		alert(e.message);
	}
	
	paintWebs();
}

function dropDownMenu_onClick()
{
	var element = document.getElementById(ID_INPUT_CONTAINER);

	if(element.classList.contains(CLASS_INPUT_CONTAINER_INVISIBLE))
	{
		element.className = CLASS_INPUT_CONTAINER_VISIBLE;
	}
	else
	{
		element.className = CLASS_INPUT_CONTAINER_INVISIBLE;	
	}
}

















function textBoxColor ()
{
	var colores = ["#F92672", "#66D9EF", "#A6E22E", "#FD971F"];

	var colorRamdom = colores[Math.floor(Math.random() * colores.length)];

	document.getElementById("search_text").style.border = "1px solid " + colorRamdom;
}


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
