$(() => $("#out").load("/get")); // Al caricamento della pagina manda la richiesta al server

function create() {
    $("#out").load("/create");
}

function pop() {
    $("#block").toggle();
    $("#popup").toggle(500);
}
