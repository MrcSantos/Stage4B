$(() => $("#out").load("/json")); // Al caricamento della pagina manda la richiesta al server

function pop() {
    $("#popup").toggle(500);
}
