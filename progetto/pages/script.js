$(() => $("#out").load("/get")); // Al caricamento della pagina manda la richiesta al server

var isDetails = true;

function pop(id) {
    if (id === undefined && isDetails) {
        $(".blockC").toggle();
        $(".create").toggle(500);
    }
    else {
        isDetails = !isDetails;
        $(".blockD").toggle();
        $(".details").toggle(500);
    }
}

function undo() {
    pop();
    $("form")[0].reset();
}

function create() {
    var titolo = $("#titolo").val();
    var descrizione = $("textarea#descrizione").val();
    var commento = $("textarea#commento").val();

    if (titolo.length > 0) {
        if (!descrizione.length > 0)
            descrizione = "";
        if (!commento.length > 0)
            commento = "";
        $.post("/create", {"tit": titolo, "des":descrizione, "comm":commento});
        undo();
    }
    else
        alert("Manca il titolo");
}

setInterval(() => $("#out").load("/get"), 2000); // Aggiorna la tabella ogni 2 secondi

// // Disable #x
// $( "#x" ).prop( "disabled", true );
//
// // Enable #x
// $( "#x" ).prop( "disabled", false );
