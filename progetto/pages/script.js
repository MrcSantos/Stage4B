/*----------------------------------------------------------------------------*/ // Inizializzazione dati e funzioni

$(getIssues()); // Al caricamento della pagina manda la richiesta al server
setInterval(() => getIssues(), 5000); // Aggiorna i dati ogni 5 secondi

var allIssuesFields = []; // Contiene tutte le informazioni di tutte le issues

// Controlla e assegna i dati ricevuti nelle variabili e nella pagine in modo corretto
function setDataInPlace() {
    var table = []; // Contiene gli elementi della tabella principale

    for (var i in allIssuesFields) { // Costruisce la tabella tenendo conto delle impostazioni della tabella
        table.push(buildRowFromSettings(allIssuesFields[i]));
    }

    // "Tabelizza" tutte le issues e le returna
    $("#out").html(getTableHtml(table));
}

// Intercetta e "corregge" i campi non obbligatori vuoti che trova nelle issues ricevute
function emptyFieldsHandler(data) {
    for (var i in data) {
        var current = data[i]; // Dati della issue corrente

        if (current.description == null) {
            current.description = "Nessuna descrizione";
        }
        if (!current.assignee) {
            current.assignee = "Nessuno assegnato";
        }
        if (current.comments.length == 0) {
            current.comments = ["Nessun commento"];
        }
    }

    return data; // Returna i dati validi per assegnarli a allIssuesFields
}

/*----------------------------------------------------------------------------*/ // Gestione delle issues

// Effettua la richiesta di visualizzare le issues e le mette in allIssuesFields
function getIssues() {
    $.get("/get", (data, status) => {
        allIssuesFields = emptyFieldsHandler(data);
        setDataInPlace();
    });
};

// Permette di creare una issue quando tutti i campi sono corretti
function createIssue() {
    // Prendo tutti i valori necessari dal popup
    var summary = $("#C-titolo").val();
    var type = $("#C-tipo").val();
    var description = $("textarea#C-descrizione").val();
    var comment = $("textarea#C-commento").val();

    // Controllo della presenza del titolo (Obbligatorio per creare una issue)
    if (summary.length > 0 && type.length > 0) {
        // Converte il titolo in formato univoco per tutte le issues
        summary = summary.slice(0, 1).toUpperCase() + summary.slice(1);

        // Mando la richiesta al server con tutti i dati
        $.post("/create", {"summary": summary, "type": type, "description":description, "comment":comment}, () => getIssues());

        // Chiudo il popup e resetto i campi
        toggleCreate();
    }
    else // Se manca il titolo viene segnalato l'errore tramite alert
        alert("Il titolo e il tipo di issue non possono essere vuoti");
}

// Permette di creare un commento quando tutti i campi sono corretti
function commentIssue() {
    // Prendo tutti i valori necessari dal popup
    var key = $("#key").text();
    var userComment = $("textarea#D-commento").val();

    // Controllo della presenza del commento
    if (userComment != "") {
        // Mando la richiesta al server con tutti i dati
        $.post("/comment", {'key': key, 'comment': userComment}, () => {
            getIssues();
            assignPopupValues();
        });
        // Chiudo il popup e resetto i campi
        // toggleDetails();
    }
    else // Se manca il commento viene segnalato l'errore tramite alert
        alert("Il commento non può essere vuoto");
}

/*----------------------------------------------------------------------------*/ // Gestione dei popup

// Apre e chiude il modal per creare una nuova issue
function toggleCreate() {
    $(".blockC").toggle();
    $(".create").toggle(500);
    resetFields();
}

// Apre e chiude il modal per vedere i dettagli di una issue
function toggleDetails(id) { // L'id passato rappresenta il numero di issue/riga (in locale)
    $(".blockD").toggle();
    $(".details").toggle();
    resetFields();

    assignPopupValues(id); // Assegno i valori nel popup tramite l'id
}

// Apre e chiude il modal per vedere le impostazioni della tabella
function toggleSettings() {
    $("#settings").toggle();
}

// Apre e chiude il modal per vedere i filtri delle issues
function toggleFilters() {
    $("#filters").toggle();
}

// Manda al server il numero di filtro e aggiorna i dati
function setFilter() {
    $.post("/filter", { "filter": getFilter() })
    .done(getIssues());
}

// Returna il numero di riga checkato nel form
function getFilter() {
    filters = $(".filters");

    for (var i = 0; i < filters.length; i++) {
        if (filters[i].checked) {
            return i;
        }
    }
}

// Assegno i valori nel popup tramite l'id
function assignPopupValues(id) { // L'id passato rappresenta il numero di issue/riga (in locale)
    var currentIssue = allIssuesFields[Math.floor(id)]; // Controllo solo l'issue corrente

    // Prendo tutti i campi del popup leggendoli dalla variabile master
    $("#key").text(currentIssue.key);
    $("#summary").text("Titolo: " + currentIssue.summary);
    $("#status").text("Status: " + currentIssue.status);
    $("#type").text("Tipo issue: " + currentIssue.type);
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
function resetFields() {
    $('#C-titolo').val(''); // Resetta tutto il form dentro al popup di creazione di una issue
    $('#C-descrizione').val('');
    $('#C-commento').val('');
    $('#D-commento').val(''); // Resetta dentro al commento nei dettagli
}

// Resetta le impostazioni della tabella
function resetSettings() {
    $("form")[0].reset();
    setDataInPlace();
}

/*----------------------------------------------------------------------------*/ // Funzioni tabella principale

// Restituisce l'html necessario per costruire la tabella principale
function getTableHtml(data) {
    const head = {key: 'chiave', summary: 'titolo', status: 'status', description: 'descrizione', type:"Tipo", priority: 'priorità', date: 'data', assignee: 'assegnato'};

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

    out += newRow(null, buildRowFromSettings(head), true);

    out += "<tbody>";
    for (var i in data)
        out += newRow(i, data[i], false);
    out += "</tbody>";

    return out;
}

// Controllo delle impostazioni della tabella in modo da dare i campi interessati
function buildRowFromSettings(data) {
    var row = [];
    var settings = getSettings();
    const rowFields = [row.key, row.summary, row.status, row.description, row.type, row.priority, row.date, row.assignee];
    const dataFields = [data.key, data.summary, data.status, data.description, data.type, data.priority, data.date, data.assignee];

    // Costruisce la riga pushando solo se la checkbox corrispondente è selezionata
    for (var i in settings) {
        if (settings[i]) {
            rowFields[i] = dataFields[i];
            row.push(rowFields[i]);
        }
    }

    return row;
}

// Returna tutte le opzioni della checkbox in un array
function getSettings() {
    var allOptions = $(".settings"); // Prende Tutti gli elementi della checkbox
    var options = [];

    for (var i = 0; i < allOptions.length; i++) { // Costruisco l'array di booleani per ogni opzione
        // Ordine checkbox: key - summary - status - description - issuetype - priority - date - assignee
        options.push(allOptions[i].checked);
    }

    // Returna l'array di booleani
    return options;
}
