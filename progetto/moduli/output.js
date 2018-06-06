const port = require('../app').port;

const home = "<br><a = href='http://localhost:" + port + "/'>Clicca qui per tornare alla home</a>";

exports.all = function all(res, obj) {
    function extract(i) {
        var created = new Date(obj.issues[i].fields.created);

        var issue = {
            'key': obj.issues[i].key,
            'summary': obj.issues[i].fields.summary,
            'status': obj.issues[i].fields.status.statusCategory.name,
            'description': obj.issues[i].fields.description,
            'priority': obj.issues[i].fields.priority.name,
            'date': created.toLocaleDateString() + " - " + created.toLocaleTimeString(),
            'comments': []
        };
        if (obj.issues[i].fields.assignee != null) {
            issue.assignee = obj.issues[i].fields.assignee.name + " - " + obj.issues[i].fields.assignee.displayName;
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

exports.err = function error(error) {
    res.send("Siamo spiacenti ma si è verificato un errore" + home);
    col.r("Richiesta fallita; " + error + "\n");
}
