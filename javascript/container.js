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