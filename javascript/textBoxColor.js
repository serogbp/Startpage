function textBoxColor(){
	var colores = ["#F92672", "#66D9EF", "#A6E22E", "#FD971F"];

	var colorRamdom = colores[Math.floor(Math.random() * colores.length)];

	document.getElementById("search_text").style.border = "1px solid " + colorRamdom;
}

