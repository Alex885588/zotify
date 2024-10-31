## Description

This project implements a simple CRUD API for managing a list of users using NestJS and PostgreSQL. The API includes features for creating, reading, updating, and deleting user records, as well as logging request times and handling errors gracefully.

## Project Overview

This User Management API provides a robust backend for managing user information. It allows users to perform CRUD operations while ensuring data validation and error handling are in place. The API is also equipped with middleware for logging the time taken for each request, and it features a global error-handling mechanism to ensure consistent and informative error responses.

## Features

After logging in, users receive a JSON Web Token (JWT). This token must be included in the headers of subsequent requests to perform CRUD operations on the API. The token ensures that only authenticated users can access and manipulate data.


## Technologies Used

NestJS: Backend framework for building scalable and efficient server-side applications.
JWT: JSON Web Tokens for secure authentication and authorization.

## Installation

```bash
$ npm install
```

Copy .env.example to .env file(create new)


## Environment Configuration

DB_HOSTNAME          # The hostname of the PostgreSQL database server
DB_PORT              # The port number for connecting to the PostgreSQL database
DB_USERNAME          # The username used to authenticate with the database
DB_PASSWORD          # The password for the database user
DB_NAME              # The name of the PostgreSQL database to connect to
JWT_MY_SECRET_KEY    # The secret key used for signing JWT tokens


## Running the app

After running the seed command, you can find the user credentials in src/utils/user.seed.template.json. Use the provided email and password to log in. Upon successful login, you will receive a JWT token, which can be used to register additional users and perform CRUD operations.

```bash
# Seed the database with one user credential
$ npm run seed-ts

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod

# Run tests
$ npm test
```

## Stay in touch

- Author - [Alexander Aleksanyan]
