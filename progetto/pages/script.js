/*----------------------------------------------------------------------------*/ // Inizializzazione dati e funzioni

$(() => $.get("/get", (data, status) => setData(data))); // Al caricamento della pagina manda la richiesta al server
setInterval(() => $.get("/get", (data, status) => setData(data)), 5000); // Aggiorna la tabella ogni 5 secondi

var allIssuesFields = []; // Contiene tutte le informazioni di tutte le issues

/*----------------------------------------------------------------------------*/ // Gestione delle issues

// Controlla e assegna i dati ricevuti nelle variabili e nella pagine in modo corretto
function setData(data) {
    allIssuesFields = emptyFieldsHandler(data); // Corregge i campi e assegna tutte le issues ricavate a allIssuesFields

    var table = []; // Contiene gli elementi della tabella principale

    for (var i in data) {
        table.push(tableSettings(data[i]));
    }

    $.get("/get", (data, status) => $("#out").html(tabelize(table)));
}

// Intercetta e "corregge" i campi non obbligatori vuoti che trova nelle issues ricevute
function emptyFieldsHandler(data) {
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

    return data; // Assegno i dati validi a allIssuesFields
}

function createIssue() {
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
        refresh();
        toggleCreate();
    }
    else
        alert("Il titolo non può essere vuoto");
}

function comment() {
    var key = $("#key").text();
    var userComment = $("textarea#D-commento").val();

    if (userComment != "") {
        $.post("/comment", {'key': key, 'comm': userComment});
        refresh();
        toggleDetails();
    }
    else {
        alert("Il commento non può essere vuoto");
    }
}

/*----------------------------------------------------------------------------*/ // Gestione dei popup

// Apre e chiude il modal per creare una nuova issue
function toggleCreate() {
    $(".blockC").toggle();
    $(".create").toggle(500);
    refresh();
}

// Apre e chiude il modal per vedere i dettagli di una issue
function toggleDetails(id) { // L'id passato rappresenta il numero di issue/riga (in locale)
    $(".blockD").toggle();
    $(".details").toggle();
    refresh();

    assignPopupValues(id); // Assegno i valori nel popup tramite l'id
}

// Assegno i valori nel popup tramite l'id
function assignPopupValues(id) { // L'id passato rappresenta il numero di issue/riga (in locale)
    var currentIssue = allIssuesFields[Math.floor(id)]; // Controllo solo l'issue corrente

    // Prendo tutti i campi del popup leggendoli dalla variabile master
    $("#key").text(currentIssue.key);
    $("#summary").text("Titolo: " + currentIssue.summary);
    $("#status").text("Status: " + currentIssue.status);
    $("#description").text("Descrizione: " + currentIssue.description);
    $("#priority").text("Priorità: " + currentIssue.priority);
    $("#date").text("Creata il: " + currentIssue.date);
    $("#assignee").text("Assegnati: " + currentIssue.assignee);
    $("#comments").html(getCommentsHtml(id)); // Faccio costruire la tabella dei commenti
}

// Restituisce la tabella in html dei commenti
function getCommentsHtml(id) {
    var currentIssue = allIssuesFields[Math.floor(id)]; // Controllo solo l'issue corrente

    var out = "";
    if (currentIssue.comments != "Nessun commento") {
        for (var i in currentIssue.comments) {
            out += "<tr class='header'>";
            out += "<td>" + currentIssue.comments[i].name;
            out += "<td>" + currentIssue.comments[i].date;
            out += "</tr>";
            out += "<tr class='border'>";
            out += "<td colspan='2'>" + currentIssue.comments[i].body;
            out += "</tr>";
        }
    }
    else {
        out = "Nessun commento";
    }
    return out;
}

// Azzero tutti i campi di input dei popup
function refresh() {
    $("form")[0].reset(); // Resetta tutto il form dentro al popup di creazione di una issue
    $('#D-commento').val(''); // Resetta dentro al commento nei dettagli
}

/*----------------------------------------------------------------------------*/ // Funzioni tabella principale

// Restituisce l'html necessario per costruire la tabella principale
function tabelize(obj) {
    const head = {Id:"ID", Titolo:"TITOLO", Status:"STATUS", Descrizione:"DESCRIZIONE"};

    // Costruisce una sola riga della tabella
    function newRow(id, obj, isHeader) { // id = numero della riga da passare a pop(); obj = oggetto in una riga; isHeader = controllo per l'header della tabella
        var out = "";

        if(isHeader) out += "<thead class='head'><tr class='w3-light-grey fix'>";
        else out += "<tr onclick='toggleDetails(" + id + ")'>";

        for (var i in obj) {
            out +=  "<td>\
            " + obj[i] + "\
            </td>";
        }
        out += "</tr>";
        if(isHeader) out += "</thead>";

        return out;
    }

    var out = "";

    out += newRow(i, head, true);

    out += "<tbody>";
    for (var i in obj)
        out += newRow(i, obj[i]);
    out += "</tbody>";

    return out;
}

// Controllo delle impostazioni della tabella in modo da dare i campi interessati
function tableSettings(data) {
    var row = {}

    row.key = data.key;
    row.summary = data.summary;
    row.status = data.status;
    row.description = data.description;

    return row;
}
