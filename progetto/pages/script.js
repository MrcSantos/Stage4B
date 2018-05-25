var httpReq = new XMLHttpRequest();

httpReq.onreadystatechange = function() {
	if (httpReq.readyState == 4 && httpReq.status == 200) {
		document.getElementById("out").innerHTML = httpReq.responseText;
	}
};

/*function key() {
    httpReq.open("GET", "/id", true);
    httpReq.send();
}
function titolo() {
    httpReq.open("GET", "/titolo", true);
    httpReq.send();
}*/
function tabella() {
    httpReq.open("GET", "/json", true);
    httpReq.send();
}

tabella();

function pop() {

}
