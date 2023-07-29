# Project Documentation

## Project Overview

This project implements a real-time keyboard control application that allows two users to share a 2x5 grid keyboard. Each user can interact with the keyboard, lighting up keys in different colors. The control of the keyboard is passed between the users, and it automatically times out after 120 seconds of inactivity.

The application uses a Node.js server with Express for handling HTTP requests and Socket.IO for real-time communication between clients. The backend is built using MongoDB as the database for storing the state of the keyboard and control session.

## Getting Started

To start the project, follow the steps below:

Clone the project repository from the source.

Navigate to the project root directory.

Install the required dependencies by running the following command - npm install

Create a .env file in the root directory and add the necessary environment variables. For example, you need to set the DB_CONNECTION_URI variable to the MongoDB connection string.

Start the Node.js server by running-npm start

The server should now be running, and you can access the application by navigating to <http://localhost:{PORT>} in your web browser.

## Database Connection

The project uses MongoDB as the database, and the connection is managed using Mongoose, a popular MongoDB library for Node.js.

## Environment Variables

Before starting the server, make sure to set the necessary environment variables in the .env file. In this project, you need to set the DB_CONNECTION_URI variable, which represents the MongoDB connection string. For example:- DB_CONNECTION_URI=mongodb://localhost:27017/keyboard_app

## Database Connection Initialization

The database connection is established using the mongoConnectionInitializer function provided in the util/dbConnection.js file. This function connects to the MongoDB database using the provided mongooseURI.

In the app.js or main entry point of the application, the connection is established by calling the mongoConnectionInitializer function and starting the server afterward.

# Routers

## Take Control

Endpoint: POST /take-control
Description: Allows a user to take control of the keyboard. Only one user can have control at a time. Control is automatically released after 120 seconds of inactivity.
Request Body:
None
Query Parameters:
user: (string) The unique identifier of the user taking control.
Response:
Status: 200 OK
Body: { "actionStatus": "success", "message": "{user} is now having control" }
Status: 405 Method Not Allowed
Body: { "actionStatus": "fail", "message": "{userHavingControl} already have control" }
Status: 500 Internal Server Error
Body: { "actionStatus": "fail", "message": "user cannot be empty" }

## Set Initial Board

Endpoint: POST /set-initial-board
Description: Sets the initial state of the board with the provided data. This endpoint is called only once during the initialization of the board.
Request Body:
boardData: (object) The initial state of the board.
Response:
Status: 200 OK
Body: { "actionStatus": "success", "message": "Initial data has been saved" }
Status: 405 Method Not Allowed
Body: { "actionStatus": "fail", "message": "data is already present" }
Status: 500 Internal Server Error
Body: { "actionStatus": "fail", "message": "boardData cannot be empty" }

## Get Board Status

Endpoint: GET /getBoardStatus
Description: Retrieves the current status of the board.
Request Body:
None
Response:
Status: 200 OK
Body: { "actionStatus": "success", "message": { "white": [...], "yellow": [...], "red": [...] } }

## Change Board Status

Endpoint: POST /user/changeBoardStatus
Description: Allows a user to change the status of a key on the board. The user must have control to perform this action.
Request Body:
userAction: (string) The action performed by the user (e.g., key clicked).
Query Parameters:
user: (string) The unique identifier of the user performing the action.
Response:
Status: 200 OK
Body: { "actionStatus": "success", "message": { "white": [...], "yellow": [...], "red": [...] } }
Status: 405 Method Not Allowed
Body: { "actionStatus": "false", "message": "control session is not active" }
Status: 500 Internal Server Error
Body: { "actionStatus": "fail", "message": "user or userAction cannot be empty" }

# Controllers

## takeControl

Description: Handles the "takeControl" API endpoint.
Request:
Method: POST
Endpoint: /take-control
Response:
Status: 200 OK
Body: { "actionStatus": "success", "message": "{user} is now having control" }
Status: 405 Method Not Allowed
Body: { "actionStatus": "fail", "message": "{userHavingControl} already have control" }
Status: 500 Internal Server Error
Body: { "actionStatus": "fail", "message": "user cannot be empty" }

## setInitialBoard

Description: Handles the "setInitialBoard" API endpoint.
Request:
Method: POST
Endpoint: /set-initial-board
Response:
Status: 200 OK
Body: { "actionStatus": "success", "message": "Initial data has been saved" }
Status: 405 Method Not Allowed
Body: { "actionStatus": "fail", "message": "data is already present" }
Status: 500 Internal Server Error
Body: { "actionStatus": "fail", "message": "boardData cannot be empty" }

## getBoardStatusController

Description: Handles the "getBoardStatus" API endpoint.
Request:
Method: GET
Endpoint: /getBoardStatus
Response:
Status: 200 OK
Body: { "actionStatus": "success", "message": { "white": [...], "yellow": [...], "red": [...] } }

## changeBoardStatus

Description: Handles the "changeBoardStatus" API endpoint.
Request:
Method: POST
Endpoint: /user/changeBoardStatus
Response:
Status: 200 OK
Body: { "actionStatus": "success", "message": { "white": [...], "yellow": [...], "red": [...] } }
Status: 405 Method Not Allowed
Body: { "actionStatus": "false", "message": "control session is not active" }
Status: 500 Internal Server Error
Body: { "actionStatus": "fail", "message": "user or userAction cannot be empty" }

# Services

## checkTakeControlStatus

Description: Checks if a user can take control based on the current state of the board.
Return Value: (object)
action: (boolean) Indicates if the user can take control (true) or not (false).
userHavingControl: (string) If action is false, indicates the user who currently has control.

## processTakeControl

Description: Processes the action when a user takes control of the board.
Parameters:
userId: (string) The unique identifier of the user taking control.
Operation:
Inserts the user's control session into the database.
Schedules an automatic removal of control after 120 seconds of inactivity.

## setInitialBoardData

Description: Sets the initial state of the board with the provided data. This function is called during the initialization of the board.
Parameters:
data: (object) The initial state of the board.
Return Value: (object)
action: (string) Indicates if the operation is successful ('success') or not ('fail').
message: (string) A message detailing the result of the operation.

## getBoardStatusService

Description: Retrieves the current status of the board from the database.
Return Value: (object)
action: (string) Indicates if the operation is successful ('success') or not ('fail').
message: (object) The current status of the board, containing 'white', 'yellow', and 'red' arrays.

## checkUserHavingControlService

Description: Checks if a user has control over the board.
Parameters:
user: (string) The unique identifier of the user to check.
Return Value: (object)
action: (string) Indicates if the user has control ('success') or not ('false').
message: (string) A message detailing the result of the check.

## processChangeBoardStatus

Description: Processes the action when a user changes the status of a key on the board.
Parameters:
user: (string) The unique identifier of the user performing the action.
userAction: (string) The action performed by the user (e.g., key clicked).
Side Effects:
Updates the board's status in the database based on the user's action.
Clears the control session if it exists and releases control.
Return Value: (object)
action: (string) Indicates if the operation is successful ('success') or not ('fail').
message: (object) The updated status of the board, containing 'white', 'yellow', and 'red' arrays.

# Utilities

## getUnixTimeStamp

Description: Converts a JavaScript Date object to a Unix timestamp (in seconds).
Parameters:
date: (Date) The Date object to convert to a timestamp.
Return Value: (number) The Unix timestamp of the input date in seconds.

## Sys

Description: An object containing system-level variables and cache.
Properties:
controlSessionId: (number|null) The timer ID returned by setTimeout for controlling the session. null if no session is active.
Socket: (object) The Socket.IO instance for emitting events.
