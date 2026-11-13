# Luchadores Server Browser

The server to see all the other servers. Who watches the watchers?

This server creates a client-accessible list of all running Luchadores servers that report to it.

## Setup
This is a Node v22 project (see `.nvmrc`). If you use Node Version Manager (NVM):

```
nvm install
nvm use
```

Then install the packages. It should automatically trigger a build afterward:

```
npm install
```

We use TypeScript to build everything:

```
npm run build           # Compiles the project once.
npm run clean           # Clears the dist folder.
npm run rebuild         # Cleans and builds the project once.
```

Start the server and watch your browser:

```
npm run start           # Builds and runs the server.
```

It listens on a fixed port (default is `3500`); browse to `http://localhost:3500/` from a client.