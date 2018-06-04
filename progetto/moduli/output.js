const port = require('../app').port;

const head = {Id:"ID", Titolo:"TITOLO", Status:"STATUS", Descrizione:"DESCRIZIONE"};
const home = "<br><a = href='http://localhost:" + port + "/'>Clicca qui per tornare alla home</a>";

function tabelize(obj) {
    function riga(id, obj, isHead) {
        if (isHead === undefined) isHead = false;
        if (id === undefined) id = "";
        var out = "";

        if(isHead) out += "<thead><tr class='w3-light-grey fix'>";
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

exports.all = function all(res, obj) {
    var got = JSON.parse(obj);

    function extract(i) {
        if(got.issues[i].fields.description === null) got.issues[i].fields.description = 'Nessuna descrizione';
        var issue = {
            'key': got.issues[i].key,
            'summary': got.issues[i].fields.summary,
            'status': got.issues[i].fields.status.statusCategory.name,
            'description': got.issues[i].fields.description
        };
        return issue;
    }

    function issues() {
        var issues = [];
        for (var i in got.issues)
            issues.push(extract(i));
        return issues;
    }

    res.send(tabelize(issues()));
}

exports.err = function error(error) {
    res.send("Siamo spiacenti ma si è verificato un errore" + home);
    col.r("Richiesta fallita; " + error + "\n");
}
