'use strict';
var log4jConfig = require('config').log4jConfig;
var log4js = require('log4js');
var layout = require('./logger_layout.js').layout;

var modifiedServerAppenderConfig = JSON.parse(JSON.stringify(log4jConfig.serverLogAppander));
modifiedServerAppenderConfig.layout = layout;

var modifiedDbLogAppender = JSON.parse(JSON.stringify(log4jConfig.dbLogAppender));
modifiedDbLogAppender.layout = layout;

var modifiedAuditLogAppender = JSON.parse(JSON.stringify(log4jConfig.auditLogAppender));
modifiedAuditLogAppender.layout = layout;

log4js.clearAppenders();        // To remove console, which is added by default
log4js.configure({
    appenders: [
        modifiedServerAppenderConfig,
        modifiedDbLogAppender,
        modifiedAuditLogAppender
    ],
    levels: log4jConfig.levels
});

var logger = log4js.getLogger('app');
var dbLogger = log4js.getLogger('database');
var auditLogger = log4js.getLogger('audit');

console.logger = logger;
console.dbLogger = dbLogger;
console.auditLogger = auditLogger;

console.oldLogger = console.log;

if (log4jConfig.appendConsoleLog === true) {
    console.log = function () {
        console.logger.debug.apply(console.logger, arguments);
    };
} else {
    console.log = function () {
        console.oldLogger.apply(console.oldLogger, arguments);
    };
}

logger.info('Server log initialized.');
dbLogger.info('Db log initialized.');
auditLogger.info('Audit log initialized.');
