(function () {
    'use strict';
    var Classes = Object.create(null);

    /**
     * The type constants.
     * @public
     */
    Object.defineProperty(exports, 'Types', {
        get: loadClass.bind(null, 'Types')
    });

    /**
     * Create a new Connection.
     * @param {object} config
     * @public
     */
    exports.connect = function connect (config) {
        var JiraConnect = loadClass('jiraConnect');
        var JiraConfig = loadClass('jiraConfig');
        return new JiraConnect({config: new JiraConfig(config)});
    };

    /**
     * Load the given class.
     * @private
     */
    function loadClass (className) {
        var Class = Classes[className];

        if (Class !== undefined) {
            return Class;
        }

        // This uses a switch for static require analysis
        switch (className) {
            case 'jiraConnect':
                Class = require('./lib/jiraConnect');
                break;
            case 'jiraConfig':
                Class = require('./lib/jiraConfig');
                break;
            default:
                throw new Error('Cannot find class \'' + className + '\'');
        }

        // Store to prevent invoking require()
        Classes[className] = Class;

        return Class;
    }
}());
