$(() => $("#out").load("/get")); // Al caricamento della pagina manda la richiesta al server

var isDetails = false;

function pop(id) {
    if (id === undefined && !isDetails) {
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
        setTimeout(()=>$("#out").load("/get"), 100);
    }
    else {
        if (!titolo.length > 0) {
            alert("Manca il titolo");
        }
        if (!status.length > 0) {
            alert("Manca lo status");
        }
    }
}

setTimeout(()=>$("#out").load("/get"), 1000);

// // Disable #x
// $( "#x" ).prop( "disabled", true );
//
// // Enable #x
// $( "#x" ).prop( "disabled", false );
