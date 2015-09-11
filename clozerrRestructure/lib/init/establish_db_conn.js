var Sequelize = require('sequelize');
var seqCfg = require('config').dbConfig;
var sequelizeNew = require('config').newDbConfig;
sequelize = new Sequelize(seqCfg.database, seqCfg.username, seqCfg.password, sequelizeNew);
