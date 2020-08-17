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

		this.view.bindCommitSettings(this.handlerCommitSettings);
		this.view.bindGetSettings(this.handlerGetSettings);
		this.view.bindUpdateWeb(this.handleUpdateWeb);
		this.view.bindAddWeb(this.handleAddWeb);
		this.view.bindIsDuplicate(this.handlerIsDuplicate);
		this.view.bindReplaceWebs(this.handleReplaceWebs);
		this.view.bindDeleteWeb(this.handleDeleteWeb);
		this.view.bindExportJson(this.handleExportJson);
		this.view.bindImportJson(this.handleImportJson);
		this.view.bindFilter(this.handleFilter);

		// Run View's function for displaying the webs
		this.onWebListChanged(this.model.webs);

		// Pass the same View's function to the model
		this.model.bindWebListChanged(this.onWebListChanged);
	}

	handlerGetSettings = (key) => {
		return this.model.getSettings(key);
	}

	handlerCommitSettings = (key, value) => {
		this.model.commitSettings(key, value);
	}

	onWebListChanged = (webs) => {
		this.view.displayWebs(webs);
	}

	handleAddWeb = (web) => {
		this.model.addWeb(web);
	}

	handlerIsDuplicate = (web) => {
		return this.model.isDuplicate(web);
	}

	handleReplaceWebs = (webs) => {
		this.model.replaceWebs(webs);
	}

	handleUpdateWeb = (url, web) => {
		this.model.updateWeb(url, web);
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