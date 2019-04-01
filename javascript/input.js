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
















