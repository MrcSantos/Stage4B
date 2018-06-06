const port = require('../app').port;

const home = "<br><a = href='http://localhost:" + port + "/'>Clicca qui per tornare alla home</a>";

exports.all = function all(res, obj) {
    function extract(i) {
        if(obj.issues[i].fields.description === null) obj.issues[i].fields.description = 'Nessuna descrizione';
        var created = new Date(obj.issues[i].fields.created);

        var issue = {
            'key': obj.issues[i].key,
            'summary': obj.issues[i].fields.summary,
            'status': obj.issues[i].fields.status.statusCategory.name,
            'description': obj.issues[i].fields.description,
            'priority': obj.issues[i].fields.priority.name,
            'date': created.toLocaleDateString() + " - " + created.toLocaleTimeString(),
            'assignee': [],
            'comments': []
        };

        for (var x in obj.issues[i].fields.assignee) {
             issue.assignee.push(obj.issues[i].fields.assignee[x].name);
         }
         for (var x in obj.issues[i].fields.comment.comments) {
             var date = new Date(obj.issues[i].fields.comment.comments[x].created)

             comment = {
                 'name': obj.issues[i].fields.comment.comments[x].author.displayName,
                 'body': obj.issues[i].fields.comment.comments[x].body,
                 'date': date.toLocaleDateString() + " - " + date.toLocaleTimeString()
             }

             issue.comments.push(comment);
         }

        return issue;
    }

    function issues() {
        var issues = [];
        for (var i in obj.issues)
            issues.push(extract(i));
        return issues;
    }

    res.send(issues());
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


exports.err = function error(error) {
    res.send("Siamo spiacenti ma si è verificato un errore" + home);
    col.r("Richiesta fallita; " + error + "\n");
}
