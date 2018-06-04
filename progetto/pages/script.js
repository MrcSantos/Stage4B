$(() => $("#out").load("/get")); // Al caricamento della pagina manda la richiesta al server

var isDetails = true;

function pop(id) {
    if (id === undefined && isDetails) { // Apertura del popup di creazione di una issue
        $(".blockC").toggle();
        $(".create").toggle(500);
    }
    else { // Apertura del popup di dettaglio di una issue
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
    var titolo = $("#C-titolo").val();
    var descrizione = $("textarea#C-descrizione").val();
    var commento = $("textarea#C-commento").val();

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

function tabelize(obj) {
    const head = {Id:"ID", Titolo:"TITOLO", Status:"STATUS", Descrizione:"DESCRIZIONE"};

    function riga(id, obj, isHead) {
        if (isHead === undefined) isHead = false;
        if (id === undefined) id = "";
        var out = "";

        if(isHead) out += "<thead class='head'><tr class='w3-light-grey fix'>";
        else out += "<tr onclick='pop(" + id + ")'>";

        for (var i in obj) {
            out +=  "<td>\
            " + obj[i] + "\
            </td>";
        }
        out += "</tr>";
        if(isHead) out += "</thead>";

        return out;
    }

    var out = "";

    out += riga(i, head, true);

    out += "<tbody>";
    for (var i in obj)
        out += riga(i, obj[i]);
    out += "</tbody>";

    return out;
}


// setInterval(() => $("#out").load("/get"), 5000); // Aggiorna la tabella ogni 5 secondi

// // Disable #x
// $( "#x" ).prop( "disabled", true );
//
// // Enable #x
// $( "#x" ).prop( "disabled", false );
