/**
 * @class Model
 *
 * Manages the data of the application.
 */
class Model {
	constructor() {
		this.webs = JSON.parse(localStorage.getItem('json')) || [];
		this.filterWebs = [];

		this.settings = JSON.parse(localStorage.getItem('settings')) || {};
	}

	commitSettings(key, value) {
		this.settings[key] = value;
		localStorage.setItem('settings', JSON.stringify(this.settings));
	}

	getSettings(key) {
		return this.settings[key];
	}

	bindWebListChanged(callback){
		// Store View's function for display the webs
		this.onWebListChanged = callback;
	}

	// Save webs on localStorage
	_commit(webs) {
		localStorage.setItem('json', JSON.stringify(webs));
		this.onWebListChanged(webs);
	}

	addWeb(web) {
		this.webs.push(web);
		this._commit(this.webs);
	}

	addWebs(webs) {
		this.webs.push(...web);
		this._commit(this.webs);
	}

	replaceWebs(webs) {
		this.webs = webs;
		this._commit(this.webs);
	}

	editWeb(url, updatedWeb) {
		this.webs = this.webs.map(w =>
			w.url === url ? {
				url: w.url, name: updatedWeb.name, url: updatedWeb.url 
			} : w );
		this._commit(this.webs);
	}

	deleteWeb(url) {
		this.webs = this.webs.filter(web => web.url !== url);
		this._commit(this.webs);
	}

	findDuplicate(web) {
		return this.webs.find(w => w.url == web.url)
	}

	importWebs(webs) {
		this.webs = webs;
		this._commit(this.webs);
	}

	// Filter webs with fuzzy search
	filterSearch(search) {
		if(search === ""){
			// If search empty, show all webs
			this.onWebListChanged(this.webs);
		} else {
			this.filterWebs = [];

			this.webs.forEach( web => {
				if (this.fuzzySearch(search, web.name)) this.filterWebs.push(web);
			});

			// Show filtered webs
			this.onWebListChanged(this.filterWebs);
		}
	}

	fuzzySearch (search, item) {
		search = search.toLowerCase();
		item = item.toLowerCase();

		let itemLength = item.length;
		let searchLength = search.length;

		if (searchLength > itemLength) {
			return false;
		}
		if (searchLength === itemLength) {
			return search === item;
		}
		outer:
		for (var i = 0, j = 0; i < searchLength; i++) {
			var nch = search.charCodeAt(i);
			while (j < itemLength) {
				if (item.charCodeAt(j++) === nch) {
					continue outer;
				}
			}	
			return false;
		}
		return true;
	}
}