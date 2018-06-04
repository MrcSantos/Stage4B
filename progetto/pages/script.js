$(() => $("#out").load("/get")); // Al caricamento della pagina manda la richiesta al server

function pop(id) {
    $(".block").toggle();
    $(".create").toggle(500);
    // if(id === undefined)
    //     $("#details").toggle(500);
    // else
    //
    // if (id) {
    //
    // }
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
        $.post("/create", {"tit": titolo, "sta":status, "des":descrizione});
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
