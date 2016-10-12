var CfnLambda = require('cfn-lambda');
var AWS = require('aws-sdk');

var Request = require('./lib/sql-request');

function SqlRequestHandler(event, context) {
  var SqlRequest = CfnLambda({
    Create: Request.Create,
    Update: Request.Update,
    Delete: Request.Delete,
    SchemaPath: [__dirname, 'src', 'schema.json']
  });
  // Not sure if there's a better way to do this...
  AWS.config.region = currentRegion(context);

  return SqlRequest(event, context);
}

function currentRegion(context) {
  return context.invokedFunctionArn.match(/^arn:aws:lambda:(\w+-\w+-\d+):/)[1];
}

exports.handler = SqlRequestHandler;
