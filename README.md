<p align="center">
    <a href="https://www.vespaiach.com/">
        <img src="https://raw.githubusercontent.com/vespaiach/ledger/main/logo.svg" style="width: 56px; height: 56px" title="Ledger"/>
    </a>
</p>

<p align="center">
  <b>Ledger</b> is a web application that provides intuitive tools for managing personal balance transactions
  <br>
  It is built with React/Redux and awesome GUI framework: <a href="https://github.com/mui-org/material-ui" title="Material UI">Material UI</a>
</p>

<br>

# Motivation

Are you fed up with tracking your expending balance transactions in excel files? If so, let's give this web application a try

# Live Playground

The demo version at: https://www.vespaiach.com/ . Please use the account below to login:

-   email: test@test.com
-   password: 12345678

# Development

Development environment requirements :

-   Node.js >= 12.0.0
-   PostgreSQL
-   TypeScript
-   Docker
-   Docker compose

This repository contains both backend project and frontend project. So I use lerna tool to make sure they use their own dependency package folder.

## Download and bootstrap project:

Download project:

```
git clone https://github.com/vespaiach/ledger
```

Install Lerna:

```
cd ./ledger
npm install
```

Bootstrap all packages:

```
npm run lerna bootstrap

```

## Start PostgresQL and migration database

Run PostgresQL:

```
cd ./ledger
docker-compose up -d
```

Run database migration and seeds:

```
cd ./package/server
node ace migration:run
node ace db:seed
```

_Note_: Before running database migration, please create a .env file and config all necessary environment variables (refer to .env.example for more details).

## Start backend server:

Run backend server:

```
cd ./packages/server
cp ./.env.example .env
npm install
node ace serve --watch
```

## Start frontend server:

Run frontend server:

```
cd ./packages/web
cp ./.env.template .env
npm install
npm start
```

# Deployment

You are free to build and deploy a version of this web application to use on your own:

-   Build docker image (Dockerfile in root folder)
-   Deploy docker image
