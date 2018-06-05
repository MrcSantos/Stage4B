const port = require('../app').port;

const home = "<br><a = href='http://localhost:" + port + "/'>Clicca qui per tornare alla home</a>";

exports.all = function all(res, obj, comments) {
    function extract(i) {
        if(obj.issues[i].fields.description === null) obj.issues[i].fields.description = 'Nessuna descrizione';
        var issue = {
            'key': obj.issues[i].key,
            'summary': obj.issues[i].fields.summary,
            'status': obj.issues[i].fields.status.statusCategory.name,
            'description': obj.issues[i].fields.description,
            'priority': obj.issues[i].fields.priority.name,
            'assignee': [],
            'comment_author': [],
            'comment_body': [],
            'comment_date': [],
            'date': obj.issues[i].fields.creator.created
        };
        for (var x in obj.issues[i].fields.assignee) {
            issue.assignee.push(obj.issues[i].fields.assignee[x].name);
        }
        for (var x in comments) {
            issue.comment_author.push(comments[x].name);
            issue.comment_body.push(comments[x].body);
            issue.comment_date.push(comments[x].date);
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

exports.err = function error(error) {
    res.send("Siamo spiacenti ma si è verificato un errore" + home);
    col.r("Richiesta fallita; " + error + "\n");
}
