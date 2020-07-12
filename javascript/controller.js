/**
 * @class Controller
 *
 * Links the user input and the view output.
 *
 * @param model
 * @param view
 */
class Controller {
	constructor(model, view) {
		this.model = model
		this.view = view

		this.onWebListChanged(this.model.webs);
		this.view.bindAddWeb(this.handleAddWeb);
		// TODO edit web
		//this.view.bindEditWeb(this.handleEditWeb);
		this.view.bindDeleteWeb(this.handleDeleteWeb);
		this.model.bindWebListChanged(this.onWebListChanged);
		this.view.bindExportJson(this.handleExportJson);
		this.view.bindImportJson(this.handleImportJson);
		this.view.bindFilter(this.handleFilter);
	}

	onWebListChanged = (webs) => {
		this.view.displayWebs(webs);
	}

	handleAddWeb = (web) => {
		this.model.addWeb(web);
	}

	handleEditWeb = (url, web) => {
		this.model.editWeb(url, web);
	}

	handleDeleteWeb = (url) => {
		this.model.deleteWeb(url);
	}

	handleExportJson = () => {
		return this.model.webs;
	}

	handleImportJson = (webs) => {
		this.model.importWebs(webs)
	}

	handleFilter = (search) => {
		this.model.filterSearch(search);
	}
}

const app = new Controller(new Model(), new View());
app.view.searchText.focus();