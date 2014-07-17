/**
 * Created by laijunlong on 14-7-16.
 */
var settings = require('../settings');
var DB = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;

module.exports = new DB(settings.db,new Server(settings.host,Connection.DEFAULT_PORT));