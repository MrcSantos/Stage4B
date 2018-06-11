// $(, ()=>window.location.href = 'asd.html')); // Al caricamento della pagina manda la richiesta al server

function login() {
    var user = $("#user").val();
    var pass = $("#pass").val();

    if (user == "" || pass == "") {
        alert("Tutti i campi sono obbligatori");
    }
    else {
        $.post("/login", {user: user, pass: pass})
        .done(()=>alert("success"));
        .fail(()=>alert("fail"));
    }
}
