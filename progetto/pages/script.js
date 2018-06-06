$(() => $.get("/get", (data, status) => init(data))); // Al caricamento della pagina manda la richiesta al server

var allIssuesFields = [];
var tab = [];
var isDetails = false; // Quando il popup dei dettagli è aperto la variabile cambia stato

function init(data) {
    assign(data);

    for (var i in data) {
        var riga = {}

        /* Controllo delle impostazioni della tabella qui */
        riga.key = data[i].key;
        riga.summary = data[i].summary;
        riga.status = data[i].status;
        riga.description = data[i].description;

        tab.push(riga);
    }

    $.get("/get", (data, status) => $("#out").html(tabelize(tab)));
}
function assign(data) {
    for (var i in data) {
        if (data[i].description == null) {
            data[i].description = "Nessuna descrizione";
        }
        if (data[i].assignee) {
            data[i].assignee = "Nessuno assegnato";
        }
        if (data[i].comments.length == 0) {
            data[i].comments = ["Nessun commento"];
        }
    }

    allIssuesFields = data;
}
function pop(id) {
    if (id === undefined && !isDetails) { // Si apre il popup per creare una issue
        $(".blockC").toggle();
        $(".create").toggle(500);
    }
    else { // Si apre il popup per vedere i dettagli
        isDetails = !isDetails;
        $(".blockD").toggle();
        $(".details").toggle(500);

        // Prendo tutti i campi del popup
        $("#key").text("Issue n." + allIssuesFields[Math.floor(id)].key);
        $("#summary").text(allIssuesFields[Math.floor(id)].summary);
        $("#status").text(allIssuesFields[Math.floor(id)].status);
        $("#description").text(allIssuesFields[Math.floor(id)].description);
        $("#priority").text(allIssuesFields[Math.floor(id)].priority);
        $("#date").text(allIssuesFields[Math.floor(id)].date);
        $("#assignee").text(allIssuesFields[Math.floor(id)].assignee);
        $("#comments").text(allIssuesFields[Math.floor(id)].comments);

        var userComment = $("textarea#userComment").val();
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

setInterval(() => $.get("/get", (data, status) => $("#out").html(tabelize(tab))), 5000); // Aggiorna la tabella ogni 5 secondi

// // Disable #x
// $( "#x" ).prop( "disabled", true );
//
// // Enable #x
// $( "#x" ).prop( "disabled", false );
