# Task Manager API

A [REST](https://en.wikipedia.org/wiki/Representational_state_transfer) based API to manage tasks or to-do lists. Create tasks and track which ones are completed. Built with [Node](https://nodejs.org/en/) and a [mongoDB](https://www.mongodb.com/) back-end. 

The API returns JSON-encoded responses and uses standard HTTP response codes, authentication, and verbs.

The current version of the API lives at `https://hagen-task-manager.herokuapp.com`.

## Quick Start

Import the [request collection](https://www.getpostman.com/collections/b2d46b28d5a1599a5786) from [Postman](https://www.postman.com/) to get started testing quickly. 

## Authentication

The Task Manger API uses bearer authentication. Auth tokens are returned in the response via user creation or login requests.

## Errors

Task Manager API uses conventional HTTP response codes to indicate the success or failure of an API request. In general: Codes in the 2xx range indicate success. Codes in the 4xx range indicate an error that failed given the information provided (e.g., a required parameter was omitted, etc.). Codes in the 5xx range indicate an error with the APIs server.

Some 4xx errors could be handled programmatically include an error code that briefly explains the error reported.

## User Requests

---

### Create a user

POST `/users`

#### Required

    name: String
    email: String
    password: String

#### Optional

    age: Number

#### Example Request

    {
        "name": "Mary",
        "age": 24,
        "email": "mary123@gmail.com",
        "password": "Blue12345!"
    }

#### Example Response
    {
        "user": {
            "age": 0,
            "_id": "60219c9f0068570017ad3c63",
            "name": "Mary",
            "email": "mary123@gmail.com",
            "createdAt": "2021-02-08T20:18:39.048Z",
            "updatedAt": "2021-02-08T20:18:39.104Z",
            "__v": 1
    },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDIxOWM5ZjAwNjg1NzAwMTdhZDNjNjMiLCJpYXQiOjE2MTI4MTU1MTl9.frb2_uzXnFRbDAx_glsF6lO2P2CIZW5yRfh-tM1VRdw"
    }

### Login

POST `/users/login`

#### Required

    email: String
    password: String

#### Example Request

    {
        "email": "mary123@gmail.com",
        "password": "Blue12345!"
    }

#### Example Response
    {
        "user": {
            "age": 0,
            "_id": "60219c9f0068570017ad3c63",
            "name": "Mary",
            "email": "mary123@gmail.com",
            "createdAt": "2021-02-08T20:18:39.048Z",
            "updatedAt": "2021-02-08T21:38:17.334Z",
            "__v": 2
    },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDIxOWM5ZjAwNjg1NzAwMTdhZDNjNjMiLCJpYXQiOjE2MTI4MjAyOTd9.TfptG9B-D75AxCZjvKAPqPX3vRSOTyLWD8Quv6teid0"
    }

### Logout 

Logs the user out of their current session.

POST `/users/logout`

### Logout all
Logs the user out of all sessions.

POST `/users/logoutAll`

### Read user profile

GET `/users/me`

#### Example Response

    {
        "age": 0,
        "_id": "6021b0df40556c00175c93aa",
        "name": "Mary",
        "email": "mary456@mail.com",
        "createdAt": "2021-02-08T21:45:03.236Z",
        "updatedAt": "2021-02-08T22:12:00.418Z",
        "__v": 6
    }

### Update user

PATCH `/users/me`

#### Allowed Updates

    name: String
    email: String
    password: String
    age: Number

#### Example Request
    
    {
        "name": "Mary Joseph",
        "age": "24",
        "email": "mary456@gmail.com",
        "password": "Blue5678!"
    }

#### Example Response

    {
        "age": 23,
        "_id": "6021b0df40556c00175c93aa",
        "name": "Mary",
        "email": "mary456@mail.com",
        "createdAt": "2021-02-08T21:45:03.236Z",
        "updatedAt": "2021-02-09T18:01:06.270Z",
        "__v": 8
    }

### Delete user

DELETE `/users/me`

#### Example Response

    {
        "age": 24,
        "_id": "6021b0df40556c00175c93aa",
        "name": "Mary Joseph",
        "email": "mary456@gmail.com",
        "createdAt": "2021-02-08T21:45:03.236Z",
        "updatedAt": "2021-02-09T19:46:46.189Z",
        "__v": 10
    }

## Task Requests

---

### Create a task

POST `/tasks`

#### Required

    description: String

#### Optional

    completed: Boolean

#### Example Request

    {
        "description": "Take out the trash"
    }

#### Example Response

    {
        "completed": false,
        "_id": "6022f1fbebaf0800170052fc",
        "description": "Take out the trash",
        "owner": "6022e917ebaf0800170052f9",
        "createdAt": "2021-02-09T20:35:07.653Z",
        "updatedAt": "2021-02-09T20:35:07.653Z",
        "__v": 0
    }

### Read tasks

GET `/tasks`

#### Supported Queries

`/tasks?completed=true`

`/tasks?limit=10&skip=20`

`/tasks?sortBy=createdAt:desc`

#### Example Response

    [
        {
            "completed": false,
            "_id": "6022f1fbebaf0800170052fc",
            "description": "Take out the trash",
            "owner": "6022e917ebaf0800170052f9",
            "createdAt": "2021-02-09T20:35:07.653Z",
            "updatedAt": "2021-02-09T20:35:07.653Z",
            "__v": 0
        },
        {
            "completed": false,
            "_id": "6022f773ebaf0800170052fe",
            "description": "Wash the dishes",
            "owner": "6022e917ebaf0800170052f9",
            "createdAt": "2021-02-09T20:58:27.247Z",
            "updatedAt": "2021-02-09T20:58:27.247Z",
            "__v": 0
        }
    ]

### Read tasks by id

GET `/tasks/:id`

### Update tasks by id

PATCH `/tasks/:id`

#### Allowed Updates

    description: String
    completed: Boolean

#### Example Request

    {
        "completed": "true"
    }

#### Example Response

    {
        "completed": true,
        "_id": "6022f1fbebaf0800170052fc",
        "description": "Take out the trash",
        "owner": "6022e917ebaf0800170052f9",
        "createdAt": "2021-02-09T20:35:07.653Z",
        "updatedAt": "2021-02-09T21:24:50.803Z",
        "__v": 0
    }

### Delete tasks by id

DELETE `/tasks/:id`

#### Example Response

    {
        "completed": false,
        "_id": "6022f773ebaf0800170052fe",
        "description": "Wash the dishes",
        "owner": "6022e917ebaf0800170052f9",
        "createdAt": "2021-02-09T20:58:27.247Z",
        "updatedAt": "2021-02-09T20:58:27.247Z",
        "__v": 0
    }

Special thanks to [Andrew Mead](https://www.udemy.com/user/andrewmead/)


    


