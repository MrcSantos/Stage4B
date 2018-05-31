$(() => $("#out").load("/get")); // Al caricamento della pagina manda la richiesta al server

function pop() {
    $("#block").toggle();
    $("#popup").toggle(500);
}

function undo() {
    pop();
    $("#form")[0].reset();
}

function create() {
    var titolo = $("#titolo").val();
    var status = $("#status").val();
    var descrizione = $("textarea").val();

    if (titolo.length > 0 && status.length > 0) {
        if (!descrizione.length > 0) {
            descrizione = "";
        }
        $.post("/create", {titolo: titolo, status:status, descrizione:descrizione});
        undo();
        setTimeout(()=>$("#out").load("/get"), 100);
    }
    else {
        if (titolo.length > 0) {

        }
        if (status.length > 0) {

        }
    }
}

// // Disable #x
// $( "#x" ).prop( "disabled", true );
//
// // Enable #x
// $( "#x" ).prop( "disabled", false );
