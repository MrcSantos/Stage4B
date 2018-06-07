$(() => $.get("/get", (data, status) => init(data))); // Al caricamento della pagina manda la richiesta al server

var allIssuesFields = [];
var isDetails = false; // Quando il popup dei dettagli è aperto la variabile cambia stato

function init(data) {
    assign(data);
    var tab = [];
    var newTab = [];

    for (var i in data) {
        var riga = {}

        /* Controllo delle impostazioni della tabella qui */
        riga.key = data[i].key;
        riga.summary = data[i].summary;
        riga.status = data[i].status;
        riga.description = data[i].description;

        newTab.push(riga);
    }
    tab = newTab;
    $.get("/get", (data, status) => $("#out").html(tabelize(tab)));
}

function assign(data) {
    for (var i in data) {
        if (data[i].description == null) {
            data[i].description = "Nessuna descrizione";
        }
        if (!data[i].assignee) {
            data[i].assignee = "Nessuno assegnato";
        }
        if (data[i].comments.length == 0) {
            data[i].comments = ["Nessun commento"];
        }
    }

    allIssuesFields = data;
}

function getCommentsHtml(id) {
    var out = "";
    if (allIssuesFields[id].comments != "Nessun commento") {
        for (var i in allIssuesFields[id].comments) {
            out += "<tr class='header'>";
            out += "<td>" + allIssuesFields[Math.floor(id)].comments[i].name;
            out += "<td>" + allIssuesFields[Math.floor(id)].comments[i].date;
            out += "</tr>";
            out += "<tr class='border'>";
            out += "<td colspan='2'>" + allIssuesFields[Math.floor(id)].comments[i].body;
            out += "</tr>";
        }
    }
    else {
        out = "Nessun commento";
    }
    return out;
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
        $("#key").text("Issue " + allIssuesFields[Math.floor(id)].key);
        $("#summary").text("Titolo: " + allIssuesFields[Math.floor(id)].summary);
        $("#status").text("Status: " + allIssuesFields[Math.floor(id)].status);
        $("#description").text("Descrizione: " + allIssuesFields[Math.floor(id)].description);
        $("#priority").text("Priorità: " + allIssuesFields[Math.floor(id)].priority);
        $("#date").text("Creata il: " + allIssuesFields[Math.floor(id)].date);
        $("#assignee").text("Assegnati: " + allIssuesFields[Math.floor(id)].assignee);
        $("#comments").html(getCommentsHtml(id));
    }
}

function undo() {
    pop();
    $("form")[0].reset();
    document.getElementById("textarea#D-commento").innerHTML = "";
}

function create() {
    var titolo = $("#C-titolo").val();
    var descrizione = $("textarea#C-descrizione").val();
    var commento = $("textarea#C-commento").val();
    if (titolo.length > 0) {
        // Converte il titolo in formato univoco per tutte le issues
        titolo = titolo.slice(0, 1).toUpperCase() + titolo.slice(1);

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

function comment() {
    var titolo = $("#summary").val();
    var userComment = $("textarea#D-commento").val();

    $.post("/comment", {'tit': titolo, 'comm': userComment});

    undo();
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

setInterval(() => $.get("/get", (data, status) => init(data)), 2000); // Aggiorna la tabella ogni 5 secondi

// // Disable #x
// $( "#x" ).prop( "disabled", true );
//
// // Enable #x
// $( "#x" ).prop( "disabled", false );
