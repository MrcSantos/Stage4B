# JIRA REST API for NodeJS

This gives access to most Jira Rest API data

## Installation

```shell
npm install jira-rest
```

## Usage

#### Initialization

```javascript
var jira = require('jira-rest');
var config = {
    "url": "http://jira.example.com",
    "authorization": {
        "username": "xyz",
        "password": "***************"
    }
};
var jiraconnection = jira.connect(config);
```

## Methods

##### All Projects

```javascript
jiraconnection.fetchProjects(function(error, data) {
    //statement
});
```

##### Single Project

```javascript
jiraconnection.fetchProject({
    projectid: "xxxx"
}, function(error, data, config) {
    // statement
});
```

##### All release of a project

```javascript
jiraconnection.fetchProjectVersions({
    projectid: "xxxx",
    rapidviewid: "yyyy"
}, function(error, data, config) {
    //statement
});
```

##### Single release of a project

```javascript
jiraconnection.fetchProjectVersion({
    projectid: "xxxx",
    rapidviewid: "yyyy",
    versionid: "zzzz"
}, function(error, data, config) {
    //statement
});
```

##### Single release defectscreated

```javascript
jiraconnection.fetchProjectVersionDefectsCreated({
    projectid: "xxxx",
    startdate: "YYYY-MM-DD hh:mm",
    enddate: "YYYY-MM-DD hh:mm"
}, function(error, data, config) {
    //statement
});
```

##### Single release defectscreated

```javascript
jiraconnection.fetchProjectVersionDefectsResolved({
    projectid: "xxxx",
    versionid: "zzzz",
    startdate: "YYYY-MM-DD hh:mm",
    enddate: "YYYY-MM-DD hh:mm"
}, function(error, data, config) {
    //statement
});
```

##### All sprints of a Project

```javascript
jiraconnection.fetchProjectSprints({
    projectid: "xxxx"
}, function(error, data, config) {
    //statement
});
```

##### Single sprint of a Project

```javascript
jiraconnection.fetchProjectSprint({
    rapidviewid: "yyyy",
    sprintid: "zzzz"
}, function(error, data, config) {
    //statement
});
```

##### Defects created for a sprint of a Project

```javascript
jiraconnection.fetchProjectSprintDefectsCreated({
    projectid: "xxxx",
    startdate: "YYYY-MM-DD hh:mm",
    enddate: "YYYY-MM-DD hh:mm"
}, function(error, data, config) {
    //statement
});
```

##### Defects resolved for a sprint of a Project

```javascript
jiraconnection.fetchProjectSprintDefectsResolved({
    projectid: "xxxx",
    startdate: "YYYY-MM-DD hh:mm",
    enddate: "YYYY-MM-DD hh:mm"
}, function(error, data, config) {
    //statement
});
```

##### Defects unresolved for a sprint of a Project

```javascript
jiraconnection.fetchProjectSprintDefectsUnresolved({
    projectid: "xxxx",
    startdate: "YYYY-MM-DD hh:mm",
    enddate: "YYYY-MM-DD hh:mm"
}, function(error, data, config) {
    //statement
});
```

##### Defects by Severity of a Project

```javascript
jiraconnection.fetchProjectDefectsBySeverity({
    projectid: "xxxx"
}, function(error, data, config) {
    //statement
});
```

##### Defects by Environment of a Project

```javascript
jiraconnection.fetchProjectDefectsByEnvironment({
    projectid: "xxxx"
}, function(error, data, config) {
    //statement
});
```

##### Single Project's Defects Age Less than 15 days

```javascript
jiraconnection.fetchProjectDefectsByAgeLess15d({
    projectid: "xxxx"
}, function(error, data, config) {
    //statement
});
```

##### Single Project's Defects Age More than 15 days & Less than 30 days

```javascript
jiraconnection.fetchProjectDefectsByAgeLess30d({
    projectid: "xxxx"
}, function(error, data, config) {
    //statement
});
```

##### Single Project's Defects Age More than 30 days & Less than 60 days

```javascript
jiraconnection.fetchProjectDefectsByAgeLess60d({
    projectid: "xxxx"
}, function(error, data, config) {
    //statement
});
```

##### Single Project's Defects Age More than 60 days & Less than 90 days

```javascript
jiraconnection.fetchProjectDefectsByAgeLess90d({
    projectid: "xxxx"
}, function(error, data, config) {
    //statement
});
```

##### Single Project's Defects Age More than 90 days

```javascript
jiraconnection.fetchProjectDefectsByAgeMore90d({
    projectid: "xxxx"
}, function(error, data, config) {
    //statement
});
```

##### Defects Resoulution Time Report Less than 15 days

```javascript
jiraconnection.fetchProjectDefectsResolutionLess15d({
    projectid: "xxxx"
}, function(error, data, config) {
    //statement
});
```

##### Defects Resoulution Time Report More than 15 days & Less than 30 days

```javascript
jiraconnection.fetchProjectDefectsResolutionLess30d({
    projectid: "xxxx"
}, function(error, data, config) {
    //statement
});
```

##### Defects Resoulution Time Report More than 30 days & Less than 60 days

```javascript
jiraconnection.fetchProjectDefectsResolutionLess60d({
    projectid: "xxxx"
}, function(error, data, config) {
    //statement
});
```

##### Defects Resoulution Time Report More than 60 days & Less than 90 days

```javascript
jiraconnection.fetchProjectDefectsResolutionLess90d({
    projectid: "xxxx"
}, function(error, data, config) {
    //statement
});
```

##### Defects Resoulution Time Report More than 90 days

```javascript
jiraconnection.fetchProjectDefectsResolutionMore90d({
    projectid: "xxxx"
}, function(error, data, config) {
    //statement
});
```

## Features

* supports read only operation
* supports only basic authentication
* supports non-secured api url (http)
