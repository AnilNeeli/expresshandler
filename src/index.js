const express = require("express");
const studentsRouter = require("./routers/studentsRouter");
const teacherRouter = require("./routers/teacherRouter");

const bodyParser = require("body-parser");
const expressHbs = require("express-handlebars");
const path = require("path");
const students = require("./models/students");
const teachers = require("./models/teachers");
const ifequality = require("../src/views/helpers/ifequality");
const ifuser = require("../src/views/helpers/ifuser");
const formatIndex = require("../src/views/helpers/formatIndex");

const app = express();
app.use(bodyParser.json());
// Creating a config for handlebars engine
const hbs = expressHbs.create({
  extname: ".hbs",
  layoutsDir: path.join(__dirname, "./views/layouts"),
  partialsDir: path.join(__dirname, "./views/partials"),
  helpers: {
    ifequality,
    ifuser,
    formatIndex
  }
});
// Define which engines are available
app.engine(".hbs", hbs.engine);
// Set default engine to use
app.set("view engine", ".hbs");
// Let express know where all the views are present
app.set("views", path.join(__dirname, "./views"));

app.get("/", (req, res) => {
  res.render("home", {
    layout: "hero",
    pageTitle: "Home"
  });
});

app.get("/students", (req, res) => {
  res.render("student", {
    layout: "navigation",
    pageTitle: "students",
    user: "students",
    students
  });
});
app.get("/add-student", (req, res) => {
  res.render("add-form", {
    layout: "navigation",
    action: "/api/students",
    method: "POST",
    pageTitle: "Add Student",
    mode: "add",
    user: "students"
  });
});

app.get("/edit-student/:id", (req, res) => {
  try {
    const student = students.find(student => {
      return student.id === parseInt(req.params.id);
    });

    if (student) {
      res.render("edit-form", {
        layout: "navigation",
        action: "/api/students/" + student.id,
        method: "PATCH",
        pageTitle: "Edit Student - " + student.firstName,
        mode: "edit",
        user: "students",
        student
      });
    } else {
      res.status(400).send("Student Not found!");
    }
  } catch (e) {
    console.log(e);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/delete-student/:id", (req, res) => {
  try {
    let studentIndex;
    for (let i = 0; i < students.length; i++) {
      if (students[i].id === parseInt(req.params.id)) {
        studentIndex = i;
      }
    }
    if (typeof studentIndex !== "undefined") {
      students.splice(studentIndex, 1);
      res.redirect("/students");
    } else {
      res.status(400).send("Invalid Student");
    }
  } catch (e) {
    res.status(500).send("Internal Server Error");
  }
});
app.use("/api/students", studentsRouter);

app.get("/teachers", (req, res) => {
  res.render("teacher", {
    layout: "navigation",
    pageTitle: "teachers",
    teachers
  });
});
app.get("/delete-teacher/:id", (req, res) => {
  try {
    let teacherIndex;
    for (let i = 0; i < teachers.length; i++) {
      if (teachers[i].id === parseInt(req.params.id)) {
        teacherIndex = i;
      }
    }
    if (typeof teacherIndex !== "undefined") {
      teachers.splice(teacherIndex, 1);
      res.redirect("/teachers");
    } else {
      res.status(400).send("Invalid Student");
    }
  } catch (e) {
    res.status(500).send("Internal Server Error");
  }
});
app.use("/api/teachers", teacherRouter);

app.get("/add-teacher", (req, res) => {
  res.render("add-form", {
    layout: "navigation",
    action: "/api/teachers",
    method: "POST",
    pageTitle: "Add teacher",
    mode: "add"
  });
});

app.get("/edit-teacher/:id", (req, res) => {
  try {
    const teacher = teachers.find(teacher => {
      return teacher.id === parseInt(req.params.id);
    });

    if (teacher) {
      res.render("edit-form", {
        layout: "navigation",
        action: "/api/teachers/" + teacher.id,
        method: "PATCH",
        pageTitle: "Edit teacher - " + teacher.firstName,
        mode: "edit",
        teacher
      });
    } else {
      res.status(400).send("teacher Not found!");
    }
  } catch (e) {
    console.log(e);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(8080, () => {
  console.log("Server Running!");
});
