const teachers = require("../models/teachers");
const express = require("express");
const teacherRouter = express.Router();

teacherRouter
  .get("/data", (req, res) => {
    res.status(200).json({ teachers });
  })
  .get("/:id", (req, res) => {
    try {
      const teacher = teachers.find(e => {
        return e.id === parseInt(req.params.id);
      });

      if (teacher) {
        res.status(200).json({
          teacher
        });
      } else {
        res.status(400).send("Student Not found!");
      }
    } catch (e) {
      res.status(500).send("Internal Server Error");
    }
  })
  .post("/", (req, res) => {
    if (req.body.firstName && req.body.age < 18) {
      let id = teachers.length + 1;
      newTeacher = {
        id,
        ...req.body
      };
      teachers.push(newTeacher);
      res.status(200).json(newTeacher);
    } else {
      res.status(500).send("invalid student");
    }
  })
  .patch("/:id", (req, res) => {
    let teacher = teachers.find(teacher => {
      return teacher.id === parseInt(req.params.id);
    });
    if (teacher) {
      teacher = {
        ...teacher,
        ...req.body
      };
      let teacherIndex;
      for (let i = 0; i < teachers.length; i++) {
        if (teachers[i].id === parseInt(req.params.id)) {
          teacherIndex = i;
        }
      }
      teachers[teacherIndex] = teacher;

      res.status(200).json({ teacher });
    } else {
      res.setatus(400).send("no teacher with this id");
    }
  })
  .delete("/:id", (req, res) => {
    try {
      let teacherIndex;
      for (let i = 0; i < teachers.length; i++) {
        if (teachers[i].id === parseInt(req.params.id)) {
          teacherIndex = i;
        }
      }
      if (teacherIndex) {
        teachers.splice(teacherIndex, 1);
        res.status(200).send("student deleted");
      } else {
        res.status(400).send("no details for given id");
      }
    } catch (e) {
      res.status(500).send(e);
    }
  });

module.exports = teacherRouter;
