var AWS = require('aws-sdk');
var s3 = new AWS.S3();

function executeRequest(request, params, callback) {
  switch(params.Engine) {
    case 'mysql':     executeMySQLRequest(request, params, callback); break;
    case 'postgres':  executePostgresRequest(request, params, callback); break;
    default:      callback('No engine: ' + params.Engine);
  }
}

function executeMySQLRequest(request, params, callback) {
  var mysql = require('mysql');
  console.log(request);
  var connection = mysql.createConnection({
    host: params.Host,
    user: params.User,
    password: params.Password,
    database: params.Database,
    port: params.Port || 3306,
    multipleStatements: true
  });
  connection.query( request, callback );
}

function executePostgresRequest(request, params, callback) {
  var pg = require('pg');
  var client = new pg.Client({
    user: params.User,
    password: params.Password,
    database: params.Database,
    host: params.Host,
    port: params.Port || 5432
  });
  client.on('drain', client.end.bind(client)); //disconnect client when all queries are finished
  client.connect( function(err) {
    client.query( request, callback );
  });
}

var Create = function(params, reply) {
  var callback = function(err, data) {
    reply(err, null);
  }
  if (params.Request.Bucket && params.Request.Key) {
    var p = {
      Bucket: params.Request.Bucket,
      Key: params.Request.Key
    }
    s3.getObject(p, function(err, data) {
      if (err) return reply(err);
      executeRequest(data.Body.toString(), params, callback)
    })
  } else if (params.Request.Code) {
    executeRequest(params.Request.Code, params, callback)
  }
};

var Update = function(physicalId, params, oldParams, reply) {
  Create(params, reply);
};

var Delete = function(physicalId, params, reply) {
  reply(null, physicalId);
};

exports.Create = Create;
exports.Update = Update;
exports.Delete = Delete;
