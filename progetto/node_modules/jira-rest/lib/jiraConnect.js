(function(){
    'use strict';
    var request = require('request');

    var jiraConnect = function (options) {
        this.config = options.config;
    };

    /**
     * @description All Projects
     */
    jiraConnect.prototype.fetchProjects = function fetchProjects (callback) {
        console.log("Connection Started for fetching all projects");
        var cb = callback || null,
            endpoint = this.config.urilist.projects,
            options = {
                url: endpoint,
                json: true,
                headers: {
                    'Authorization' : this.config.authorization
                }
            };
        request(options, function(error, response, body) {
            if (typeof cb === 'function') {
                if (!error && response.statusCode === 200) {
                    cb(null, body);
                } else {
                    cb({error: error, module:"jira:fetchProjects"}, null);
                }
            }
            return;
        });
    };

    /**
     * @description Single Project
     */
    jiraConnect.prototype.fetchProject = function fetchProject (config, callback) {
        console.log("Connection Started for fetching the project "+config.projectid);
        var cb = callback || null,
            endpoint = this.config.urilist.project.replace(/{projectid}/g, config.projectid),
            options = {
                url: endpoint,
                json: true,
                headers: {
                    'Authorization' : this.config.authorization
                }
            };
        request(options, function(error, response, body) {
            if (typeof cb === 'function') {
                if (!error && response.statusCode === 200) {
                    cb(null, body, config);
                } else {
                    cb({error: error, module:"jira:fetchProject"}, null, config);
                }
            }
            return;
        });
    };

    /**
     * @description All Project Versions
     */
    jiraConnect.prototype.fetchProjectVersions = function fetchProjectVersions (config, callback) {
        console.log("Connection Started for fetching project "+config.projectid+"'s all versions");
        var cb = callback || null,
            endpoint = this.config.urilist.versions.replace(/{projectid}/g, config.projectid),
            options = {
                url: endpoint,
                json: true,
                headers: {
                    'Authorization' : this.config.authorization
                }
            };
        request(options, function(error, response, body) {
            if (typeof cb === 'function') {
                if (!error && response.statusCode === 200) {
                    cb(null, body, config);
                } else {
                    cb({error: error, module:"jira:fetchProjectVersions"}, null, config);
                }
            }
            return;
        });
    };

    /**
     * @description Single Project Version
     */
    jiraConnect.prototype.fetchProjectVersion = function fetchProjectVersion (config, callback) {
        console.log("Connection Started for fetching rapidview "+config.rapidviewid+"'s versionid "+ config.versionid);
        var cb = callback || null,
            endpoint = this.config.urilist.version.replace(/{rapidviewid}/g, config.rapidviewid)
                .replace(/{versionid}/g, config.versionid),
            options = {
                url: endpoint,
                json: true,
                headers: {
                    'Authorization' : this.config.authorization
                }
            };
        request(options, function(error, response, body) {
            if (typeof cb === 'function') {
                if (!error && response.statusCode === 200) {
                    cb(null, body, config);
                } else {
                    cb({error: error, module:"jira:fetchProjectVersion"}, null, config);
                }
            }
            return;
        });
    };
    /**
     * @description : Version Defects
     * - defectscreated
     * - defectsresolved
     */
    jiraConnect.prototype.fetchProjectVersionDefectsCreated = function fetchProjectVersionDefectsCreated (config, callback) {
        console.log("Connection Started for fetching version defect created :" + config.projectid);
        var cb = callback || null,
            endpoint = this.config.urilist.versiondefects.defectscreated.replace(/{projectid}/g, config.projectid)
                .replace(/{startdate}/g, config.startdate)
                .replace(/{enddate}/g, config.enddate),
            options = {
                url: endpoint,
                json: true,
                headers: {
                    'Authorization' : this.config.authorization
                }
            };
        request(options, function(error, response, body) {
            if (typeof cb === 'function') {
                if (!error && response.statusCode === 200) {
                    cb(null, body, config);
                } else {
                    cb({error: error, module:"jira:fetchProjectVersionDefectsCreated"}, null, config);
                }
            }
        });
    };

    jiraConnect.prototype.fetchProjectVersionDefectsResolved = function fetchProjectVersionDefectsResolved (config, callback) {
        console.log("Connection Started for fetching version defect resolved :" + config.projectid);
        var cb = callback || null,
            endpoint = this.config.urilist.versiondefects.defectsresolved.replace(/{projectid}/g, config.projectid)
                .replace(/{versionid}/g, config.versionid)
                .replace(/{startdate}/g, config.startdate)
                .replace(/{enddate}/g, config.enddate),
            options = {
                url: endpoint,
                json: true,
                headers: {
                    'Authorization' : this.config.authorization
                }
            };
        request(options, function(error, response, body) {
            if (typeof cb === 'function') {
                if (!error && response.statusCode === 200) {
                    cb(null, body, config);
                } else {
                    cb({error: error, module:"jira:fetchProjectVersionDefectsResolved"}, null, config);
                }
            }
        });
    };


    /**
     * @description All Project Sprints
     */
    jiraConnect.prototype.fetchProjectSprints = function fetchProjectSprints (config, callback) {
        console.log("Connection Started for fetching project "+config.projectid+"'s all sprints");
        var cb = callback || null,
            endpoint = this.config.urilist.sprints.replace(/{projectid}/g, config.projectid),
            options = {
                url: endpoint,
                json: true,
                headers: {
                    'Authorization' : this.config.authorization
                }
            };
        request(options, function(error, response, body) {
            if (typeof cb === 'function') {
                if (!error && response.statusCode === 200) {
                    cb(null, body, config);
                } else {
                    cb({error: error, module:"jira:fetchProjectSprints"}, null, config);
                }
            }
        });
    };

    /**
     * @description Single Project Sprint
     */
    jiraConnect.prototype.fetchProjectSprint = function fetchProjectSprint (config, callback) {
        console.log("Connection Started for fetching rapidview "+config.rapidviewid+"'s sprintid "+ config.sprintid);
        var cb = callback || null,
            endpoint = this.config.urilist.sprint.replace(/{rapidviewid}/g, config.rapidviewid)
                .replace(/{sprintid}/g, config.sprintid),
            options = {
                url: endpoint,
                json: true,
                headers: {
                    'Authorization' : this.config.authorization
                }
            };
        request(options, function(error, response, body) {
            if (typeof cb === 'function') {
                if (!error && response.statusCode === 200) {
                    cb(null, body, config);
                } else {
                    cb({error: error, module:"jira:fetchProjectSprint"}, null, config);
                }
            }
        });
    };
    /**
     * @description : Sprint Defects
     * - defectscreated
     * - defectsresolved
     * - defectsunresolved
     */
    jiraConnect.prototype.fetchProjectSprintDefectsCreated = function fetchProjectSprintDefectsCreated (config, callback) {
        console.log("Connection Started for fetching sprint defect created :" + config.projectid);
        var cb = callback || null,
            endpoint = this.config.urilist.sprintdefects.defectscreated.replace(/{projectid}/g, config.projectid)
                .replace(/{startdate}/g, config.startdate)
                .replace(/{enddate}/g, config.enddate),
            options = {
                url: endpoint,
                json: true,
                headers: {
                    'Authorization' : this.config.authorization
                }
            };
        request(options, function(error, response, body) {
            if (typeof cb === 'function') {
                if (!error && response.statusCode === 200) {
                    cb(null, body, config);
                } else {
                    cb({error: error, module:"jira:fetchProjectSprintDefectsCreated"}, null, config);
                }
            }
        });
    };

    jiraConnect.prototype.fetchProjectSprintDefectsResolved = function fetchProjectSprintDefectsResolved (config, callback) {
        console.log("Connection Started for fetching sprint defect resolved :" + config.projectid);
        var cb = callback || null,
            endpoint = this.config.urilist.sprintdefects.defectsresolved.replace(/{projectid}/g, config.projectid)
                .replace(/{startdate}/g, config.startdate)
                .replace(/{enddate}/g, config.enddate),
            options = {
                url: endpoint,
                json: true,
                headers: {
                    'Authorization' : this.config.authorization
                }
            };
        request(options, function(error, response, body) {
            if (typeof cb === 'function') {
                if (!error && response.statusCode === 200) {
                    cb(null, body, config);
                } else {
                    cb({error: error, module:"jira:fetchProjectSprintDefectsResolved"}, null, config);
                }
            }
        });
    };

    jiraConnect.prototype.fetchProjectSprintDefectsUnresolved = function fetchProjectSprintDefectsUnresolved (config, callback) {
        console.log("Connection Started for fetching sprint defect unresolved :" + config.projectid);
        var cb = callback || null,
            endpoint = this.config.urilist.sprintdefects.defectsunresolved.replace(/{projectid}/g, config.projectid)
                .replace(/{startdate}/g, config.startdate)
                .replace(/{enddate}/g, config.enddate),
            options = {
                url: endpoint,
                json: true,
                headers: {
                    'Authorization' : this.config.authorization
                }
            };
        request(options, function(error, response, body) {
            if (typeof cb === 'function') {
                if (!error && response.statusCode === 200) {
                    cb(null, body, config);
                } else {
                    cb({error: error, module:"jira:fetchProjectSprintDefectsResolved"}, null, config);
                }
            }
        });
    };

    /**
     * @description Single Project's Defects By Severity
     */
    jiraConnect.prototype.fetchProjectDefectsBySeverity = function fetchProjectDefectsBySeverity (config, callback) {
        console.log("Connection Started for fetching defects by severity : "+config.projectid);
        var cb = callback || null,
            endpoint = this.config.urilist.defects.byseverity.replace(/{projectid}/g, config.projectid),
            options = {
                url: endpoint,
                json: true,
                headers: {
                    'Authorization' : this.config.authorization
                }
            };
        request(options, function(error, response, body) {
            if (typeof cb === 'function') {
                if (!error && response.statusCode === 200) {
                    cb(null, body, config);
                } else {
                    cb({error: error, module:"jira:fetchProjectDefectsBySeverity"}, null, config);
                }
            }
        });
    };

    /**
     * @description Single Project's Defects By Environment
     */
    jiraConnect.prototype.fetchProjectDefectsByEnvironment = function fetchProjectDefectsByEnvironment (config, callback) {
        console.log("Connection Started for fetching defects by environment : "+config.projectid);
        var cb = callback || null,
            endpoint = this.config.urilist.defects.byenvironment.replace(/{projectid}/g, config.projectid),
            options = {
                url: endpoint,
                json: true,
                headers: {
                    'Authorization' : this.config.authorization
                }
            };
        request(options, function(error, response, body) {
            if (typeof cb === 'function') {
                if (!error && response.statusCode === 200) {
                    cb(null, body, config);
                } else {
                    cb({error: error, module:"jira:fetchProjectDefectsByEnvironment"}, null, config);
                }
            }
        });
    };

    /**
     * @description Single Project's Defects Age
     * - less15d : Less than 15 days
     * - less30d : More than 15 days & Less than 30 days
     * - less60d : More than 30 days & Less than 60 days
     * - less90d : More than 60 days & Less than 90 days
     * - more90d : More than 90 days
     */
    jiraConnect.prototype.fetchProjectDefectsByAgeLess15d = function fetchProjectDefectsByAgeLess15d (config, callback) {
        console.log("Connection Started for fetching defects for age less15d : "+config.projectid);
        var cb = callback || null,
            endpoint = this.config.urilist.defects.ageofdefect.less15d.replace(/{projectid}/g, config.projectid),
            options = {
                url: endpoint,
                json: true,
                headers: {
                    'Authorization' : this.config.authorization
                }
            };
        request(options, function(error, response, body) {
            if (typeof cb === 'function') {
                if (!error && response.statusCode === 200) {
                    cb(null, body, config);
                } else {
                    cb({error: error, module:"jira:fetchProjectDefectsByAgeLess15d"}, null, config);
                }
            }
        });
    };

    jiraConnect.prototype.fetchProjectDefectsByAgeLess30d = function fetchProjectDefectsByAgeLess30d (config, callback) {
        console.log("Connection Started for fetching defects for age less30d : "+config.projectid);
        var cb = callback || null,
            endpoint = this.config.urilist.defects.ageofdefect.less30d.replace(/{projectid}/g, config.projectid),
            options = {
                url: endpoint,
                json: true,
                headers: {
                    'Authorization' : this.config.authorization
                }
            };
        request(options, function(error, response, body) {
            if (typeof cb === 'function') {
                if (!error && response.statusCode === 200) {
                    cb(null, body, config);
                } else {
                    cb({error: error, module:"jira:fetchProjectDefectsByAgeLess30d"}, null, config);
                }
            }
        });
    };

    jiraConnect.prototype.fetchProjectDefectsByAgeLess60d = function fetchProjectDefectsByAgeLess60d (config, callback) {
        console.log("Connection Started for fetching defects for age less60d : "+config.projectid);
        var cb = callback || null,
            endpoint = this.config.urilist.defects.ageofdefect.less60d.replace(/{projectid}/g, config.projectid),
            options = {
                url: endpoint,
                json: true,
                headers: {
                    'Authorization' : this.config.authorization
                }
            };
        request(options, function(error, response, body) {
            if (typeof cb === 'function') {
                if (!error && response.statusCode === 200) {
                    cb(null, body, config);
                } else {
                    cb({error: error, module:"jira:fetchProjectDefectsByAgeLess60d"}, null, config);
                }
            }
        });
    };

    jiraConnect.prototype.fetchProjectDefectsByAgeLess90d = function fetchProjectDefectsByAgeLess90d (config, callback) {
        console.log("Connection Started for fetching defects for age less90d : "+config.projectid);
        var cb = callback || null,
            endpoint = this.config.urilist.defects.ageofdefect.less90d.replace(/{projectid}/g, config.projectid),
            options = {
                url: endpoint,
                json: true,
                headers: {
                    'Authorization' : this.config.authorization
                }
            };
        request(options, function(error, response, body) {
            if (typeof cb === 'function') {
                if (!error && response.statusCode === 200) {
                    cb(null, body, config);
                } else {
                    cb({error: error, module:"jira:fetchProjectDefectsByAgeLess90d"}, null, config);
                }
            }
        });
    };

    jiraConnect.prototype.fetchProjectDefectsByAgeMore90d = function fetchProjectDefectsByAgeMore90d (config, callback) {
        console.log("Connection Started for fetching defects for age more90d :"+config.projectid);
        var cb = callback || null,
            endpoint = this.config.urilist.defects.ageofdefect.more90d.replace(/{projectid}/g, config.projectid),
            options = {
                url: endpoint,
                json: true,
                headers: {
                    'Authorization' : this.config.authorization
                }
            };
        request(options, function(error, response, body) {
            if (typeof cb === 'function') {
                if (!error && response.statusCode === 200) {
                    cb(null, body, config);
                } else {
                    cb({error: error, module:"jira:fetchProjectDefectsByAgeMore90d"}, null, config);
                }
            }
        });
    };

    /**
     * @description : Defects Resoulution Time Report
     * - less15d : Less than 15 days
     * - less30d : More than 15 days & Less than 30 days
     * - less60d : More than 30 days & Less than 60 days
     * - less90d : More than 60 days & Less than 90 days
     * - more90d : More than 90 days
     */

    jiraConnect.prototype.fetchProjectDefectsResolutionLess15d = function fetchProjectDefectsResolutionLess15d (config, callback) {
        console.log("Connection Started for fetching defects resolution less15d : "+config.projectid);
        var cb = callback || null,
            endpoint = this.config.urilist.defects.resolutiontimereport.less15d.replace(/{projectid}/g, config.projectid),
            options = {
                url: endpoint,
                json: true,
                headers: {
                    'Authorization' : this.config.authorization
                }
            };
        request(options, function(error, response, body) {
            if (typeof cb === 'function') {
                if (!error && response.statusCode === 200) {
                    cb(null, body, config);
                } else {
                    cb({error: error, module:"jira:fetchProjectDefectsResolutionLess15d"}, null, config);
                }
            }
        });
    };

    jiraConnect.prototype.fetchProjectDefectsResolutionLess30d = function fetchProjectDefectsResolutionLess30d (config, callback) {
        console.log("Connection Started for fetching defects resolution less30d : "+config.projectid);
        var cb = callback || null,
            endpoint = this.config.urilist.defects.resolutiontimereport.less30d.replace(/{projectid}/g, config.projectid),
            options = {
                url: endpoint,
                json: true,
                headers: {
                    'Authorization' : this.config.authorization
                }
            };
        request(options, function(error, response, body) {
            if (typeof cb === 'function') {
                if (!error && response.statusCode === 200) {
                    cb(null, body, config);
                } else {
                    cb({error: error, module:"jira:fetchProjectDefectsResolutionLess30d"}, null, config);
                }
            }
        });
    };

    jiraConnect.prototype.fetchProjectDefectsResolutionLess60d = function fetchProjectDefectsResolutionLess60d (config, callback) {
        console.log("Connection Started for fetching defects resolution less60d : "+config.projectid);
        var cb = callback || null,
            endpoint = this.config.urilist.defects.resolutiontimereport.less60d.replace(/{projectid}/g, config.projectid),
            options = {
                url: endpoint,
                json: true,
                headers: {
                    'Authorization' : this.config.authorization
                }
            };
        request(options, function(error, response, body) {
            if (typeof cb === 'function') {
                if (!error && response.statusCode === 200) {
                    cb(null, body, config);
                } else {
                    cb({error: error, module:"jira:fetchProjectDefectsResolutionLess60d"}, null, config);
                }
            }
        });
    };

    jiraConnect.prototype.fetchProjectDefectsResolutionLess90d = function fetchProjectDefectsResolutionLess90d (config, callback) {
        console.log("Connection Started for fetching defects resolution less90d : "+config.projectid);
        var cb = callback || null,
            endpoint = this.config.urilist.defects.resolutiontimereport.less90d.replace(/{projectid}/g, config.projectid),
            options = {
                url: endpoint,
                json: true,
                headers: {
                    'Authorization' : this.config.authorization
                }
            };
        request(options, function(error, response, body) {
            if (typeof cb === 'function') {
                if (!error && response.statusCode === 200) {
                    cb(null, body, config);
                } else {
                    cb({error: error, module:"jira:fetchProjectDefectsResolutionLess90d"}, null, config);
                }
            }
        });
    };

    jiraConnect.prototype.fetchProjectDefectsResolutionMore90d = function fetchProjectDefectsResolutionMore90d (config, callback) {
        console.log("Connection Started for fetching defects resolution more90d :"+config.projectid);
        var cb = callback || null,
            endpoint = this.config.urilist.defects.resolutiontimereport.more90d.replace(/{projectid}/g, config.projectid),
            options = {
                url: endpoint,
                json: true,
                headers: {
                    'Authorization' : this.config.authorization
                }
            };
        request(options, function(error, response, body) {
            if (typeof cb === 'function') {
                if (!error && response.statusCode === 200) {
                    cb(null, body, config);
                } else {
                    cb({error: error, module:"jira:fetchProjectDefectsResolutionMore90d"}, null, config);
                }
            }
        });
    };

    module.exports = jiraConnect;
}());
