# CodeCraftHub - Learning Management System

## Project Description
CodeCraftHub is a simple learning management system API built with Node.js and Express.

It allows users to create, view, update and delete courses.

## Technologies Used
- Node.js
- Express.js
- JavaScript
- JSON file storage

## Installation

1. Clone or download the project.
2. Open the project folder in the terminal.
3. Install the dependencies:

```bash
npm install
```

## Running the Project

Start the server using:

```bash
npm start
```

The API runs on port 5001.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/courses | Create a course |
| GET | /api/courses | Get all courses |
| GET | /api/courses/:id | Get one course |
| PUT | /api/courses/:id | Update a course |
| DELETE | /api/courses/:id | Delete a course |

## Course Status Options
- not-started
- in-progress
- completed

## Data Storage
Courses are stored in a local `courses.json` file.