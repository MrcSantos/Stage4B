var tentativi = 0;

function login() {
    var user = $("#user").val();
    var pass = $("#pass").val();
    var host = $("#host").val();

    if (user == "" || pass == "" || host == "") {
        alert("Tutti i campi sono obbligatori");
    }
    else {
        $.post("/login", { user: user, pass: pass, host:host })
        .done((res) => success(user, pass, host))
        .fail((res) => fail())
    }
}

// Funzione richiamata quando il login va a buon fine
function success(user, pass, host) {
    localStorage.setItem("jit_user", user);
    localStorage.setItem("jit_pass", pass);
    localStorage.setItem("jit_host", host);
    window.location.href = '../index.html';
}

// Funzione richiamata quando il login fallisce
function fail() {
    tentativi ++;
    alert("Credenziali errate");

    // Dopo 3 tentativi errati non permette l'accesso per 5 secondi
    if (tentativi == 3) {
        tentativi = 0;
        alert("Tentativi esauriti, attendere 5 secondi");
        $("#button").hide();
        setTimeout(()=> $("#button").show(), 5000);
    }
}
