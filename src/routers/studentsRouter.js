const express = require("express");
const students = require("../models/students");

const studentsRouter = express.Router();

// "/students"

studentsRouter

  .post("/", (req, res) => {
    if (req.body.firstName && req.body.age < 18) {
      const id = students.length + 1;
      const newStudent = {
        id,
        ...req.body
      };
      students.push(newStudent);
      res.status(200).json({
        student: newStudent
      });
    } else {
      res.status(400).send("Invalid Student");
    }
  })
  .patch("/:id", (req, res) => {
    try {
      let student = students.find(student => {
        return student.id === parseInt(req.params.id);
      });
      student = {
        ...student,
        ...req.body
      };
      let studentIndex;
      for (let i = 0; i < students.length; i++) {
        if (students[i].id === parseInt(req.params.id)) {
          studentIndex = i;
        }
      }
      students[studentIndex] = student;

      res.status(200).json({});
    } catch (e) {
      res.status(500).send("Internal Server Error");
    }
  })
  .delete("/:id", (req, res) => {
    try {
      let studentIndex;
      for (let i = 0; i < students.length; i++) {
        if (students[i].id === parseInt(req.params.id)) {
          studentIndex = i;
        }
      }
      if (studentIndex) {
        students.splice(studentIndex, 1);
        res.status(200).json({});
      } else {
        res.status(400).send("Invalid Student");
      }
    } catch (e) {
      res.status(500).send("Internal Server Error");
    }
  });

module.exports = studentsRouter;
