# loopback-apitest-example

[![LoopBack](<https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png>)](http://loopback.io/)

## Before you begin

You’ll need the following:

- [Node.js](https://nodejs.org/en/download/) 8.9 or higher
- LoopBack 4 CLI

  ```
  npm i -g @loopback/cli
  ```

- [Cloud Foundry CLI](https://docs.cloudfoundry.org/cf-cli/install-go-cli.html)

## Get your LoopBack4 Application Ready

After you first scaffolded a LoopBack4 application, you’ll get a default endpoint `/ping`. For simplicity sake, we’ll use this.

### Step 1: Scaffold LoopBack 4 app

Run `lb4 app` command.

```sh
$ lb4 app
? Project name: loopback-apitest-example
? Project description: Example to show how to use LoopBack and APIConnect Test and Monitor together
? Project root directory: loopback-apitest-example
? Application class name: LoopbackApitestExampleApplication
? Select features to enable in the project Enable tslint, Enable prettier, Enable mocha, Enable loopback
Build, Enable vscode, Enable repositories, Enable services
...
Application loopback-apitest-example was created in loopback-apitest-example.
Next steps:
$ cd loopback-apitest-example
$ npm start
```

### Step 2: Modify `src/index.ts`

We’ll be using the cfenv to set the host and port for the REST server within the LoopBack 4 application.

First, add cfenv to the dependencies.

```
npm i --save cfenv
```

Then, go to `src/index.ts`.

```ts
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
```

### Step 3: Add `.cfignore` file (optional)

At project root, create a file called .cfignore with the following content:

```
node_modules/
.vscode/
.git
```

This step is optional, however, dependencies will be installed during deploymen tand thusnode_modules will be generated. It makes the upload of node_modules reductant and time consuming.

### Step 4: Update `package.json`

Before we deploy to the cloud, go to `package.json` at the root of the project directory, and remove the following line:

```
"prestart": "npm run build",
```

_Note_: If you make any changes afterwards, remember to run npm run build !

## Deploy to IBM Cloud

### Step 1: Log into IBM Cloud using `cf login` command

Use `cf login` command to login.

_Side note_: Since I’m using a federated user id (IBMid), I use `cf login --sso` to login.

After you’ve been successfully logged in, you’ll see the CF API endpoint.

```
API endpoint: https://api.ng.bluemix.net (API version: 2.106.0)
```

### Step 2: Deploy to IBM Cloud using cf push command

Run this command:

```
cf push <<your-app-name>>
```

The app name in the command is the Cloud Foundry application that will show up in the IBM Cloud dashboard.

## See it in Action

- Go to the IBM Cloud dashboard, https://console.bluemix.net/dashboard/apps
- Under “Cloud Foundry Applications”, you should see your application name. Click on it.
- Click “Visit App URL” to get the URL of your application.

Append /ping in the url, and that’s your ping endpoint! You should see something like below:

```
{
  "greeting": "Hello from LoopBack",
  "date": "2018-11-19T22:28:08.010Z",
  "url": "/ping",
  ...
}
```

## Troubleshooting

If you have problems deploying, you can view the log from “Logs” in your app’s page.
