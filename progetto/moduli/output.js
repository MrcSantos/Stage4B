/*----------------------------------------------------------------------------*/ // Moduli

/*----------------------------------------------------------------------------*/ // Moduli

exports.all = function all(res, obj) {
    function extract(i) {
        var created = new Date(obj.issues[i].fields.created);

        var issue = {
            'key': obj.issues[i].key,
            'summary': obj.issues[i].fields.summary,
            'status': obj.issues[i].fields.status.name,
            'description': obj.issues[i].fields.description,
            'priority': obj.issues[i].fields.priority.name,
            'date': created.toLocaleDateString(),
            'type': obj.issues[i].fields.issuetype.name,
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
