/*
#############
## CLASSES ##
#############
*/
class Web{
	constructor(name, url, category){
		this.name = name;
		this.url = url;
		this.category = category;
	}
}

class Link{
	constructor(name, url, category){
		this.web = new Web(name, url, category)
		this.element = this.createElement()
	}
	
	createElement(){
		// List item
		//var li = document.createElement("li");
		//li.setAttribute("draggable", true);

		// Link
		var a = document.createElement("a");
		a.setAttribute("id", this.web.url);
		a.setAttribute("class", CLASS_WEB);
		a.setAttribute("draggable", true);
		a.setAttribute("target", "_blank");
		a.href = this.web.url;
		a.innerText = this.web.name;

		// Events
		a.addEventListener("dragstart", dragStart);
		a.addEventListener("drop", dragDrop);

		return a;
	}
}

class Category{
	constructor(category){
		this.category = category;
		this.element = this.createElement()
	}

	createElement(){
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

class LocalStorageHelper{
	constructor(){
		this.array = this.getWebs();
	}

	// Get webs stored in Local Storage 
	// Return JSON array
	// If there's no data, return array with template
	getWebs(){
		let webs = (localStorage.json == null) ? this.setTemplate() : JSON.parse(localStorage.json);
		console.log(webs.length + " Webs loaded from LocalStorage");
		return webs;
	}

	// Sets json with parameter, losing previous json data
	setJson(json){
		localStorage.json = JSON.stringify(json);
		console.log(json.length + " webs imported")
		this.getWebs();
	}

	// Returns array with one Web object as example
	setTemplate(){
		var a = [];
		a.push(new Web("Youtube", "https://www.youtube.com", "Entertainment"));
		return a
	}

	insertWeb(web){
		this.array.push(web);
		this.saveToLocalStorage();
	}

	insertWebs(webs){
		for(web in webs){
			this.array.push(web);
		}
		this.saveToLocalStorage();
	}

	saveToLocalStorage(){
		localStorage.json = JSON.stringify(this.array);
		console.log(this.array.length + " webs saved in LocalStorage");
	}
	}
}

/*
###########################
## CONSTANTS & VARIABLES ##
###########################
*/
let INPUT_CONTAINER;
let INPUT_NAME;
let INPUT_URL;
let INPUT_CATEGORY;
let JSON_TEXTBOX;
let WEB_CONTAINER;
let SEARCH_TEXT;
let IMPORT_BUTTON;
let EXPORT_BUTTON;
let FILE_EXPLORER;
let arrayColors = ["#F92672", "#66D9EF", "#A6E22E", "#FD971F"];
const CLASS_INPUT_CONTAINER_INVISIBLE = "invisible";
const CLASS_INPUT_CONTAINER_VISIBLE = "visible";
const CLASS_WEB = "web";
const CLASS_CATEGORY = "category";
const CLASS_CATEGORY_LIST = "categoryList";

var localStorageHelper;

// Stores the current DOM element being dragged
var draggable;


/*
###############
## FUNCTIONS ##
###############
*/

window.onload = function(){
	if(checkLocalStorageCompatibility()){
		init();
	}else{
		alert("Your browser does not support Locar Storage")
	}
}

function init(){
	console.log("Init");

	localStorageHelper = new LocalStorageHelper();
	loadElements();
	fileUploaderListener();	
	update();
}
function update(){
	console.log("Update");

	deleteChildNodes(WEB_CONTAINER);
	paintWebs();

	// Writes json into an input in String format
	JSON_TEXTBOX.value = JSON.stringify(localStorageHelper.array);
}

function loadElements(){
	INPUT_CONTAINER = document.getElementById("inputContainer");
	INPUT_NAME = document.getElementById("inputName");
	INPUT_URL = document.getElementById("inputUrl");
	INPUT_CATEGORY = document.getElementById("inputCategory");
	JSON_TEXTBOX = document.getElementById("jsonTextBox");
	WEB_CONTAINER = document.getElementById("webContainer");
	SEARCH_TEXT = document.getElementById("search_text");
	IMPORT_BUTTON = document.getElementById("importButton");
	EXPORT_BUTTON = document.getElementById("exportButton");
	FILE_EXPLORER = document.getElementById("fileExplorer");
}

//
//	UTIL FUNCTIONS
//

function deleteChildNodes(element){
	console.log("deleteChildNodes");
	try{
		while (element.firstChild){
			element.removeChild(element.firstChild);
		}
	} catch(e){
		console.error(e);
	}
}

// Return actual date with format YYYY-MM-DD
function getToday() {
	var date = new Date();
	return "" + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
}

function textBoxColor(){
	SEARCH_TEXT.style.border = "1px solid " + arrayColors[Math.floor(Math.random() * arrayColors.length)];
}

function checkLocalStorageCompatibility(){
	var compatible = false;
	if (typeof(Storage) !== "undefined"){
		compatible = true;
	}else{
		alert();
		compatible = false;
	}

	console.log("LocalStorage compatible: " + compatible );
	return compatible;
}

//
// CONTAINER FUNCTIONS
//

// Append Link and Category objects in the container div
function paintWebs(){
	console.group("paintWebs");

	try {
		// Create categories with their webs
		for(let web of localStorageHelper.array){
			var category = document.getElementById(web.category);

			// Create category if not exists
			if(category == null){
				WEB_CONTAINER.appendChild(new Category(web.category).element);
				category = document.getElementById(web.category);
			}

			// Append web to the <ul> of the category
			category.appendChild(new Link(web.name, web.url, web.category).element);
		}
		console.log(localStorageHelper.array.length + " webs loaded in screen");
	} catch(e) {
		console.error(e);
		alert(e.message);
	}
	console.groupEnd();
}

// Save webs to localStorage in JSON format
function exportHtmlToJson(){
	console.group("exportHtmlToJson");

	var categories = document.querySelectorAll(".category");
	console.log(categories.length + " categories found");


	// Iterate each categories
	for(let category of categories){
		var webs = category.querySelectorAll(".web");
		console.log(webs.length + " webs found for " + category.id);

		var webs = [];
		// Iterate each web from a category
		for(let web of webs){
			webs.push(web);
		}
		localStorageHelper.insertWeb(webs);
	}
}

//
// INPUT FUNCTIONS
//

// Add web from inputs to the Local Storage
// TODO rename insertWeb
function insertWeb(){
	try {
		// Check all inputs are filled
		if (INPUT_NAME != "" && INPUT_URL != "" && INPUT_CATEGORY != "") {

			// Create Web object with data from inputs
			localStorageHelper.insertWeb(new Web(
				INPUT_NAME.value,
				INPUT_URL.value,
				INPUT_CATEGORY.value
			));

			update();
		}
	}
	catch(e) {
		alert(e.message);
	}
}

// Imports json from the import textBox input
function importJSON_onClick(){
	try {
		localStorageHelper.setJson(JSON.parse(JSON_TEXTBOX.value));
	} 
	catch(e) {
		alert(e.message);
	}
	
	update();
}

// Shows/hides the menu
function dropDownMenu_onClick(){
	var element = document.getElementById(ID_INPUT_CONTAINER);

	if(element.classList.contains(CLASS_INPUT_CONTAINER_INVISIBLE)){
		element.className = CLASS_INPUT_CONTAINER_VISIBLE;
	}
	else{
		element.className = CLASS_INPUT_CONTAINER_INVISIBLE;	
	}
}

function openFileExplorer(){
	FILE_EXPLORER.click();
}

// Initialice listener for changes in the file input
// When a file is selected, reemplaces the actual websites with the ones readed
function fileUploaderListener() {
	FILE_EXPLORER.addEventListener("change", function(){
	var reader = new FileReader();

	reader.onload = function(event){
		try {
			localStorageHelper.setJson(JSON.parse(event.target.result));
			update();
		} 
		catch(e) {
			alert(e.message);
		}
	}

	reader.readAsText(event.target.files[0]);
});
}

// Exports the websites in a .json file
function exportJson() {
	console.group("exportJson");
	try{
		var data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(localStorageHelper.array));
		var link = document.getElementById("downloadLink");
		var fileName = getToday()+ "_startPage.json";
		link.setAttribute("href", data);
		link.setAttribute("download", fileName);
		link.click();
		console.log(localStorageHelper.array.length + " webs exported to " + fileName );
	}catch(e){
		alert(e.message);
		console.error(e);
	}
	console.groupEnd();
}

//
// DRAG & DROP
//

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








