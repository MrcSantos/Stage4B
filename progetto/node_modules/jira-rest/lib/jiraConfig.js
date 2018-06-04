(function(module){
    'use strict';
    var btoa = require('btoa');

    var jiraConfig = function (options) {
        if (typeof options !== 'object') {
            throw new TypeError('Config should contain "url" and "authorization" key \nExample:-  \n{\n\t"url": "http://www.jira.com",\n\t"authorization": "Basic abcdefghijklmnopqrstuvwxyz"\n}');
        }
        if ('url' in options && 'authorization' in options) {
            this.resturi = options.url;
            if (typeof options.authorization === 'string') {
                this.authorization = options.authorization;
            } else if (typeof options.authorization === 'object') {
                this.authorization = 'Basic ' + btoa( options.authorization.username + ':' + options.authorization.password);
            }
            this.ssl = this.resturi.match(/^https/) !== null ? true : false;
            var path = "/jira/rest";
            this.urilist = jiraConfig.getUrls(this.resturi, path);
        } else {
            throw new TypeError('Config should contain "url" and "authorization" key \nExample:-  \n{\n\t"url": "http://www.jira.com",\n\t"authorization": "Basic abcdefghijklmnopqrstuvwxyz"\n}');
        }
    };

    /**
     * Create a new Connection instance.
     * @param {string} uri
     * @param {string} path
     * @public
     */
    jiraConfig.getUrls = function getUrls (uri, path) {
        var defectbasepath = uri + path + '/api/2/search?maxResults=1000&fields=id,key,customfield_10042,customfield_10080,customfield_10061,created,resolutiondate&jql=';
        var urilist = {
            projects : uri + path + '/api/2/project',
            project  : uri + path + '/api/2/project/{projectid}',
            versions : uri + path + '/api/2/project/{projectid}/versions',
            version  : uri + path + '/greenhopper/1.0/rapid/charts/versionreport?rapidViewId={rapidviewid}&versionId={versionid}',
            versiondefects: {
                defectscreated: defectbasepath + 'project={projectid} and issuetype in (Defect, Bug) and createddate > "{startdate}" and createddate < "{enddate}" ',
                defectsresolved: defectbasepath + 'fixVersion={versionid} AND project={projectid} and issuetype in (Defect, Bug) AND Status IN ("Closed","Accepted","Resolved")'
            },
            sprints  : uri + path + '/greenhopper/1.0/integration/teamcalendars/sprint/list?jql=project={projectid}',
            sprint   : uri + path + '/greenhopper/1.0/rapid/charts/sprintreport?rapidViewId={rapidviewid}&sprintId={sprintid}',
            sprintdefects: {
                defectscreated: defectbasepath + 'project={projectid} and type in (Bug, Defect) and createdDate > "{startdate}" and createdDate < "{enddate}"',
                defectsresolved: defectbasepath + 'project={projectid} and type in (Bug, Defect) and resolutiondate > "{startdate}" and resolutiondate < "{enddate}" ORDER BY cf[10080] ASC',
                defectsunresolved: defectbasepath + 'project={projectid} and type in (Bug, Defect) and createddate < "{startdate}" and (resolutiondate > "{enddate}" or resolution in (unresolved)) ORDER BY cf[10080] ASC'
            },
            defects  : {
                byseverity: defectbasepath +'project = {projectid} and type in (Bug, Defect) and resolution in (Unresolved) ORDER BY cf[10080] ASC',
                byenvironment: defectbasepath + 'project = {projectid} and type in (Bug, Defect) and resolution in (Unresolved) ORDER BY cf[10061]',
                ageofdefect: {
                    less15d: defectbasepath + 'project = {projectid} AND type in (Bug, Defect) AND resolution in (Unresolved) and created > startOfDay(-15d) ORDER BY cf[10080] ASC',
                    less30d: defectbasepath + 'project = {projectid} AND type in (Bug, Defect) AND resolution in (Unresolved) and created <= startOfDay(-15d) and created >=startOfDay(-30d) ORDER BY cf[10080] ASC',
                    less60d: defectbasepath + 'project = {projectid} AND type in (Bug, Defect) AND resolution in (Unresolved) and created <= startOfDay(-31d) and created >=startOfDay(-60d) ORDER BY cf[10080] ASC',
                    less90d: defectbasepath + 'project = {projectid} AND type in (Bug, Defect) AND resolution in (Unresolved) and created <= startOfDay(-61d) and created >=startOfDay(-90d) ORDER BY cf[10080] ASC',
                    more90d: defectbasepath + 'project = {projectid} AND type in (Bug, Defect) AND resolution in (Unresolved) and created <= startOfDay(-91d) ORDER BY cf[10080] ASC'
                },
                resolutiontimereport: {
                    less15d: defectbasepath + encodeURIComponent('issueFunction in dateCompare("project = ') + '{projectid}' + encodeURIComponent(' AND type in (Bug, Defect)", "resolutionDate < created + 16d")'),
                    less30d: defectbasepath + encodeURIComponent('issueFunction in dateCompare("project = ') + '{projectid}' + encodeURIComponent(' AND type in (Bug, Defect)", "resolutionDate > created + 15d") and issueFunction in dateCompare("project = ') + '{projectid}' + encodeURIComponent(' AND type in (Bug, Defect)", "resolutionDate < created + 31d")'),
                    less60d: defectbasepath + encodeURIComponent('issueFunction in dateCompare("project = ') + '{projectid}' + encodeURIComponent(' AND type in (Bug, Defect)", "resolutionDate > created + 30d") and issueFunction in dateCompare("project = ') + '{projectid}' + encodeURIComponent(' AND type in (Bug, Defect)", "resolutionDate < created + 61d")'),
                    less90d: defectbasepath + encodeURIComponent('issueFunction in dateCompare("project = ') + '{projectid}' + encodeURIComponent(' AND type in (Bug, Defect)", "resolutionDate > created + 60d") and issueFunction in dateCompare("project = ') + '{projectid}' + encodeURIComponent(' AND type in (Bug, Defect)", "resolutionDate < created + 91d")'),
                    more90d: defectbasepath + encodeURIComponent('issueFunction in dateCompare("project = ') + '{projectid}' + encodeURIComponent(' AND type in (Bug, Defect)", "resolutionDate > created + 90d")')
                }
            }
        };
        return urilist;
    };

    module.exports = jiraConfig;
})(module);
