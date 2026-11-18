
// app.js

// Import required packages
const express = require("express");
const cors = require("cors");
const fs = require("fs").promises;
const path = require("path");
const crypto = require("crypto");

// Create the Express application
const app = express();

// The server will run on port 5001
const PORT = 5001;

// Store courses.json in the same folder as this app.js file
const COURSES_FILE = path.join(__dirname, "courses.json");

// These are the only allowed course status values
const ALLOWED_STATUSES = [
  "Not Started",
  "In Progress",
  "Completed",
];

// Allow the frontend to communicate with the backend
app.use(cors());

// Allow Express to read JSON request bodies
app.use(express.json());

// Make sure courses.json exists
async function ensureCoursesFile() {
  try {
    await fs.access(COURSES_FILE);
  } catch (error) {
    await fs.writeFile(COURSES_FILE, "[]", "utf8");
  }
}

// Read all courses
async function readCourses() {
  await ensureCoursesFile();

  const fileContents = await fs.readFile(COURSES_FILE, "utf8");
  const courses = JSON.parse(fileContents);

  if (!Array.isArray(courses)) {
    const error = new Error("courses.json must contain an array.");
    error.statusCode = 500;
    throw error;
  }

  return courses;
}

// Save all courses
async function writeCourses(courses) {
  await fs.writeFile(
    COURSES_FILE,
    JSON.stringify(courses, null, 2),
    "utf8"
  );
}

// Create an error with an HTTP status code
function createError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

// Validate course information
function validateCourseFields(course, partialUpdate = false) {
  if (!course || typeof course !== "object" || Array.isArray(course)) {
    throw createError("Request body must be a JSON object.");
  }

  const requiredFields = [
    "name",
    "description",
    "targetDate",
    "status",
  ];

  if (!partialUpdate) {
    for (const field of requiredFields) {
      if (
        course[field] === undefined ||
        course[field] === null ||
        String(course[field]).trim() === ""
      ) {
        throw createError(`The "${field}" field is required.`);
      }
    }
  }

  for (const field of requiredFields) {
    if (course[field] !== undefined) {
      if (
        course[field] === null ||
        String(course[field]).trim() === ""
      ) {
        throw createError(`The "${field}" field cannot be empty.`);
      }
    }
  }

  if (
    course.status !== undefined &&
    !ALLOWED_STATUSES.includes(course.status)
  ) {
    throw createError(
      `Invalid status. Allowed values are: ${ALLOWED_STATUSES.join(", ")}.`
    );
  }

  if (course.targetDate !== undefined) {
    const targetDate = new Date(course.targetDate);

    if (Number.isNaN(targetDate.getTime())) {
      throw createError(
        "The targetDate must be a valid date, such as 2026-12-31."
      );
    }
  }

  for (const field of ["name", "description"]) {
    if (
      course[field] !== undefined &&
      typeof course[field] !== "string"
    ) {
      throw createError(`The "${field}" field must be a string.`);
    }
  }
}

// Handle asynchronous route errors
function asyncHandler(handler) {
  return function (request, response, next) {
    Promise.resolve(handler(request, response, next)).catch(next);
  };
}

// POST /api/courses - Create a course
app.post(
  "/api/courses",
  asyncHandler(async (request, response) => {
    const courseData = request.body;

    validateCourseFields(courseData);

    const courses = await readCourses();

    const newCourse = {
      id: crypto.randomUUID(),
      name: courseData.name.trim(),
      description: courseData.description.trim(),
      targetDate: courseData.targetDate,
      status: courseData.status,
      creationDate: new Date().toISOString(),
    };

    courses.push(newCourse);
    await writeCourses(courses);

    response.status(201).json({
      message: "Course created successfully.",
      course: newCourse,
    });
  })
);

// GET /api/courses - Get all courses
app.get(
  "/api/courses",
  asyncHandler(async (request, response) => {
    const courses = await readCourses();
    response.status(200).json(courses);
  })
);

// GET /api/courses/:id - Get one course
app.get(
  "/api/courses/:id",
  asyncHandler(async (request, response) => {
    const courses = await readCourses();

    const course = courses.find(
      (item) => item.id === request.params.id
    );

    if (!course) {
      throw createError("Course not found.", 404);
    }

    response.status(200).json(course);
  })
);

// PUT /api/courses/:id - Update a course
app.put(
  "/api/courses/:id",
  asyncHandler(async (request, response) => {
    const updateData = request.body;

    validateCourseFields(updateData, true);

    const courses = await readCourses();

    const courseIndex = courses.findIndex(
      (item) => item.id === request.params.id
    );

    if (courseIndex === -1) {
      throw createError("Course not found.", 404);
    }

    const existingCourse = courses[courseIndex];

    const updatedCourse = {
      ...existingCourse,
      ...(updateData.name !== undefined && {
        name: updateData.name.trim(),
      }),
      ...(updateData.description !== undefined && {
        description: updateData.description.trim(),
      }),
      ...(updateData.targetDate !== undefined && {
        targetDate: updateData.targetDate,
      }),
      ...(updateData.status !== undefined && {
        status: updateData.status,
      }),
    };

    courses[courseIndex] = updatedCourse;
    await writeCourses(courses);

    response.status(200).json({
      message: "Course updated successfully.",
      course: updatedCourse,
    });
  })
);

// DELETE /api/courses/:id - Delete a course
app.delete(
  "/api/courses/:id",
  asyncHandler(async (request, response) => {
    const courses = await readCourses();

    const courseIndex = courses.findIndex(
      (item) => item.id === request.params.id
    );

    if (courseIndex === -1) {
      throw createError("Course not found.", 404);
    }

    const deletedCourse = courses.splice(courseIndex, 1)[0];

    await writeCourses(courses);

    response.status(200).json({
      message: "Course deleted successfully.",
      course: deletedCourse,
    });
  })
);

// Handle routes that do not exist
app.use((request, response) => {
  response.status(404).json({
    error: "Route not found.",
  });
});

// Central error-handling middleware
app.use((error, request, response, next) => {
  console.error(error);

  if (
    error instanceof SyntaxError &&
    error.status === 400 &&
    error.body !== undefined
  ) {
    return response.status(400).json({
      error: "Invalid JSON format.",
    });
  }

  response.status(error.statusCode || 500).json({
    error: error.statusCode
      ? error.message
      : "An unexpected server error occurred.",
  });
});

// Start the server
async function startServer() {
  try {
    await ensureCoursesFile();

    app.listen(PORT, () => {
      console.log(`CodeCraftHub API is running on port ${PORT}`);
      console.log(`Courses file: ${COURSES_FILE}`);
    });
  } catch (error) {
    console.error("Unable to start the server:", error);
    process.exit(1);
  }
}

startServer();
