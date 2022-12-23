const express = require('express');
const hireJobRoute = express.Router();
const { checkTokenInAPI } = require('../middleware/auth')

const {
  getHireJobList,
  getHireJobById,

  addHireJob,

  updateHireJob,
  updateCompletedHireJob,

  deleteHireJob
} = require("../controller/hireJobController")

// GET
hireJobRoute.get("/", getHireJobList)
hireJobRoute.get("/lay-thong-tin-thue-cong-viec/:id", getHireJobById)

// POST
hireJobRoute.post("/", checkTokenInAPI, addHireJob)

// PUT
hireJobRoute.put("/:id", checkTokenInAPI, updateHireJob)
hireJobRoute.put("/hoan-thanh-cong-viec/:id", checkTokenInAPI, updateCompletedHireJob)

// DELETE
hireJobRoute.delete("/:id", checkTokenInAPI, deleteHireJob)

module.exports = hireJobRoute
