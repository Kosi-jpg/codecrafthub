# CodeCraftHub – Course Management Dashboard

## About the Project

CodeCraftHub is a course management dashboard that allows users to create, view, update, and delete courses.

The project uses a frontend dashboard connected to a Node.js and Express backend. Course information is stored in a JSON file.

## Technologies Used

- HTML
- CSS
- JavaScript
- Node.js
- Express.js
- JSON
- CORS

## Project Structure

```text
CodeCraftHub/
├── node_modules/
├── app.js
├── courses.json
├── index.html
├── package.json
├── package-lock.json
└── README.md
```

## Installation

1. Open the CodeCraftHub project folder in VS Code.
2. Open the terminal.
3. Install the required dependencies:

```bash
npm install
```

## Running the Backend

Start the backend server using:

```bash
npm start
```

The API runs at:

```text
http://localhost:5001
```

To view all courses, visit:

```text
http://localhost:5001/api/courses
```

Keep the backend terminal running while using the dashboard.

## Running the Frontend

1. Open `index.html` in VS Code.
2. Right-click the file.
3. Select **Open with Live Server**, or click **Go Live**.
4. The dashboard will open in your browser.

The frontend connects to:

```text
http://localhost:5001/api/courses
```

## Course Information

Each course contains:

- `id` – Automatically generated course ID.
- `name` – Course name.
- `description` – Course description.
- `targetDate` – Course target date.
- `status` – Course progress.
- `creationDate` – Automatically generated creation date.

Available course statuses:

- Not Started
- In Progress
- Completed

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/courses` | Create a course |
| GET | `/api/courses` | Get all courses |
| GET | `/api/courses/:id` | Get one course |
| PUT | `/api/courses/:id` | Update a course |
| DELETE | `/api/courses/:id` | Delete a course |

## Features

- View all courses.
- Add new courses.
- Edit existing courses.
- Delete courses.
- Search and filter courses.
- View course statistics.
- Save course information in `courses.json`.
- Responsive dashboard layout.

## Data Storage

Course information is stored locally in `courses.json`.

The backend reads and updates this file whenever courses are created, edited, or deleted.

## Project Status

The frontend and backend are connected, and the main course management features have been tested.