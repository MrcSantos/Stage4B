var tentativi = 0;

function login() {
    var user = $("#user").val();
    var pass = $("#pass").val();

    if (user == "" || pass == "") {
        alert("Tutti i campi sono obbligatori");
    }
    else {
        $.post("/login", {user: user, pass: pass})
        .done((res) => success(user))
        .fail((res) => fail())
    }
}

function success(user) {
    alert("Login eseguito con successo, benvenuto " + user);
    window.location.href = 'app.html';
}
function fail() {
    tentativi ++;
    alert("Login errato, " + parseInt(3-tentativi) + " tentativi rimasti");

    if (tentativi == 3) {
        tentativi = 0;
        alert("Tentativi esauriti, attendere 5 secondi");
        $("#button").hide();
        setTimeout(()=> $("#button").show(), 5000);
    }
}
