const port = require('../app').port;

const home = "<br><a = href='http://localhost:" + port + "/'>Clicca qui per tornare alla home</a>";

exports.all = function all(res, obj) {
    var got = JSON.parse(obj);

    function extract(i) {
        if(got.issues[i].fields.description === null) got.issues[i].fields.description = 'Nessuna descrizione';
        var issue = {
            'key': got.issues[i].key,
            'summary': got.issues[i].fields.summary,
            'status': got.issues[i].fields.status.statusCategory.name,
            'description': got.issues[i].fields.description,
            'priority': got.issues[i].fields.priority.name,
            'assignee': got.issues[i].fields.assignee[0].name,
            'comment author': got.issues[i].fields.comment.comments[0].author,
            'comment body': got.issues[i].fields.comment.comments[0].body
        };
        return issue;
    }

    function issues() {
        var issues = [];
        for (var i in got.issues)
            issues.push(extract(i));
        return issues;
    }

    res.send(got.issues);
}

exports.err = function error(error) {
    res.send("Siamo spiacenti ma si è verificato un errore" + home);
    col.r("Richiesta fallita; " + error + "\n");
}
