import {LoopbackApitestExampleApplication} from './application';
import {ApplicationConfig} from '@loopback/core';
// --------- ADD THIS SNIPPET -------------
const cfenv = require('cfenv');
const appEnv = cfenv.getAppEnv();
// ----------------------------------------
export {LoopbackApitestExampleApplication};

export async function main(options: ApplicationConfig = {}) {
  // --------- ADD THIS SNIPPET -------------
  if (!options) options = {};
  if (!options.rest) options.rest = {};
  options.rest.port = appEnv.isLocal ? options.rest.port : appEnv.port;
  options.rest.host = appEnv.isLocal ? options.rest.host : appEnv.host;
  // ----------------------------------------
  const app = new LoopbackApitestExampleApplication(options);
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  return app;
}
